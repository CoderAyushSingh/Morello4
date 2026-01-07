
import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import AuthBanner from '../components/auth/AuthBanner';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { supabase } from '../config/supabaseClient';


interface SignupProps {
    onNavigate: (page: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Password Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        // Strong Password Check (Symbol required)
        const strongPasswordRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!strongPasswordRegex.test(password)) {
            setError("Password must contain at least one special symbol (!@#$%).");
            return;
        }

        setLoading(true);

        try {
            // 1. Create User in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Firebase Profile with Full Name
            await updateProfile(user, {
                displayName: fullName
            });

            // 3. Create User Profile in Supabase (Hybrid Bridge)
            // We use the same UID from Firebase as the ID in Supabase Users table
            // IMPORTANT: For this to work, RLS must be disabled or we need a public, permissive policy for inserts
            const newProfile = {
                id: user.uid,
                email: user.email,
                username: fullName.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).substring(7),
                first_name: fullName.split(' ')[0] || '',
                last_name: fullName.split(' ').slice(1).join(' ') || '',
                created_at: new Date().toISOString(),
                bio: '',
                social_links: { instagram: '', twitter: '', youtube: '' },
                stats: { reviews: 0, collections: 0, followers: 0 }
            };

            const { error: supabaseError } = await supabase
                .from('users')
                .insert([newProfile]);

            if (supabaseError) {
                console.error("Supabase profile creation failed:", supabaseError);
                // We don't block the user, as AuthContext can try to create it again on login
            }

            // 4. Navigate to Home
            onNavigate('home');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered.');
            } else {
                setError('Failed to create account: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen w-full flex bg-[#F3F4F6]">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-24 flex flex-col justify-center relative min-h-screen lg:min-h-0">
                <div
                    className="flex items-center gap-3 mb-12 lg:mb-0 cursor-pointer lg:absolute lg:top-12 lg:left-24 transition-opacity hover:opacity-80"
                    onClick={() => onNavigate('home')}
                >
                    <img src={logo} alt="Morello" className="w-10 h-10 object-contain" />
                    <span className="text-2xl font-black tracking-tighter uppercase text-black">MORELLO</span>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-zinc-900">Sign up</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 pl-10 text-base lg:text-sm text-black focus:outline-none focus:border-black transition-colors"
                                    required
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="johndoe@gmail.com"
                                    className="w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 pl-10 text-base lg:text-sm text-black focus:outline-none focus:border-black transition-colors"
                                    required
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 pl-10 pr-12 text-base lg:text-sm text-black focus:outline-none focus:border-black transition-colors"
                                    required
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 pl-10 pr-12 text-base lg:text-sm text-black focus:outline-none focus:border-black transition-colors"
                                    required
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <input type="checkbox" id="terms" className="rounded border-zinc-300 text-black focus:ring-black" required />
                            <label htmlFor="terms" className="text-xs text-zinc-600">I agree to the Terms & Conditions</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white rounded-lg py-3 font-bold text-sm tracking-wide hover:bg-zinc-800 transition-colors mt-2 disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-sm text-zinc-500 font-medium mt-4 text-center">
                        Already have an account? {' '}
                        <button onClick={() => onNavigate('login')} className="text-black font-bold hover:underline">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>

            <AuthBanner />
        </div>
    );
};

export default Signup;
