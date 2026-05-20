import React, { useEffect, useRef, useState } from 'react';
import {
  Shield, LogOut, LayoutDashboard, User, FileText,
  ChevronDown, BookOpen, Zap, Lightbulb, Crown, Mail
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const platformLinks = [
  { label: 'Protocolo',       href: '/protocolo',       icon: BookOpen,   desc: 'Cómo funciona la red' },
  { label: 'Características', href: '/caracteristicas', icon: Zap,        desc: 'Todo lo que puedes hacer' },
  { label: 'Filosofía',       href: '/filosofia',       icon: Lightbulb,  desc: 'Nuestra visión y valores' },
  { label: 'Premium',         href: '/premium',         icon: Crown,      desc: 'Planes y precios' },
  { label: 'Contacto',        href: '/contacto',        icon: Mail,       desc: 'Información y soporte' },
];

export const Header: React.FC = () => {
  const [scrolled, setScrolled]           = useState(false);
  const [session, setSession]             = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const [platformOpen, setPlatformOpen]   = useState(false);
  const userMenuRef                       = useRef<HTMLDivElement>(null);
  const platformRef                       = useRef<HTMLDivElement>(null);
  const navigate                          = useNavigate();

  // ── Auth check ───────────────────────────────────────────
  useEffect(() => {
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
    window.addEventListener('auth-changed', checkAuth);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('auth-changed', checkAuth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ── Close dropdowns on outside click ─────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (platformRef.current && !platformRef.current.contains(e.target as Node)) setPlatformOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setSession(null);
    setUserMenuOpen(false);
    navigate('/');
  };

  const navTo = (to: string) => {
    setUserMenuOpen(false);
    setPlatformOpen(false);
    navigate(to);
  };

  const initials = session?.user?.email
    ? session.user.email.slice(0, 2).toUpperCase()
    : 'PG';

  const handleBrandClick = () => {
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header
      className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-[94%] sm:w-[90%] max-w-4xl rounded-[2rem] border border-white/5 
        ${scrolled
          ? 'bg-carbon/60 backdrop-blur-md py-2.5 sm:py-3 px-4 sm:px-6 shadow-2xl shadow-black/50'
          : 'bg-transparent py-3 sm:py-4 px-4 sm:px-6'}`}
    >
      <div className="flex items-center justify-between">
        {/* ── Brand ── */}
        <button
          onClick={handleBrandClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
        >
          <Shield className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#32CD32' }} />
          <span className="font-sans font-bold text-base sm:text-lg tracking-tight text-cream">PortalGuanaco</span>
        </button>

        {/* ── Nav ── */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-sm uppercase tracking-wide text-cream/70">
          
          {/* Plataforma dropdown */}
          <div className="relative" ref={platformRef}>
            <button
              onClick={() => setPlatformOpen(v => !v)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all
                ${platformOpen ? 'text-cream bg-white/5' : 'hover:text-cream hover:bg-white/5'}`}
            >
              Plataforma
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${platformOpen ? 'rotate-180' : ''}`} />
            </button>

            {platformOpen && (
              <div className="absolute left-0 mt-3 w-64 bg-carbon border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-white/5">
                  <span className="font-mono text-xs uppercase tracking-wide text-cream/50">Plataforma</span>
                </div>
                {platformLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.href}
                      onClick={() => navTo(link.href)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-clay/10 border border-clay/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-clay/20 transition-colors">
                        <Icon className="w-4 h-4 text-clay" />
                      </div>
                      <div>
                        <div className="font-sans text-sm text-cream font-medium">{link.label}</div>
                        <div className="font-mono text-xs text-cream/50 uppercase tracking-wide">{link.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* ── CTA / User menu ── */}
        {session ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(prev => !prev)}
              className="magnetic-button flex items-center gap-2 px-1 py-1 pr-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-clay/20 border border-clay/30 flex items-center justify-center text-clay font-mono text-xs font-bold shrink-0">
                {initials}
              </div>
              <span className="hidden sm:block font-mono text-xs text-cream/70 max-w-[120px] truncate">
                {session.user?.email}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-cream/40 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-carbon border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-clay/20 border border-clay/30 flex items-center justify-center text-clay font-mono text-sm font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-xs text-cream/50 uppercase tracking-wide mb-0.5">Operador</div>
                      <div className="text-cream text-xs font-sans truncate">{session.user?.email}</div>
                      <div className="font-mono text-xs text-clay/70 mt-0.5 truncate">ID: {session.user?.id?.split('-')[0]}</div>
                    </div>
                  </div>
                </div>

                <div className="py-2 flex flex-col">
                  <button
                    onClick={() => navTo('/dashboard')}
                    className="flex items-center gap-3 px-5 py-3 text-cream/70 hover:text-cream hover:bg-white/5 transition-all text-left group"
                  >
                    <LayoutDashboard className="w-4 h-4 text-cream/30 group-hover:text-clay transition-colors shrink-0" />
                    <span className="font-sans text-sm">Panel de Control</span>
                  </button>

                  <button
                    onClick={() => navTo('/submit')}
                    className="flex items-center gap-3 px-5 py-3 text-cream/70 hover:text-cream hover:bg-white/5 transition-all text-left group"
                  >
                    <FileText className="w-4 h-4 text-cream/30 group-hover:text-clay transition-colors shrink-0" />
                    <span className="font-sans text-sm">Ingresar Telemetría</span>
                  </button>

                  <button
                    onClick={() => navTo('/dashboard')}
                    className="flex items-center gap-3 px-5 py-3 text-cream/70 hover:text-cream hover:bg-white/5 transition-all text-left group"
                  >
                    <User className="w-4 h-4 text-cream/30 group-hover:text-clay transition-colors shrink-0" />
                    <span className="font-sans text-sm">Mis Registros</span>
                  </button>
                </div>

                <div className="border-t border-white/5 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all text-left group"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span className="font-sans text-sm">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Quick Report pill */}
            <button
              onClick={() => navigate('/quick-report')}
              className="magnetic-button border border-clay text-clay hover:bg-clay/10 px-3 sm:px-5 py-2 rounded-2xl font-sans font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              Reportar
            </button>
            {/* Premium pill — visible on desktop */}
            <button
              onClick={() => navigate('/premium')}
              className="hidden md:flex items-center gap-1.5 magnetic-button border border-clay/30 text-clay px-4 py-2 rounded-2xl font-mono text-xs uppercase tracking-widest hover:bg-clay/10 transition-all"
            >
              <Crown className="w-3 h-3" />
              Premium
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="magnetic-button bg-cream text-carbon px-3 sm:px-5 py-2 rounded-2xl font-sans font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <span className="sm:hidden">Acceso</span>
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
