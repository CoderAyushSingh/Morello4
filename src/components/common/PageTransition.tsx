import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransition } from '../../context/TransitionContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const PageTransition: React.FC = () => {
    const { isAnimating, nextPath, endTransition } = useTransition();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAnimating && nextPath) {
            // Navigate faster (sync with faster fade)
            const timer = setTimeout(() => {
                navigate(nextPath);
                // Trigger reveal after navigation
                setTimeout(() => {
                    endTransition();
                }, 50);
            }, 300); // 300ms delay

            return () => clearTimeout(timer);
        }
    }, [isAnimating, nextPath, navigate, endTransition]);

    return (
        <AnimatePresence onExitComplete={endTransition}>
            {isAnimating && (
                <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">

                    {/* Simple Fade Background */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 bg-black z-20"
                    />

                    {/* Center Logo - Elegant Pulse */}
                    <motion.div
                        className="relative z-30 flex flex-col items-center justify-center gap-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0.95, 1, 1, 1.05]
                        }}
                        transition={{
                            duration: 0.8,
                            times: [0, 0.1, 0.9, 1],
                            ease: "easeInOut"
                        }}
                    >
                        {/* Glow Effect */}
                        <motion.div
                            className="absolute w-64 h-64 bg-yellow-500/20 rounded-full blur-[100px]"
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                        />

                        <div className="relative flex flex-col items-center gap-4">
                            <img src={logo} alt="Morello" className="w-32 h-32 object-contain drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]" />
                            <motion.p
                                className="text-yellow-500 font-bold tracking-[0.5em] text-sm uppercase"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                Morello Cinema
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Noise/Grain Overlay for Cinematic feel */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
                    />
                </div>
            )}
        </AnimatePresence>
    );
};

export default PageTransition;
