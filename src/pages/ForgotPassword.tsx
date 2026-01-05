
import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthBanner from '../components/auth/AuthBanner';
import { auth } from '../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

interface ForgotPasswordProps {
    onNavigate: (page: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const actionCodeSettings = {
                url: window.location.origin + '/reset-password',
                handleCodeInApp: true,
            };
            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email.');
            } else {
                setError('Failed to send reset email. Please try again.');
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
                    <button
                        onClick={() => onNavigate('login')}
                        className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-black mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </button>

                    <h1 className="text-3xl font-bold mb-4 text-zinc-900">Forgot Password?</h1>
                    <p className="text-zinc-500 mb-8">Enter your email address and we'll send you a link to reset your password.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-700 text-sm rounded-lg font-medium">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-100 text-green-700 text-sm rounded-lg font-medium flex items-center gap-2">
                            <CheckCircle size={18} />
                            Password reset link sent! Check your inbox.
                        </div>
                    )}

                    <form onSubmit={handleResetPassword} className="space-y-6">
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

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full bg-black text-white rounded-lg py-3 font-bold text-sm tracking-wide hover:bg-zinc-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            </div>

            <AuthBanner />
        </div>
    );
};

export default ForgotPassword;
