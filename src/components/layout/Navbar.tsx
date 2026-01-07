import React from 'react';
import { LogIn, Search, Menu, X, User, FilePen, List, Bookmark, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import logo from '../../assets/logo.png';

import SearchModal from '../common/SearchModal';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { user, userProfile, logout } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  // Derive display values from Supabase profile first, then Firebase user
  const displayPhoto = userProfile?.photoURL || user?.photoURL;
  const displayName = userProfile?.firstName || user?.displayName || user?.email?.split('@')[0] || 'User';

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navItems = [
    { label: t('nav.home'), value: 'home' },
    { label: t('nav.movies'), value: 'movies' },
    { label: t('nav.series'), value: 'tv' },
    { label: t('nav.genres'), value: 'genres' },
    { label: t('nav.reviews'), value: 'reviews' },
    { label: t('nav.topRated'), value: 'top_rated' },
    { label: t('nav.drama'), value: 'drama' },
    { label: t('nav.upcoming'), value: 'upcoming' },
  ];

  const handleMobileNavigate = (value: string) => {
    onNavigate(value);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-[100] bg-black/90 backdrop-blur-xl border-b border-zinc-900/50 h-20">
      <div className="relative max-w-[1400px] mx-auto h-full px-6 md:px-12 lg:px-24 flex items-center justify-between">

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white mr-4"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div
          className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 text-2xl font-bold flex items-center cursor-pointer tracking-tighter group transition-all"
          onClick={() => onNavigate('home')}
        >
          <img src={logo} alt="Morello Logo" className="w-16 h-16 lg:w-12 lg:h-12 object-contain mr-3 group-hover:scale-110 transition-transform duration-300" />
          <span className="hidden lg:block group-hover:tracking-normal transition-all duration-500">MORELLO</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8 xl:space-x-10 text-[10px] font-bold uppercase tracking-[0.25em]">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onNavigate(item.value)}
              className={`relative py-2 transition-all duration-300 hover:text-white ${currentPage === item.value ? 'text-white' : 'text-zinc-500'
                }`}
            >
              {item.label}
              {currentPage === item.value && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-100 transition-transform duration-300" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 md:space-x-8">

          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
            title="Search (Cmd+K)"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {user ? (
            <div className="relative z-50" ref={profileMenuRef}>
              <div
                className="w-9 h-9 rounded-full bg-black border border-zinc-700 flex items-center justify-center text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-black/50 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-110 hover:border-zinc-500"
                title={displayName}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                {displayPhoto ? (
                  <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>

              {/* Profile Popup Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-4 w-64 bg-black border border-zinc-800 rounded-xl shadow-2xl p-2 animate-fadeInUp origin-top-right">
                  <div className="flex flex-col space-y-1">
                    <MenuItem icon={User} label={t('nav.myProfile')} onClick={() => { onNavigate('profile'); setIsProfileMenuOpen(false); }} />
                    <MenuItem icon={FilePen} label={t('nav.myReviews')} onClick={() => { onNavigate('reviews'); setIsProfileMenuOpen(false); }} />
                    <MenuItem icon={List} label={t('nav.myCollections')} onClick={() => { onNavigate('collections'); setIsProfileMenuOpen(false); }} />
                    <MenuItem icon={Bookmark} label={t('nav.savedCollections')} onClick={() => { onNavigate('saved'); setIsProfileMenuOpen(false); }} />
                    <MenuItem icon={Settings} label={t('nav.settings')} onClick={() => { onNavigate('settings'); setIsProfileMenuOpen(false); }} />

                    <div className="h-[1px] bg-zinc-800 my-2 mx-2"></div>

                    <button
                      onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors group"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('nav.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="group flex items-center text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:border-zinc-500"
            >
              <LogIn className="w-4 h-4 mr-2 text-zinc-400 group-hover:text-white transition-colors" /> <span className="hidden md:inline">{t('nav.login')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-black/95 backdrop-blur-3xl transition-all duration-500 lg:hidden flex flex-col items-center justify-center ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className="absolute top-8 right-8">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex flex-col items-center space-x-0 space-y-8">
          {navItems.map((item, idx) => (
            <button
              key={item.value}
              onClick={() => handleMobileNavigate(item.value)}
              className={`text-3xl md:text-5xl font-black uppercase tracking-tighter transition-all duration-300 transform hover:scale-110 ${currentPage === item.value ? 'text-white' : 'text-zinc-600 hover:text-zinc-300'}`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {item.label}
            </button>
          ))}

          <div className="w-12 h-[1px] bg-zinc-800 my-8"></div>

          {user && (
            <button
              onClick={logout}
              className="text-xl font-bold uppercase tracking-widest text-red-600 hover:text-red-500 transition-colors flex items-center gap-3"
            >
              Logout <LogIn className="w-5 h-5 rotate-180" />
            </button>
          )}
        </div>

        <div className="absolute bottom-12 text-zinc-800 text-[10px] uppercase tracking-[0.5em] font-black">
          Morello © 2026
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;

const MenuItem = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-all group"
  >
    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);
