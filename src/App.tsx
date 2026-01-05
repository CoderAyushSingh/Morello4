
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import SnowEffect from './components/common/SnowEffect';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Listing from './pages/Listing';
import ActorDetail from './pages/ActorDetail';
import Upcoming from './pages/Upcoming';
import Drama from './pages/Drama';
import Search from './pages/Search';
import About from './pages/About';
import Press from './pages/Press';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfileSettings from './pages/ProfileSettings';
import Profile from './pages/Profile';
import { TransitionProvider } from './context/TransitionContext';
import PageTransition from './components/common/PageTransition';

// Wrapper components to bridge Router params to Component props
const DetailWrapper = ({ onMediaClick, onActorClick, onGenreClick }: any) => {
  const { type, id } = useParams();
  return (
    <Detail
      id={parseInt(id!)}
      type={type as 'movie' | 'tv'}
      onMediaClick={onMediaClick}
      onActorClick={onActorClick}
      onGenreClick={onGenreClick}
    />
  );
};

const ActorDetailWrapper = ({ onMediaClick }: any) => {
  const { id } = useParams();
  return <ActorDetail id={parseInt(id!)} onMediaClick={onMediaClick} />;
};

const ListingWrapper = ({ type, title, onMediaClick }: any) => {
  const [searchParams] = useSearchParams();
  const genreId = searchParams.get('genre');
  // Use key to force remount if type or genre changes, ensuring fresh state
  return (
    <Listing
      key={`${type}-${genreId}`}
      type={type}
      title={title}
      onMediaClick={onMediaClick}
      initialGenreId={genreId ? parseInt(genreId) : undefined}
    />
  );
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Inspect mode enabled (restrictions removed)

  const navigateTo = (path: string) => {
    window.scrollTo(0, 0);
    switch (path) {
      case 'home': navigate('/'); break;
      case 'movies': navigate('/movies'); break;
      case 'tv': navigate('/tv'); break;
      case 'upcoming': navigate('/upcoming'); break;
      case 'drama': navigate('/drama'); break;
      case 'search': navigate('/search'); break;
      case 'top_rated': navigate('/top-rated'); break;
      case 'genres': navigate('/genres'); break;
      case 'reviews': navigate('/reviews'); break;
      case 'about': navigate('/about'); break;
      case 'press': navigate('/press'); break;
      case 'privacy': navigate('/privacy'); break;
      case 'contact': navigate('/contact'); break;
      case 'login': navigate('/login'); break;
      case 'signup': navigate('/signup'); break;
      case 'forgot-password': navigate('/forgot-password'); break;
      case 'reset-password': navigate('/reset-password'); break;
      case 'profile': navigate('/profile'); break;
      case 'settings': navigate('/settings'); break;
      default: navigate('/');
    }
  };

  const handleMediaClick = (id: number, mediaType: 'movie' | 'tv') => {
    navigate(`/detail/${mediaType}/${id}`);
  };

  const handleActorClick = (id: number) => {
    navigate(`/actor/${id}`);
  };

  const handleGenreClick = (genreId: number, mediaType: 'movie' | 'tv') => {
    navigate(`/${mediaType === 'movie' ? 'movies' : 'tv'}?genre=${genreId}`);
    window.scrollTo(0, 0);
  };

  const { user, loading } = useAuth(); // Now we can use this!

  // Helper to determine active page for Navbar highlighting
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/movies')) return 'movies';
    if (path.startsWith('/tv')) return 'tv';
    if (path.startsWith('/upcoming')) return 'upcoming';
    if (path.startsWith('/drama')) return 'drama';
    if (path.startsWith('/search')) return 'search';
    if (path.startsWith('/top-rated')) return 'top_rated';
    if (path.startsWith('/genres')) return 'genres';
    if (path.startsWith('/reviews')) return 'reviews';
    return '';
  };

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname);

  // Hide global layout (Navbar/Footer) on Auth pages OR on Landing page (root path with no user)
  const isLandingPage = !user && location.pathname === '/';
  const showLayout = !isAuthPage && !isLandingPage;

  if (loading) return null; // Or a loading spinner

  return (
    <TransitionProvider>
      <PageTransition />
      <SnowEffect />
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30">
        {showLayout && <Navbar onNavigate={navigateTo} currentPage={getCurrentPage()} />}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              user ? (
                <Home onMediaClick={handleMediaClick} onNavigate={navigateTo} />
              ) : (
                <Landing />
              )
            } />
            <Route path="/movies" element={<ListingWrapper type="movie" title="Cinema" onMediaClick={handleMediaClick} />} />
            <Route path="/tv" element={<ListingWrapper type="tv" title="Web Series" onMediaClick={handleMediaClick} />} />
            <Route path="/top-rated" element={<ListingWrapper type="movie" title="Top Rated" onMediaClick={handleMediaClick} />} />
            <Route path="/genres" element={<ListingWrapper type="movie" title="By Genre" onMediaClick={handleMediaClick} />} />
            <Route path="/upcoming" element={<Upcoming onMediaClick={handleMediaClick} />} />
            <Route path="/drama" element={<Drama onMediaClick={handleMediaClick} />} />
            <Route path="/search" element={<Search onMediaClick={handleMediaClick} onActorClick={handleActorClick} />} />

            <Route path="/detail/:type/:id" element={<DetailWrapper onMediaClick={handleMediaClick} onActorClick={handleActorClick} onGenreClick={handleGenreClick} />} />
            <Route path="/actor/:id" element={<ActorDetailWrapper onMediaClick={handleMediaClick} />} />

            <Route path="/about" element={<About onNavigate={navigateTo} />} />
            <Route path="/press" element={<Press />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login onNavigate={navigateTo} />} />
            <Route path="/signup" element={<Signup onNavigate={navigateTo} />} />
            <Route path="/forgot-password" element={<ForgotPassword onNavigate={navigateTo} />} />
            <Route path="/reset-password" element={<ResetPassword onNavigate={navigateTo} />} />

            <Route path="/profile" element={<Profile onNavigate={navigateTo} />} />
            <Route path="/settings" element={<ProfileSettings onNavigate={navigateTo} />} />

            <Route path="/reviews" element={
              <div className="max-w-[1400px] mx-auto px-6 py-40 text-center">
                <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4">Reviews coming soon</h1>
                <p className="text-zinc-500 text-xs uppercase tracking-widest">Our critics are currently binge-watching</p>
              </div>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {showLayout && <Footer onNavigate={navigateTo} />}
      </div>
    </TransitionProvider>
  );
};

export default App;
