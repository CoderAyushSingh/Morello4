import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile, UserProfile } from '../services/userService';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (firebaseUser: User) => {
        try {
            console.log("🔄 Fetching profile for:", firebaseUser.uid);
            const profile = await getUserProfile(firebaseUser);
            console.log("✅ Profile fetched:", profile);
            setUserProfile(profile);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setUserProfile(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                await fetchProfile(firebaseUser);
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserProfile(null);
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const refreshProfile = async () => {
        console.log("🔄 Refreshing profile manually...");
        if (user) {
            await fetchProfile(user);
        } else {
            console.warn("⚠️ Cannot refresh profile: No user logged in.");
        }
    };

    const value = {
        user,
        userProfile,
        loading,
        logout,
        refreshProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
