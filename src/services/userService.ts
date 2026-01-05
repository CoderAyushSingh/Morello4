import { doc, getDoc, setDoc, collection, query, where, getDocs, runTransaction } from "firebase/firestore";
import { User } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";

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
}

export const getUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
        const docRef = doc(db, "users", user.uid);

        // Use a transaction to prevent race conditions (e.g., Signup writes while AuthContext reads empty)
        return await runTransaction(db, async (transaction) => {
            const docSnap = await transaction.get(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Migration check: if old format, migrate to new format in memory AND SAVE IT
                const profile = data as UserProfile;
                if (!profile.socialLinks || !profile.stats) {
                    const updatedProfile = {
                        ...profile,
                        socialLinks: profile.socialLinks || {
                            instagram: data.instagram || '',
                            twitter: data.twitter || '',
                            youtube: data.youtube || ''
                        },
                        stats: profile.stats || {
                            reviews: 12,    // Seed data
                            collections: 5, // Seed data
                            followers: 42   // Seed data
                        }
                    };

                    // Persist the migration!
                    transaction.set(docRef, updatedProfile, { merge: true });
                    return updatedProfile;
                }
                return profile;
            } else {
                // Auto-create document for existing users who don't have one
                const newProfile: UserProfile = {
                    username: user.displayName || 'User',
                    firstName: user.displayName ? user.displayName.split(' ')[0] : '',
                    lastName: user.displayName && user.displayName.split(' ').length > 1 ? user.displayName.split(' ').slice(1).join(' ') : '',
                    dob: '',
                    bio: '',
                    photoURL: user.photoURL || '',
                    socialLinks: {
                        instagram: '',
                        twitter: '',
                        youtube: ''
                    },
                    stats: {
                        reviews: 12,    // Seed data
                        collections: 5, // Seed data
                        followers: 42   // Seed data
                    },
                    email: user.email || '',
                    createdAt: new Date().toISOString(),
                    usernameChanged: false
                };

                transaction.set(docRef, newProfile);
                return newProfile;
            }
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty;
    } catch (error) {
        console.error("Error checking username availability:", error);
        return false;
    }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    try {
        const docRef = doc(db, "users", uid);
        // use setDoc with merge: true to create if not exists or update fields
        await setDoc(docRef, data, { merge: true });
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

export const uploadProfileImage = async (uid: string, file: File): Promise<string> => {
    try {
        const storageRef = ref(storage, `profile_images/${uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading profile image:", error);
        throw error;
    }
};
