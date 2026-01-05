import React from 'react';
import { Shield, Lock, Eye, FileText, Globe, Bell, CheckCircle } from 'lucide-react';

interface PolicySectionProps {
    image: string;
    icon: React.ReactNode;
    title: string;
    content: React.ReactNode;
    reverse: boolean;
    color: string;
}

const PolicySection: React.FC<PolicySectionProps> = ({ image, icon, title, content, reverse, color }) => {
    return (
        <div className={`relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 p-8 md:p-16 flex flex-col items-center gap-12 group ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
            <div className="absolute inset-0">
                <img src={image} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700" alt={title} />
                <div className={`absolute inset-0 bg-gradient-to-r ${reverse ? 'from-black via-black/80 to-transparent' : 'from-transparent via-black/80 to-black'}`}></div>
            </div>

            <div className="relative z-10 flex-1 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                    <div className={`p-3 rounded-full bg-${color}-500/20 text-${color}-400`}>
                        {icon}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
                </div>
                <div className="text-zinc-400 text-lg leading-relaxed font-light">
                    {content}
                </div>
            </div>

            {/* Spacer for visual balance if needed, or just let flex handle it */}
            <div className="hidden md:block flex-1"></div>
        </div>
    );
};

const Privacy: React.FC = () => {
    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
            {/* 🔒 Hero Section */}
            <section className="relative h-[40vh] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80"
                        alt="Security Vault"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black/40 to-black"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-fadeInUp">
                    <div className="flex items-center justify-center gap-3 text-emerald-500 mb-4">
                        <Shield size={20} />
                        <span className="text-xs font-bold tracking-[0.3em] uppercase">Data Protection</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
                        Privacy<br />Policy
                    </h1>
                    <p className="text-zinc-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mt-4">
                        We are committed to protecting your personal data and ensuring a secure experience. Last updated: January 04, 2026.
                    </p>
                </div>
            </section>

            {/* 📜 Policy Sections */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 space-y-32">

                {/* Section 1: Data Collection */}
                <PolicySection
                    image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                    icon={<FileText className="text-blue-400" size={32} />}
                    title="Data Collection"
                    color="blue"
                    content={
                        <>
                            <p>We collect minimal data necessary to optimize your experience. This includes usage metrics, device information, and preference settings.</p>
                            <ul className="space-y-2 mt-4 text-zinc-400 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> Account configuration details</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> Watchlist and history preferences</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-blue-500" /> Technical log data for debugging</li>
                            </ul>
                        </>
                    }
                    reverse={false}
                />

                {/* Section 2: Security */}
                <PolicySection
                    image="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80"
                    icon={<Lock className="text-emerald-400" size={32} />}
                    title="Security Measures"
                    color="emerald"
                    content="Your security is our top priority. We employ end-to-end encryption, regular audits, and industry-standard security protocols to protect your information against unauthorized access, alteration, or destruction. We do not sell your personal data."
                    reverse={true}
                />

                {/* Section 3: Analytics */}
                <PolicySection
                    image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                    icon={<Eye className="text-violet-400" size={32} />}
                    title="Detailed Analytics"
                    color="violet"
                    content="We utilize anonymous analytics to understand user behavior and improve functionality. These analytics are aggregated and cannot be used to identify individual users personally. You maintain full control over optional data sharing."
                    reverse={false}
                />

                {/* Section 4: User Rights */}
                <PolicySection
                    image="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80"
                    icon={<Shield className="text-amber-400" size={32} />}
                    title="Your Rights"
                    color="amber"
                    content="You have the right to access, correct, or delete your personal data at any time. We support the 'Right to be Forgotten' and offer easy tools within your account settings to manage your privacy preferences and export your data."
                    reverse={true}
                />

                {/* Section 5: Cookies */}
                <PolicySection
                    image="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80"
                    icon={<Globe className="text-cyan-400" size={32} />}
                    title="Cookies & Tracking"
                    color="cyan"
                    content="We use essential cookies to maintain your session and security. Optional cookies help us remember your preferences and analyze site traffic to provide a better user experience. You can manage cookie settings in your browser."
                    reverse={false}
                />

                {/* Section 6: Contact */}
                <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 group">
                    <div className="absolute inset-0">
                        <img src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700" alt="Contact" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex-1 space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-zinc-800/50 rounded-lg backdrop-blur-sm border border-zinc-700">
                                <Bell className="text-rose-400" size={24} />
                            </div>
                            <h2 className="text-3xl font-bold uppercase tracking-tight text-white">Contact & Updates</h2>
                        </div>
                        <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                            We may update this policy periodically. If you have questions about your data or these terms, please contact our Data Protection Officer.
                        </p>
                        <button className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors rounded-sm">
                            Contact Support
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Privacy;
