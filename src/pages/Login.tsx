import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { Mail, Lock, Github, Facebook, Eye, EyeOff } from 'lucide-react';
import AuthBanner from '../components/auth/AuthBanner';
import { auth, googleProvider } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

import WelcomeAnimation from '../components/common/WelcomeAnimation';

interface LoginProps {
    onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setShowWelcome(true);
        } catch (err: any) {
            console.error(err);
            setError('Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
            setShowWelcome(true);
        } catch (err: any) {
            console.error(err);
            setError('Failed to sign in with Google.');
        } finally {
            setLoading(false);
        }
    };

    if (showWelcome) {
        return <WelcomeAnimation onComplete={() => onNavigate('home')} />;
    }

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
                    <h1 className="text-3xl font-bold mb-8 text-zinc-900">Sign in</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
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

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="rounded border-zinc-300 text-black focus:ring-black" />
                            <label htmlFor="remember" className="text-sm text-zinc-600 font-medium">Remember me</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white rounded-lg py-3 font-bold text-sm tracking-wide hover:bg-zinc-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-4">
                        <p className="text-sm text-zinc-500 font-medium">
                            Don't have an account? {' '}
                            <button onClick={() => onNavigate('signup')} className="text-black font-bold hover:underline">
                                Sign up
                            </button>
                        </p>

                        <p
                            className="text-xs text-zinc-400 mt-1 cursor-pointer hover:text-black transition-colors"
                            onClick={() => onNavigate('forgot-password')}
                        >
                            Forgot Password?
                        </p>
                    </div>

                    <div className="flex gap-4 mt-12 justify-center">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform disabled:opacity-50"
                            title="Sign in with Google"
                        >
                            {/* Google Icon */}
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24.81-.6z" />
                                <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.49 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </button>
                        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform text-black">
                            <Github size={24} />
                        </button>
                        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform text-blue-600">
                            <Facebook size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <AuthBanner />
        </div>
    );
};

export default Login;
