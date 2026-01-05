import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import AuthBanner from '../components/auth/AuthBanner';
import { auth } from '../config/firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';

interface ResetPasswordProps {
    onNavigate: (page: string) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigate }) => {
    // Standard Javascript URL parsing since we don't have react-router-dom
    const queryParams = new URLSearchParams(window.location.search);
    const oobCode = queryParams.get('oobCode');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);

    // Verify the code on mount
    useEffect(() => {
        if (!oobCode) {
            setError('Invalid or missing reset code.');
            setVerifying(false);
            return;
        }

        verifyPasswordResetCode(auth, oobCode)
            .then(() => {
                setVerifying(false); // Code is valid
            })
            .catch((err) => {
                console.error(err);
                setError('Invalid or expired reset link.');
                setVerifying(false);
            });
    }, [oobCode]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            setError("Password must contain at least one symbol.");
            return;
        }

        if (!oobCode) {
            setError('Invalid reset code.');
            return;
        }

        setLoading(true);

        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen w-full flex bg-[#F3F4F6] items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Password Reset Successful!</h2>
                    <p className="text-zinc-500 mb-8">Your password has been securely updated. You can now login with your new password.</p>
                    <button
                        onClick={() => onNavigate('login')}
                        className="w-full bg-black text-white rounded-lg py-3 font-bold text-sm tracking-wide hover:bg-zinc-800 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
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
                    <h1 className="text-3xl font-bold mb-4 text-zinc-900">Set New Password</h1>
                    <p className="text-zinc-500 mb-8">Please enter a strong password for your account.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-700 text-sm rounded-lg font-medium flex items-center gap-2">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {verifying ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 pl-10 pr-10 text-base lg:text-sm text-black focus:outline-none focus:border-black transition-colors"
                                        required
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-zinc-400 font-medium">Must be at least 6 characters with 1 special symbol.</p>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 pl-10 pr-10 text-base lg:text-sm text-black focus:outline-none focus:border-black transition-colors"
                                        required
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white rounded-lg py-3 font-bold text-sm tracking-wide hover:bg-zinc-800 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <AuthBanner />
        </div>
    );
};

export default ResetPassword;
