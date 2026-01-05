
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, UserProfile } from '../services/userService';
import { Edit2, MapPin, Calendar, Link as LinkIcon, Instagram, Twitter, Youtube, Share2 } from 'lucide-react';

interface ProfileProps {
    onNavigate: (page: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
    const { user, userProfile, loading } = useAuth();

    // Use profile from context, or fall back to user metadata if profile is somehow missing
    const displayProfile = {
        username: userProfile?.username || user?.displayName || 'Morello User',
        firstName: userProfile?.firstName || '',
        lastName: userProfile?.lastName || '',
        bio: userProfile?.bio || 'No bio yet.',
        avatar: userProfile?.photoURL || user?.photoURL,
        instagram: userProfile?.socialLinks?.instagram,
        twitter: userProfile?.socialLinks?.twitter,
        youtube: userProfile?.socialLinks?.youtube,
        joinDate: user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'
    };

    // We can rely on AuthContext loading state
    if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;



    // Fallback data if profile is incomplete or not yet set


    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">

            {/* Cover Image Area */}
            <div className="h-64 md:h-80 w-full bg-gradient-to-b from-zinc-800 to-[#0a0a0a] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2031&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 relative -mt-32 pb-20">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8 group">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0a0a0a] bg-zinc-800 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500">
                            {displayProfile.avatar ? (
                                <img src={displayProfile.avatar} alt={displayProfile.username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-zinc-600 bg-zinc-900">
                                    {displayProfile.firstName ? displayProfile.firstName.charAt(0) : displayProfile.username.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 mb-2 md:mb-4">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-1 flex items-center gap-2">
                            {displayProfile.firstName} {displayProfile.lastName}
                        </h1>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-3">@{displayProfile.username}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-medium">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined {displayProfile.joinDate}</span>
                            {/* Placeholder for location if added later */}
                            {/* <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> New York, USA</span> */}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mb-4 w-full md:w-auto">
                        <button
                            onClick={() => onNavigate('settings')}
                            className="flex-1 md:flex-none h-10 px-6 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </button>
                        <button className="h-10 w-10 bg-zinc-900 border border-zinc-800 text-white rounded-lg flex items-center justify-center hover:bg-zinc-800 transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Bio & Socials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

                    {/* Left Column: Bio & About */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">About Me</h2>
                            <p className="text-zinc-300 leading-relaxed font-light text-sm md:text-base whitespace-pre-wrap">
                                {displayProfile.bio}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <StatCard label="Reviews" value={userProfile?.stats?.reviews?.toString() || "0"} />
                            <StatCard label="Collections" value={userProfile?.stats?.collections?.toString() || "0"} />
                            <StatCard label="Followers" value={userProfile?.stats?.followers?.toString() || "0"} />
                        </div>
                    </div>

                    {/* Right Column: Socials & Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Connect</h2>
                            <div className="space-y-4">
                                {displayProfile.instagram && <SocialLink icon={Instagram} label="Instagram" href={displayProfile.instagram} username="Instagram" />}
                                {displayProfile.twitter && <SocialLink icon={Twitter} label="Twitter" href={displayProfile.twitter} username="Twitter" />}
                                {displayProfile.youtube && <SocialLink icon={Youtube} label="YouTube" href={displayProfile.youtube} username="YouTube" />}

                                {!displayProfile.instagram && !displayProfile.twitter && !displayProfile.youtube && (
                                    <p className="text-zinc-600 text-xs italic">No social links added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-xl text-center hover:bg-zinc-900/50 transition-colors cursor-default">
        <div className="text-2xl font-black text-white mb-1">{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</div>
    </div>
);

const SocialLink = ({ icon: Icon, label, href, username }: any) => {
    // Ensure href has protocol
    const link = href.startsWith('http') ? href : `https://${href}`;

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-all group border border-transparent hover:border-zinc-800"
        >
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:scale-110 transition-all">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <div className="text-xs font-bold text-zinc-300 group-hover:text-white">{label}</div>
                <div className="text-[10px] text-zinc-600 group-hover:text-zinc-500">View Profile</div>
            </div>
            <LinkIcon className="w-3 h-3 ml-auto text-zinc-700 group-hover:text-zinc-500 opacity-0 group-hover:opacity-100 transition-all" />
        </a>
    );
};

export default Profile;
