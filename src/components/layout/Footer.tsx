import React from 'react';
import logo from '../../assets/logo.png';
import { Instagram, Twitter, Facebook, Youtube, Mail, ArrowRight, Github, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <footer className="bg-zinc-950 text-white pt-24 pb-12 border-t border-zinc-900 mt-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">

          {/* Brand Column */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Morello" className="w-10 h-10 object-contain" />
                <h2 className="text-2xl font-black tracking-tighter uppercase">Morello</h2>
              </div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">{t('footer.tagline')}</p>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed font-light max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <SocialIcon Icon={Instagram} href="https://www.instagram.com/vz.ayush/" label="Instagram" />
              <SocialIcon Icon={Twitter} href="https://x.com/RealMorello" label="Twitter" />
              <SocialIcon Icon={Youtube} href="https://www.youtube.com/@MorelloOfficial" label="Youtube" />
              <SocialIcon Icon={Facebook} href="https://www.facebook.com/profile.php?id=100091740409246" label="Facebook" />
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">{t('footer.discover')}</h3>
            <ul className="space-y-4">
              <FooterLink onClick={() => onNavigate('movies')} label={t('footer.newReleases')} />
              <FooterLink onClick={() => onNavigate('top_rated')} label={t('footer.topCharts')} />
              <FooterLink onClick={() => onNavigate('movies')} label={t('footer.editorsPicks')} />
              <FooterLink onClick={() => onNavigate('search')} label={t('footer.hiddenGems')} />
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">{t('footer.company')}</h3>
            <ul className="space-y-4">
              <FooterLink onClick={() => onNavigate('about')} label={t('footer.about')} />
              <FooterLink onClick={() => onNavigate('press')} label={t('footer.press')} />
              <FooterLink onClick={() => onNavigate('privacy')} label={t('footer.privacy')} />
              <FooterLink onClick={() => onNavigate('contact')} label={t('footer.contact')} />
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">{t('footer.newsletter')}</h3>
            <p className="text-zinc-400 text-xs font-light">{t('footer.newsletterDesc')}</p>
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="w-full bg-transparent border-b border-zinc-800 py-3 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-white transition-all placeholder:text-zinc-700"
                />
                <button className="absolute right-0 bottom-3 text-zinc-500 group-hover:text-white transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
            {t('footer.rights')}
          </p>

          <div className="flex items-center gap-8">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest group"
            >
              <Globe className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>{language === 'en' ? 'English' : 'Hindi'}</span>
            </button>

            <div className="flex items-center gap-2 text-zinc-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] uppercase tracking-widest font-black">{t('footer.love')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ Icon, href, label }: { Icon: any, href: string, label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-sm border border-zinc-800 text-zinc-500 hover:text-white hover:border-white hover:bg-zinc-900 transition-all duration-300 group"
    aria-label={label}
  >
    <Icon size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
  </a>
);

const FooterLink = ({ onClick, label }: { onClick: () => void, label: string }) => (
  <li>
    <button onClick={onClick} className="text-sm text-zinc-400 hover:text-white transition-colors tracking-wide font-light flex items-center gap-2 group text-left w-full">
      <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 opacity-0 group-hover:opacity-100 text-xs">→</span>
      {label}
    </button>
  </li>
);

export default Footer;
