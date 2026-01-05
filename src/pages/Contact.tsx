import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact: React.FC = () => {
    const [status, setStatus] = useState<null | 'sending' | 'success' | 'error'>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("https://formsubmit.co/ajax/kharido007@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Form submission error", error);
            setStatus('error');
        }
    };

    const MotionDiv = motion.div as any;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-6 lg:px-12">
                <div className="mb-20">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold border border-zinc-800 rounded-full px-4 py-1.5">Support</span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mt-6 mb-4 text-white">Contact Us</h1>
                    <p className="text-zinc-400 text-sm md:text-base max-w-lg leading-relaxed">Have questions? We're here to help. Reach out to our team for support, partnerships, or general inquiries.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Contact Form */}
                    <div>
                        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/20 backdrop-blur-sm border border-zinc-800 p-1">
                            {status === 'success' ? (
                                <MotionDiv
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-[600px] flex flex-col items-center justify-center text-center p-8 space-y-6 bg-zinc-900/50 rounded-xl"
                                >
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)]">
                                        <MotionDiv
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                                        >
                                            <Send size={40} className="text-green-500" />
                                        </MotionDiv>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Message Sent</h3>
                                        <p className="text-zinc-400 max-w-xs mx-auto">Thank you for reaching out. We will respond to <span className="text-white font-medium">kharido007@gmail.com</span> shortly.</p>
                                    </div>
                                    <button
                                        onClick={() => setStatus(null)}
                                        className="mt-8 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors"
                                    >
                                        Send Another
                                    </button>
                                </MotionDiv>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8 p-6 md:p-8">
                                    {/* FormSubmit Configuration: Custom UI Style */}
                                    <input type="hidden" name="_subject" value="New Inquiry via Morello" />
                                    <input type="hidden" name="_template" value="box" />
                                    <input type="hidden" name="_captcha" value="false" />
                                    <input type="hidden" name="_autoresponse" value="Thank you for contacting Morello Cinema. We have received your message." />

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">First Name</label>
                                            <input type="text" name="firstName" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="John" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last Name</label>
                                            <input type="text" name="lastName" className="w-full bg-zinc-900/50 border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="Doe" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                                        <input type="email" name="email" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors" placeholder="john@example.com" required />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Message</label>
                                        <textarea name="message" rows={6} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none" placeholder="How can we help you?" required />
                                    </div>

                                    <button type="submit" disabled={status === 'sending'} className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                                        <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
                                        <Send size={16} className={`group-hover:translate-x-1 transition-transform ${status === 'sending' ? 'hidden' : ''}`} />
                                    </button>

                                    {status === 'error' && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center font-medium">
                                            Something went wrong. Please try again later.
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white shrink-0">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Email</p>
                                        <p className="text-white">kharido007@gmail.com</p>
                                        <p className="text-zinc-500 text-sm">Response time: 24-48 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white shrink-0">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Phone</p>
                                        <p className="text-white">+91 9628408253</p>
                                        <p className="text-zinc-500 text-sm">Mon-Fri, 9am - 6pm EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white shrink-0">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Headquarters</p>
                                        <p className="text-white">284/12 Shastri Nagar</p>
                                        <p className="text-zinc-500 text-sm">Kampur Nagar, Uttar Pradesh 208005</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border border-zinc-800 rounded-2xl bg-gradient-to-br from-zinc-900/50 to-black">
                            <h4 className="font-bold text-white mb-2">Need immediate assistance?</h4>
                            <p className="text-zinc-400 text-sm mb-6">Check our Help Center for frequently asked questions regarding billing, account access, and streaming quality.</p>
                            <button className="text-xs uppercase tracking-widest font-bold text-white border-b border-white pb-1 hover:text-zinc-300 hover:border-zinc-300 transition-colors">Visit Help Center</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
