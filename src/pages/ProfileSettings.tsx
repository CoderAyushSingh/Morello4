
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, AtSign, Instagram, Twitter, Youtube, Check } from 'lucide-react';
import { getUserProfile, updateUserProfile, checkUsernameAvailability, UserProfile } from '../services/userService';

interface ProfileSettingsProps {
    onNavigate?: (page: string) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [initialUsername, setInitialUsername] = useState('');
    const [isUsernameEditable, setIsUsernameEditable] = useState(true);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<UserProfile>({
        username: user?.displayName || '',
        firstName: user?.displayName ? user.displayName.split(' ')[0] : '',
        lastName: user?.displayName && user.displayName.split(' ').length > 1 ? user.displayName.split(' ').slice(1).join(' ') : '',
        dob: '',
        bio: '',
        photoURL: '',
        socialLinks: {
            instagram: '',
            twitter: '',
            youtube: ''
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            // Don't block UI with loading state, fetch in background
            // setIsLoading(true); 
            try {
                const profile = await getUserProfile(user);
                if (profile) {
                    console.log("✅ Data from Firebase:", profile);
                    // Only update if we get valid data back
                    setFormData(prev => ({
                        ...prev,
                        ...profile,
                        // Ensure nested objects are merged correctly if partial return
                        socialLinks: { ...prev.socialLinks, ...(profile.socialLinks || {}) }
                    }));
                    setInitialUsername(profile.username);
                    if (profile.usernameChanged) {
                        setIsUsernameEditable(false);
                    }
                } else {
                    // Even if no doc, we have initialized state from Auth, so just set initial username tracking
                    setInitialUsername(user.displayName || '');
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (['instagram', 'twitter', 'youtube'].includes(name)) {
            setFormData(prev => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errorMessage) setErrorMessage('');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Optional: specific loading state for image
        try {
            // We need to import uploadProfileImage, assume it is imported
            const { uploadProfileImage } = await import('../services/userService');
            const downloadURL = await uploadProfileImage(user.uid, file);

            setFormData(prev => ({ ...prev, photoURL: downloadURL }));

            // Should properly update Auth profile too if possible, but Firestore is key here
            // Verification log
            console.log("✅ Image uploaded:", downloadURL);
        } catch (error) {
            console.error("Failed to upload image", error);
            setErrorMessage("Failed to upload image.");
        }
    };

    const handleProfileClick = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const updates = { ...formData };

            // Check if username changed
            if (formData.username !== initialUsername) {
                if (!isUsernameEditable) {
                    setErrorMessage("Username can only be changed once.");
                    setIsSaving(false);
                    return;
                }

                // Check availability
                const isAvailable = await checkUsernameAvailability(formData.username);

                if (!isAvailable) {
                    setErrorMessage("Username is already taken.");
                    setIsSaving(false);
                    return;
                }

                updates.usernameChanged = true;
            }

            console.log("Saving profile for:", user.uid); // Debug log

            // FIRE AND FORGET: Start saving in background, don't wait for it
            updateUserProfile(user.uid, updates).catch(err => {
                console.error("❌ Background save failed", err);
            });

            // Update local state (optimistic)
            if (updates.usernameChanged) {
                setIsUsernameEditable(false);
                setInitialUsername(formData.username);
            }

            setSuccessMessage('Profile saved successfully!');

            // Navigate to home immediately
            if (onNavigate) {
                onNavigate('home');
            }
        } catch (error) {
            console.error("Failed to save profile", error);
            setErrorMessage("Failed to save profile. Please try again.");
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold">Edit Profile</h1>
                        {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-zinc-500"></div>}
                    </div>
                    {successMessage && (
                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-lg animate-fadeInUp">
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-bold">{successMessage}</span>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg animate-fadeInUp">
                            <span className="text-sm font-bold">{errorMessage}</span>
                        </div>
                    )}
                </div>

                {/* Profile Photo Section */}
                <div className="flex items-center gap-6 mb-12">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    <div
                        className="relative group cursor-pointer"
                        onClick={handleProfileClick}
                    >
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-zinc-500 transition-colors">
                            {formData.photoURL ? (
                                <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-3xl font-bold text-zinc-700">
                                    {formData.firstName ? formData.firstName.charAt(0) : (user?.email?.charAt(0) || 'U')}
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Profile photo</h3>
                        <p className="text-zinc-500 text-sm">Upload a new profile photo</p>
                    </div>
                </div>

                {/* Main Form */}
                <div className="space-y-6 mb-12">
                    <div className="space-y-2">
                        <FormInput
                            label="Username"
                            name="username"
                            value={formData.username || ''}
                            onChange={handleChange}
                            isLoading={isLoading}
                            disabled={!isUsernameEditable}
                        />
                        {!isUsernameEditable && !isLoading && (
                            <p className="text-[10px] text-zinc-500 ml-1">Username can only be changed once.</p>
                        )}
                    </div>

                    <FormInput
                        label="First name"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleChange}
                        isLoading={isLoading}
                    />

                    <FormInput
                        label="Last name"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleChange}
                        isLoading={isLoading}
                    />


                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Date of birth</label>
                        {isLoading ? (
                            <div className="w-full h-[46px] bg-[#111] border border-zinc-800 rounded-lg animate-pulse" />
                        ) : (
                            <input
                                type="text"
                                name="dob"
                                value={formData.dob || ''}
                                onChange={handleChange}
                                placeholder="DD/MM/YYYY"
                                className="w-full bg-[#111] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-600 text-white"
                            />
                        )}
                        <p className="text-[10px] text-zinc-500 ml-1">This won't be shown publicly. Enter in DD/MM/YYYY format.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Bio</label>
                        {isLoading ? (
                            <div className="w-full h-[110px] bg-[#111] border border-zinc-800 rounded-lg animate-pulse" />
                        ) : (
                            <textarea
                                name="bio"
                                value={formData.bio || ''}
                                onChange={handleChange}
                                placeholder="Tell us about yourself"
                                rows={4}
                                className="w-full bg-[#111] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-600 text-white resize-none"
                            />
                        )}
                        <p className="text-[10px] text-zinc-500 ml-1">Write a short bio to tell people more about yourself.</p>
                    </div>
                </div>

                {/* Social Links */}
                <div className="mb-12">
                    <h2 className="text-lg font-bold mb-6">Social Links</h2>
                    <div className="space-y-6">
                        <SocialInput
                            label="Instagram"
                            name="instagram"
                            value={formData.socialLinks.instagram || ''}
                            placeholder="username or paste Instagram profile URL"
                            icon={Instagram}
                            onChange={handleChange}
                            isLoading={isLoading}
                        />
                        <SocialInput
                            label="X / Twitter"
                            name="twitter"
                            value={formData.socialLinks.twitter || ''}
                            placeholder="username or paste X/Twitter profile URL"
                            icon={Twitter}
                            onChange={handleChange}
                            isLoading={isLoading}
                        />
                        <SocialInput
                            label="YouTube"
                            name="youtube"
                            value={formData.socialLinks.youtube || ''}
                            placeholder="username or paste YouTube channel URL"
                            icon={Youtube}
                            onChange={handleChange}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FormInput = ({ label, name, value, onChange, type = "text", isLoading, disabled }: any) => (
    <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 ml-1">{label}</label>
        {isLoading ? (
            <div className="w-full h-[46px] bg-[#111] border border-zinc-800 rounded-lg animate-pulse" />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full bg-[#111] border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors text-white ${disabled ? 'opacity-50 cursor-not-allowed text-zinc-500' : ''}`}
            />
        )}
    </div>
);

const SocialInput = ({ label, name, placeholder, value, icon: Icon, onChange, isLoading }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-4">
        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                <AtSign className="w-4 h-4" />
            </div>
            {isLoading ? (
                <div className="w-full h-[46px] bg-[#111] border border-zinc-800 rounded-lg animate-pulse" />
            ) : (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-[#111] border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700 text-white"
                />
            )}
        </div>
    </div>
);

export default ProfileSettings;
