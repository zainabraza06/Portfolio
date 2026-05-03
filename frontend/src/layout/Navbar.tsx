import { useState, useEffect } from 'react';
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
      { href: '#certificates', label: 'Certificates' },
      { href: '#hackathons', label: 'Hackathons' },
      { href: '#kaggle', label: 'Kaggle' },
    ]
  },
  { href: '#contact', label: 'Contact' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <div
        className={`pointer-events-auto flex items-center justify-between px-3 py-2 transition-all duration-500 ${scrolled ? 'nav-3d w-full max-w-[800px]' : 'bg-transparent w-full max-w-6xl'
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
                  onMouseEnter={() => setActivityOpen(true)}
                  onMouseLeave={() => setActivityOpen(false)}
                >
                  <button
                    className={`nav-3d-link text-sm flex items-center gap-1 ${isActivityActive ? 'nav-3d-active' : ''}`}
                  >
                    {link.label}
                    <svg className={`w-3 h-3 transition-transform ${activityOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 transition-all duration-200 ${activityOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                    <div className="nav-3d p-2 flex flex-col gap-1 backdrop-blur-xl">
                      {link.subLinks.map(sub => (
                        <a
                          key={sub.href}
                          href={sub.href}
                          onClick={e => { e.preventDefault(); handleNavClick(sub.href); }}
                          className={`nav-3d-link text-xs w-full text-left px-3 py-2 ${active === sub.href.slice(1) ? 'bg-[#20b2a6]/10 text-[#20b2a6]' : ''}`}
                        >
                          {sub.label}
                        </a>
                      ))}
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

      <div
        className={`absolute top-full mt-4 w-[calc(100%-2rem)] max-w-[400px] pointer-events-auto transition-all duration-300 origin-top ${menuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
          }`}
      >
        <div className="nav-3d px-6 py-5 flex flex-col gap-2">
          {navLinks.map(link => {
            if (link.subLinks) {
              return (
                <div key={link.label} className="flex flex-col gap-1">
                  <span className="text-[#6b7fa3] text-[10px] font-bold uppercase tracking-widest px-3 mb-1">Activity</span>
                  {link.subLinks.map(sub => (
                    <a
                      key={sub.href}
                      href={sub.href}
                      onClick={e => { e.preventDefault(); handleNavClick(sub.href); }}
                      className={`nav-3d-link w-full text-center ${active === sub.href.slice(1) ? 'nav-3d-active' : ''}`}
                    >
                      {sub.label}
                    </a>
                  ))}
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
            className="btn-outline justify-center text-xs py-2 mt-2"
          >
            {isLoggedIn ? 'Dashboard' : 'Admin Login'}
          </button>
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