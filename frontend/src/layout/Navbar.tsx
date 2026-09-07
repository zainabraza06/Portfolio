import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'research', label: 'Research' },
  { id: 'experience', label: 'Experience' },
  { id: 'certificates', label: 'Archive' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section: whichever heading has crossed the line below the bar.
  useEffect(() => {
    const pick = () => {
      const line = window.innerHeight * 0.3;
      const tops = NAV.map(n => ({ id: n.id, el: document.getElementById(n.id) }))
        .filter((n): n is { id: string; el: HTMLElement } => n.el !== null)
        .map(n => ({ id: n.id, top: n.el.getBoundingClientRect().top }))
        .sort((a, b) => a.top - b.top);

      if (tops.length === 0) return;

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) return setActive(tops[tops.length - 1].id);

      const passed = tops.filter(t => t.top <= line);
      setActive(passed.length > 0 ? passed[passed.length - 1].id : tops[0].id);
    };

    pick();
    window.addEventListener('scroll', pick, { passive: true });
    window.addEventListener('resize', pick);
    return () => {
      window.removeEventListener('scroll', pick);
      window.removeEventListener('resize', pick);
    };
  }, []);

  // Lock the page and listen for Escape while the mobile sheet is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isLoggedIn = !!localStorage.getItem('portfolio_token');

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || menuOpen
            ? 'bg-ink/85 backdrop-blur-xl border-line'
            : 'bg-transparent border-transparent'
        }`}
      >
        <nav className="shell flex items-center justify-between h-[72px]" aria-label="Primary">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-baseline gap-2 group"
            aria-label="Back to top"
          >
            <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-[-0.02em] text-text">
              Zainab Raza Malik
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150" />
          </button>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={active === item.id ? 'true' : undefined}
                className={`relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 ${
                  active === item.id ? 'text-text' : 'text-muted hover:text-text'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 bottom-0.5 h-px bg-accent transition-all duration-500 ${
                    active === item.id ? 'w-4 opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </button>
            ))}
            <a
              href="/CV.pdf"
              download
              className="ml-3 text-[13px] font-medium text-accent-ink bg-accent hover:bg-accent-2 transition-colors duration-300 rounded-full px-4 py-2"
            >
              Résumé
            </a>
          </div>

          {/* Mobile trigger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden w-10 h-10 -mr-2 flex flex-col items-center justify-center gap-[5px]"
          >
            <span
              className={`block h-px bg-text transition-all duration-300 ${
                menuOpen ? 'w-5 translate-y-[3px] rotate-45' : 'w-5'
              }`}
            />
            <span
              className={`block h-px bg-text transition-all duration-300 ${
                menuOpen ? 'w-5 -translate-y-[3px] -rotate-45' : 'w-3.5 self-end mr-2.5'
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`fixed inset-0 z-40 lg:hidden bg-ink transition-[opacity,visibility] duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="shell h-full flex flex-col justify-center pb-16">
          {NAV.map((item, i) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className="group flex items-baseline gap-4 py-3 border-b border-line-soft text-left"
              style={{
                animation: menuOpen ? `fadeInUp 0.5s var(--ease-out-expo) ${0.05 + i * 0.05}s both` : undefined,
              }}
            >
              <span className="label text-[10px] w-6">{String(i + 1).padStart(2, '0')}</span>
              <span
                className={`display-lg transition-colors duration-300 ${
                  active === item.id ? 'text-accent' : 'text-text group-hover:text-accent'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}

          <div className="flex items-center gap-3 mt-10">
            <a href="/CV.pdf" download className="btn-primary flex-1">
              Résumé
            </a>
            <button onClick={() => go('contact')} className="btn-outline flex-1">
              Let's connect
            </button>
          </div>
        </div>
      </div>

      {/* Admin entrance — deliberately quiet */}
      <button
        onClick={() => navigate(isLoggedIn ? '/admin/dashboard' : '/admin')}
        aria-label="Admin"
        className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full border border-line bg-ink-2 text-faint hover:text-accent hover:border-accent/40 transition-colors duration-300 flex items-center justify-center"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </>
  );
};
