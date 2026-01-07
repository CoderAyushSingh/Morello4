import React from 'react';
import { Shield, Lock, Eye, FileText, Globe, Cookie, Share2, Server, UserCheck, AlertTriangle, Calendar, Mail, Scale } from 'lucide-react';

const Privacy: React.FC = () => {
    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                            <Shield className="w-10 h-10 text-emerald-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Privacy Policy for Morello</h1>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">Last Updated: January 07, 2026</p>
                </div>

                {/* Introduction */}
                <div className="prose prose-invert max-w-none text-zinc-400 mb-12 leading-relaxed">
                    <p>
                        Welcome to Morello. Your privacy is extremely important to us. This Privacy Policy document explains how Morello collects, uses, protects, and discloses information when you use our website, mobile application, and related services (collectively, the “Platform”).
                    </p>
                    <p>
                        By accessing or using Morello, you agree to the terms described in this Privacy Policy.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-12">
                    <Section
                        icon={FileText}
                        title="1. Information We Collect"
                        color="blue"
                        content={
                            <div className="space-y-6">
                                <p className="text-zinc-400">We collect different types of information to provide and improve our services.</p>

                                <SubSection title="1.1 Personal Information">
                                    When you register or interact with Morello, we may collect:
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                                        <li>Full Name</li>
                                        <li>Username</li>
                                        <li>Email Address</li>
                                        <li>Profile Photo</li>
                                        <li>Date of Birth</li>
                                        <li>Account Preferences</li>
                                        <li>Login Credentials (encrypted)</li>
                                    </ul>
                                </SubSection>

                                <SubSection title="1.2 Automatically Collected Information">
                                    When you use Morello, we automatically collect:
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                                        <li>IP Address</li>
                                        <li>Device Type & Browser</li>
                                        <li>Operating System</li>
                                        <li>Pages Visited & Time Spent</li>
                                        <li>Referring URLs</li>
                                        <li>Cookies & Tracking Data</li>
                                    </ul>
                                </SubSection>

                                <SubSection title="1.3 Content & Activity Data">
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                                        <li>Movies, series, or content you view</li>
                                        <li>Watch history</li>
                                        <li>Likes, ratings, reviews, and comments</li>
                                        <li>Search queries</li>
                                    </ul>
                                </SubSection>
                            </div>
                        }
                    />

                    <Section
                        icon={Cookie}
                        title="2. Cookies & Tracking Technologies"
                        color="amber"
                        content={
                            <>
                                <p className="text-zinc-400 mb-4">Morello uses cookies and similar technologies to:</p>
                                <ul className="list-disc pl-5 space-y-1 text-zinc-400 mb-4">
                                    <li>Remember user preferences</li>
                                    <li>Improve performance and user experience</li>
                                    <li>Analyze traffic and usage behavior</li>
                                    <li>Deliver personalized recommendations</li>
                                </ul>
                                <p className="text-zinc-500 text-sm italic">You can disable cookies via your browser settings, but some features may not function properly.</p>
                            </>
                        }
                    />

                    <Section
                        icon={Eye}
                        title="3. How We Use Your Information"
                        color="emerald"
                        content={
                            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                                <li>Create and manage user accounts</li>
                                <li>Provide personalized content recommendations</li>
                                <li>Improve platform performance and UI</li>
                                <li>Communicate updates, notifications, and support</li>
                                <li>Prevent fraud, abuse, and security risks</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        }
                    />

                    <Section
                        icon={Share2}
                        title="4. Information Sharing & Disclosure"
                        color="violet"
                        content={
                            <>
                                <p className="text-zinc-400 font-bold mb-2">Morello does not sell your personal data.</p>
                                <p className="text-zinc-400 mb-2">We may share information only with:</p>
                                <ul className="list-disc pl-5 space-y-1 text-zinc-400 mb-4">
                                    <li>Service Providers (hosting, analytics, authentication)</li>
                                    <li>Legal Authorities (if required by law)</li>
                                    <li>Business Transfers (mergers, acquisitions)</li>
                                </ul>
                                <p className="text-zinc-500 text-sm">All third parties are bound by confidentiality agreements.</p>
                            </>
                        }
                    />

                    <Section
                        icon={Lock}
                        title="5. Data Security"
                        color="red"
                        content={
                            <>
                                <p className="text-zinc-400 mb-2">We implement industry-standard security measures, including:</p>
                                <ul className="list-disc pl-5 space-y-1 text-zinc-400 mb-4">
                                    <li>Encrypted data storage</li>
                                    <li>Secure authentication systems</li>
                                    <li>Access control and monitoring</li>
                                </ul>
                                <p className="text-zinc-500 text-sm italic">However, no system is 100% secure. Users are responsible for keeping their login credentials confidential.</p>
                            </>
                        }
                    />

                    <Section
                        icon={UserCheck}
                        title="6. Children’s Privacy"
                        color="pink"
                        content={
                            <p className="text-zinc-400">
                                Morello does not knowingly collect data from children under 13.
                                If you believe a child has provided personal data, please contact us immediately.
                            </p>
                        }
                    />

                    <Section
                        icon={Globe}
                        title="7. International Data Transfers"
                        color="cyan"
                        content={
                            <p className="text-zinc-400">
                                Your data may be processed and stored outside your country.
                                By using Morello, you consent to such transfers in compliance with applicable laws.
                            </p>
                        }
                    />

                    <Section
                        icon={Scale}
                        title="8. Your Privacy Rights"
                        color="indigo"
                        content={
                            <>
                                <p className="text-zinc-400 mb-2">Depending on your location, you may have the right to:</p>
                                <ul className="list-disc pl-5 space-y-1 text-zinc-400 mb-4">
                                    <li>Access your personal data</li>
                                    <li>Correct or update information</li>
                                    <li>Request deletion of your account</li>
                                    <li>Withdraw consent for data processing</li>
                                </ul>
                                <p className="text-zinc-500 text-sm">You can manage most of these options directly from your account settings.</p>
                            </>
                        }
                    />

                    <Section
                        icon={Server}
                        title="9. Data Retention"
                        color="orange"
                        content={
                            <>
                                <p className="text-zinc-400 mb-2">We retain your data only as long as necessary:</p>
                                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                                    <li>To provide services</li>
                                    <li>To comply with legal obligations</li>
                                    <li>To resolve disputes and enforce policies</li>
                                </ul>
                            </>
                        }
                    />

                    <Section
                        icon={AlertTriangle}
                        title="10. Third-Party Links"
                        color="yellow"
                        content={
                            <p className="text-zinc-400">
                                Morello may contain links to third-party websites.
                                We are not responsible for their privacy practices or content.
                            </p>
                        }
                    />

                    <Section
                        icon={Calendar}
                        title="11. Changes to This Privacy Policy"
                        color="lime"
                        content={
                            <p className="text-zinc-400">
                                We may update this Privacy Policy from time to time.
                                Any changes will be posted on this page with an updated revision date.
                                <br /><br />
                                Continued use of Morello means you accept the updated policy.
                            </p>
                        }
                    />

                    <Section
                        icon={Mail}
                        title="12. Contact Us"
                        color="rose"
                        content={
                            <>
                                <p className="text-zinc-400 mb-4">If you have any questions or concerns about this Privacy Policy, please contact us:</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-zinc-300">
                                        <Mail size={16} />
                                        <span>Email: <a href="mailto:support@morello.com" className="text-white hover:underline">support@morello.com</a></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-300">
                                        <Globe size={16} />
                                        <span>Website: <a href="https://morello.com" className="text-white hover:underline">https://morello.com</a></span>
                                    </div>
                                </div>
                            </>
                        }
                    />

                </div>
            </div>
        </div>
    );
};

// Map for dynamic colors to ensure Tailwind includes them
const colorStyles: Record<string, { bg: string, text: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-500' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-500' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
    lime: { bg: 'bg-lime-500/10', text: 'text-lime-500' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-500' },
};

const Section = ({ icon: Icon, title, content, color }: { icon: any, title: string, content: React.ReactNode, color: string }) => {
    const styles = colorStyles[color] || { bg: 'bg-zinc-500/10', text: 'text-zinc-500' };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 transition-colors hover:border-zinc-700">
            <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-lg ${styles.bg} ${styles.text}`}>
                    <Icon size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
            </div>
            <div className="text-zinc-400 leading-relaxed pl-0 md:pl-[68px]">
                {content}
            </div>
        </div>
    );
};

const SubSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-black/30 rounded-lg p-5 border border-zinc-800/50">
        <h3 className="text-zinc-200 font-bold text-sm uppercase tracking-wide mb-3">{title}</h3>
        <div className="text-sm">
            {children}
        </div>
    </div>
);

export default Privacy;
