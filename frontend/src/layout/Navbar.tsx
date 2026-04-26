import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { href: '#hero',         label: 'Home' },
  { href: '#about',        label: 'About' },
  { href: '#skills',       label: 'Skills' },
  { href: '#projects',     label: 'Projects' },
  { href: '#certificates', label: 'Activity' },
  { href: '#experience',   label: 'Experience' },
  { href: '#contact',      label: 'Contact' },
];

export const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [active, setActive]       = useState('');
  const [menuOpen, setMenuOpen]   = useState(false);
  const navigate = useNavigate();

  // Scroll glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section detection
  useEffect(() => {
    const sections = navLinks.map(l => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const isLoggedIn = !!localStorage.getItem('portfolio_token');
  const handleAdminClick = () => navigate(isLoggedIn ? '/admin/dashboard' : '/admin');

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      {/* Dynamic Island Container */}
      <div 
        className={`pointer-events-auto flex items-center justify-between px-3 py-2 transition-all duration-500 ${
          scrolled ? 'nav-3d w-full max-w-[850px]' : 'bg-transparent w-full max-w-6xl'
        }`}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={e => { e.preventDefault(); handleNavClick('#hero'); }}
          className="flex items-center gap-2 group px-2"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#20b2a6] to-[#178f85] flex items-center justify-center text-white font-bold text-xs shadow-lg group-hover:scale-110 transition-transform duration-300">
            ZR
          </div>
          <span className={`font-semibold tracking-tight transition-all duration-300 ${scrolled ? 'text-sm' : 'text-lg'}`}>
            Zainab<span className="text-[#20b2a6]">.</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 mx-4">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
              className={`nav-3d-link text-sm ${active === link.href.slice(1) ? 'nav-3d-active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden p-2.5 rounded-full bg-[#1e2d3d] text-[#e8edf2] transition-all duration-200"
            aria-label="Toggle menu"
          >
            <div className="w-4 h-3.5 flex flex-col justify-between">
              <span className={`block h-[2px] bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block h-[2px] bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[2px] bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile drawer (attached to bottom of island) */}
      <div 
        className={`absolute top-full mt-4 w-[calc(100%-2rem)] max-w-[400px] pointer-events-auto transition-all duration-300 origin-top ${
          menuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="nav-3d px-6 py-5 flex flex-col gap-2">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
              className={`nav-3d-link w-full text-center ${active === link.href.slice(1) ? 'nav-3d-active' : ''}`}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setMenuOpen(false); navigate(isLoggedIn ? '/admin/dashboard' : '/admin'); }}
            className="btn-outline justify-center text-xs py-2 mt-2"
          >
            {isLoggedIn ? 'Dashboard' : 'Admin Login'}
          </button>
        </div>
      </div>

      <Link to="/admin" className="hidden" id="admin-link" />

      {/* Fixed Admin Button - Bottom Left */}
      <button
        onClick={handleAdminClick}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-[#6b7fa3] hover:text-[#20b2a6] hover:-translate-y-1 transition-all duration-300 shadow-lg pointer-events-auto"
        aria-label="Admin Dashboard"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>
    </header>
  );
};