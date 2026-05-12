import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  {
    label: 'Activity',
    subLinks: [
      { href: '#certificates', label: 'Certificates', icon: '🏆' },
      { href: '#hackathons', label: 'Hackathons', icon: '🚀' },
      { href: '#kaggle', label: 'Kaggle', icon: '📊' },
    ]
  },
  { href: '#contact', label: 'Contact' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const activityRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (activityRef.current && !activityRef.current.contains(target)) {
        setActivityOpen(false);
      }
      if (
        menuOpen &&
        menuButtonRef.current &&
        menuPanelRef.current &&
        !menuButtonRef.current.contains(target) &&
        !menuPanelRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivityOpen(false);
        setMenuOpen(false);
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onEscape);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onEscape);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    const sections = navLinks.flatMap(l => l.subLinks ? l.subLinks.map(s => s.href.slice(1)) : [l.href?.slice(1)].filter(Boolean));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const id = e.target.id;
            setActive(id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-10% 0px -70% 0px' }
    );
    sections.forEach(id => {
      const el = document.getElementById(id as string);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    setActivityOpen(false);
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const isLoggedIn = !!localStorage.getItem('portfolio_token');
  const handleAdminClick = () => navigate(isLoggedIn ? '/admin/dashboard' : '/admin');

  const isActivityActive = ['certificates', 'hackathons', 'kaggle'].includes(active);

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex w-full max-w-full justify-center overflow-x-clip pointer-events-none px-4">
      <div
        className={`pointer-events-auto flex w-full min-w-0 max-w-6xl items-center justify-between px-3 py-2 transition-[background-color,box-shadow,border-color,backdrop-filter,border-radius] duration-500 ease-out ${scrolled ? 'nav-3d' : 'bg-transparent'
          }`}
      >
        <a
          href="#hero"
          onClick={e => { e.preventDefault(); handleNavClick('#hero'); }}
          className="flex items-center gap-2 group px-2"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#20b2a6]/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <img src="/profilepic.jpeg" alt="ZR" className="w-full h-full object-cover" />
          </div>
          <span className={`font-semibold tracking-tight transition-all duration-300 ${scrolled ? 'text-sm' : 'text-lg'}`}>
            Zainab<span className="text-[#20b2a6]">.</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1 mx-4">
          {navLinks.map(link => {
            if (link.subLinks) {
              return (
                <div
                  key={link.label} 
                  className="relative group"
                  ref={activityRef}
                >
                  <button
                    type="button"
                    onClick={() => setActivityOpen((o) => !o)}
                    aria-expanded={activityOpen}
                    aria-haspopup="menu"
                    className={`nav-3d-link cursor-pointer text-sm flex items-center gap-1 px-4 ${isActivityActive ? 'nav-3d-active' : ''}`}
                  >
                    {link.label}
                    <svg className={`w-3 h-3 transition-transform duration-300 ${activityOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Enhanced Dropdown */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56 transition-all duration-300 ease-out ${activityOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible pointer-events-none'}`}>
                    <div className="relative glass p-2 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#20b2a6]/5 to-transparent pointer-events-none" />
                      <div className="relative flex flex-col gap-1">
                        {link.subLinks.map(sub => (
                          <a
                            key={sub.href}
                            href={sub.href}
                            onClick={e => { e.preventDefault(); handleNavClick(sub.href); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 group/item ${active === sub.href.slice(1) ? 'bg-[#20b2a6]/20 text-[#20b2a6]' : 'text-[#6b7fa3] hover:bg-white/5 hover:text-[#e8edf2]'}`}
                          >
                            <span className="text-lg transition-transform duration-300 group-hover/item:scale-125">{sub.icon}</span>
                            <div className="flex flex-col">
                              <span>{sub.label}</span>
                              <span className="text-[9px] opacity-50 font-normal">View details</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); handleNavClick(link.href!); }}
                className={`nav-3d-link text-sm ${active === link.href?.slice(1) ? 'nav-3d-active' : ''}`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden cursor-pointer p-2.5 rounded-full bg-[#1e2d3d] text-[#e8edf2] transition-all duration-200"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <div className="w-4 h-3.5 flex flex-col justify-between">
              <span className={`block h-[2px] bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block h-[2px] bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[2px] bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-full z-50 mt-3 flex justify-center px-2">
        <div
          ref={menuPanelRef}
          className={`w-full max-w-[min(26.25rem,calc(100vw-2rem))] transition-[transform,opacity] duration-300 ease-out origin-top ${menuOpen ? 'pointer-events-auto scale-y-100 opacity-100 translate-y-0' : 'pointer-events-none scale-y-0 opacity-0 -translate-y-2'
            }`}
        >
          <div className="nav-3d px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-2 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
          {navLinks.map(link => {
            if (link.subLinks) {
              return (
                <div key={link.label} className="flex flex-col gap-1 mt-2 mb-2 rounded-xl bg-white/[0.03] p-2">
                  <span className="text-[#6b7fa3] text-[10px] font-bold uppercase tracking-widest px-3 mb-1 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#20b2a6]" /> Activity
                  </span>
                  <div className="grid grid-cols-1 gap-1 pl-2">
                    {link.subLinks.map(sub => (
                      <a
                        key={sub.href}
                        href={sub.href}
                        onClick={e => { e.preventDefault(); handleNavClick(sub.href); }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${active === sub.href.slice(1) ? 'bg-[#20b2a6]/20 text-[#20b2a6]' : 'text-[#6b7fa3] hover:bg-white/[0.04] hover:text-[#e8edf2]'}`}
                      >
                        <span>{sub.icon}</span>
                        <span>{sub.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <a
                key={link.href}
                href={link.href!}
                onClick={e => { e.preventDefault(); handleNavClick(link.href!); }}
                className={`nav-3d-link w-full text-center ${active === link.href?.slice(1) ? 'nav-3d-active' : ''}`}
              >
                {link.label}
              </a>
            );
          })}
          <button
            onClick={() => { setMenuOpen(false); navigate(isLoggedIn ? '/admin/dashboard' : '/admin'); }}
            className="btn-outline justify-center text-xs py-2 mt-3"
          >
            {isLoggedIn ? 'Dashboard' : 'Admin Login'}
          </button>
          </div>
        </div>
      </div>

      <Link to="/admin" className="hidden" id="admin-link" />

      <button
        onClick={handleAdminClick}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center text-[#6b7fa3] hover:text-[#20b2a6] hover:-translate-y-1 transition-all duration-300 shadow-lg pointer-events-auto"
        aria-label="Admin Dashboard"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </header>
  );
};