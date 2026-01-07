import { supabase } from "../config/supabaseClient";
import { User } from "firebase/auth";

export interface UserProfile {
    username: string;
    firstName: string;
    lastName: string;
    dob: string;
    bio: string;
    photoURL?: string;
    socialLinks: {
        instagram: string;
        twitter: string;
        youtube: string;
    };
    usernameChanged?: boolean;
    email?: string;
    createdAt?: string;
    stats?: {
        reviews: number;
        collections: number;
        followers: number;
    };
    photoChangeCount?: number;
}

export const getUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.uid) // Use Firebase UID
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found'
            console.error("Error fetching user profile:", error);
            throw error;
        }

        if (data) {
            return {
                username: data.username,
                firstName: data.first_name,
                lastName: data.last_name,
                dob: data.dob,
                bio: data.bio,
                photoURL: data.photo_url || user.photoURL || '',
                socialLinks: data.social_links || { instagram: '', twitter: '', youtube: '' },
                stats: data.stats || { reviews: 0, collections: 0, followers: 0 },
                email: data.email,
                createdAt: data.created_at,
                photoChangeCount: data.photo_change_count || 0,
                // Fallback: Check if username matches auto-generated pattern or is simply present
                // Priority: DB column -> Heuristic
                // Priority: DB column -> Heuristic
                usernameChanged: data.username_changed !== undefined ? data.username_changed : (data.username && !data.username.startsWith('user_'))
            };
        } else {
            // Auto-create profile for new users (Hybrid: Firebase Auth -> Supabase DB)
            const newProfile: any = {
                id: user.uid, // Use Firebase UID as Primary Key
                email: user.email,
                username: user.displayName?.replace(/\s+/g, '').toLowerCase() || `user_${user.uid.slice(0, 6)}`,
                first_name: user.displayName?.split(' ')[0] || '',
                last_name: user.displayName?.split(' ').slice(1).join(' ') || '',
                dob: '',
                bio: '',
                social_links: { instagram: '', twitter: '', youtube: '' },
                stats: { reviews: 0, collections: 0, followers: 0 },
                // username_changed: false // Remove potentially invalid column
            };

            const { error: insertError } = await supabase
                .from('users')
                .insert([newProfile]);

            if (insertError) {
                console.error("Error creating user profile:", insertError);
            }

            return {
                username: newProfile.username,
                firstName: newProfile.first_name,
                lastName: newProfile.last_name,
                dob: newProfile.dob,
                bio: newProfile.bio,
                socialLinks: newProfile.social_links,
                stats: newProfile.stats,
                email: newProfile.email,
                createdAt: new Date().toISOString()
            };
        }
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        return null; // Return null gracefully
    }
};

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
        const { count, error } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true })
            .eq('username', username);

        if (error) throw error;
        // If count is null (shouldn't be with count: 'exact'), treat as 0
        return (count === 0);
    } catch (error) {
        console.error("Error checking username availability:", error);
        // If error is 406 or similar (Not Acceptable or Permission Denied), we might want to fail open or closed
        // For now, rethrow to let UI handle "Unable to verify"
        throw error;
    }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    try {
        const updates: any = {};
        if (data.username !== undefined) updates.username = data.username;
        if (data.firstName !== undefined) updates.first_name = data.firstName;
        if (data.lastName !== undefined) updates.last_name = data.lastName;
        if (data.bio !== undefined) updates.bio = data.bio;

        // Sanitize DOB
        if (data.dob) {
            const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            const match = data.dob.match(dobRegex);
            if (match) {
                updates.dob = `${match[3]}-${match[2]}-${match[1]}`;
            } else {
                updates.dob = data.dob;
            }
        }

        if (data.socialLinks !== undefined) updates.social_links = data.socialLinks;
        if (data.photoURL !== undefined) updates.photo_url = data.photoURL;

        // Force username_changed to true if username is being updated
        if (data.username !== undefined) {
            updates.username_changed = true;
        } else if (data.usernameChanged !== undefined) {
            updates.username_changed = data.usernameChanged;
        }

        // Add updated_at
        updates.updated_at = new Date().toISOString();

        console.log("Attempting update for:", uid, updates);

        // 1. Try to UPDATE existing row
        const { data: updatedData, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', uid)
            .select(); // Select returns the modified rows

        if (error) {
            if (error.code === '23505') throw new Error("USERNAME_TAKEN");
            throw error;
        }

        // 2. If no row updated, it means user doesn't exist. INSERT them.
        if (!updatedData || updatedData.length === 0) {
            console.log("User not found during update, creating new profile...");

            // Construct a full profile merging defaults + updates
            const newProfile = {
                id: uid,
                email: data.email || '', // Email might be missing if not passed, but acceptable
                username: data.username || `user_${uid.slice(0, 6)}`,
                first_name: data.firstName || '',
                last_name: data.lastName || '',
                bio: data.bio || '',
                dob: updates.dob || null,
                social_links: data.socialLinks || { instagram: '', twitter: '', youtube: '' },
                stats: { reviews: 0, collections: 0, followers: 0 },
                photo_url: data.photoURL || '',
                created_at: new Date().toISOString(),
                ...updates // Override with any provided updates
            };

            const { error: insertError } = await supabase
                .from('users')
                .insert([newProfile]);

            if (insertError) {
                if (insertError.code === '23505') throw new Error("USERNAME_TAKEN");
                console.error("Failed to auto-create user on update:", insertError);
                throw insertError;
            }
        }

    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

export const uploadProfileImage = async (uid: string, file: File, email?: string): Promise<string> => {
    try {
        const fileExt = file.name.split('.').pop();

        // Sanitize email or fallback to UID if email not provided/invalid
        let folderName = uid;
        if (email) {
            // Replace @ and special chars to make it fs-safe but readable
            // e.g. test@example.com -> test_example_com
            folderName = email.replace(/[^a-zA-Z0-9._-]/g, '_');
        }

        const filePath = `${folderName}/profile.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('profile_images')
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('profile_images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error("Error uploading profile image:", error);
        throw error;
    }
};

