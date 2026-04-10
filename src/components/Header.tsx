import React, { useEffect, useState } from 'react';
import { Shield, LogOut, LayoutDashboard } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session using token logic
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { user } = await apiFetch('/auth.php?action=me');
          setSession({ user });
        } catch {
          localStorage.removeItem('token');
          setSession(null);
        }
      } else {
        setSession(null);
      }
    };
    checkAuth();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setSession(null);
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-[90%] max-w-4xl rounded-[2rem] border border-white/5 
        ${scrolled 
          ? 'bg-carbon/60 backdrop-blur-md py-3 px-6 shadow-2xl shadow-black/50' 
          : 'bg-transparent py-4 px-6'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-cream" />
          <Link to="/" className="font-sans font-bold text-lg tracking-tight text-cream">PortalGuanaco</Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 font-mono text-sm uppercase tracking-widest text-cream/70">
          <a href="#features" className="hover:text-cream transition-colors">Características</a>
          <a href="#protocol" className="hover:text-cream transition-colors">Protocolo</a>
          <a href="#philosophy" className="hover:text-cream transition-colors">Visión</a>
          {session && (
            <button 
              onClick={() => navigate('/dashboard')}
              className="hover:text-cream transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Panel
            </button>
          )}
        </nav>

        {session ? (
          <button 
            onClick={handleLogout}
            className="magnetic-button bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-2xl font-sans font-medium text-sm flex items-center gap-2 border border-red-500/20 hover:border-red-500 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        ) : (
          <button 
            onClick={() => navigate('/auth')}
            className="magnetic-button bg-cream text-carbon px-5 py-2 rounded-2xl font-sans font-medium text-sm flex items-center justify-center"
          >
            Acceso Premium / Login
          </button>
        )}
      </div>
    </header>
  );
};
