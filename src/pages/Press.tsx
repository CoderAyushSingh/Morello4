import React from 'react';
import { Newspaper, ArrowUpRight, ExternalLink } from 'lucide-react';

const Press: React.FC = () => {
    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-white selection:text-black">
            {/* 📰 Hero Section (Cinematic Editorial) */}
            <section className="relative h-[40vh] md:h-[50vh] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80"
                        alt="Newsroom Background"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-fadeInUp">
                    <div className="flex items-center justify-center gap-3 text-emerald-400 mb-4">
                        <span className="w-12 h-[1px] bg-emerald-400"></span>
                        <span className="text-xs font-bold tracking-[0.4em] uppercase">Newsroom</span>
                        <span className="w-12 h-[1px] bg-emerald-400"></span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 drop-shadow-2xl">
                        In The<br />Media
                    </h1>
                    <p className="text-zinc-400 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed mt-4">
                        Tracking our journey to revolutionize entertainment discovery, one headline at a time.
                    </p>
                </div>
            </section>

            {/* 🗞️ Press Grid (Masonry / Editorial Layout) */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    {/* Column 1 */}
                    <div className="space-y-16 mt-0 md:mt-24">
                        <PressCard
                            source="TechCrunch"
                            date="Dec 12, 2025"
                            title="Morello raises bar for UX in entertainment aggregators"
                            snippet="The interface feels less like a tool and more like an extension of your own taste..."
                            image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80"
                            delay="0"
                        />
                        <PressCard
                            source="The Verge"
                            date="Oct 15, 2025"
                            title="Why minimalism wins in streaming guides"
                            snippet="Stripping away the noise, Morello focuses purely on the visual art of cinema."
                            image="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80"
                            delay="200"
                        />
                    </div>

                    {/* Column 2 (Offset) */}
                    <div className="space-y-16">
                        <PressCard
                            source="Variety"
                            date="Nov 28, 2025"
                            title="The future of finding what to watch next"
                            snippet="In a crowded market of discovery apps, Morello's cinematic approach stands out as a clear winner."
                            image="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80"
                            delay="100"
                        />
                        <PressCard
                            source="Wired"
                            date="Sep 02, 2025"
                            title="Interview: The design philosophy behind Morello"
                            snippet="We sat down with the lead visionaries to understand how they crafted this digital experience."
                            image="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"
                            delay="300"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

interface PressCardProps {
    source: string;
    date: string;
    title: string;
    snippet: string;
    image: string;
    delay: string;
}

const PressCard: React.FC<PressCardProps> = ({ source, date, title, snippet, image, delay }) => (
    <div
        className="group relative flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1 animate-fadeIn"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="relative h-48 w-full overflow-hidden">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                <span className="font-semibold uppercase tracking-wider text-emerald-400">{source}</span>
                <span>{date}</span>
            </div>
            <h3 className="text-2xl font-bold text-white leading-tight mb-3 group-hover:text-emerald-300 transition-colors">
                {title}
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed flex-grow mb-4">
                {snippet}
            </p>
            <a
                href="#"
                className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-semibold group-hover:underline"
            >
                Read More
                <ArrowUpRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
        </div>
    </div>
);

export default Press;
