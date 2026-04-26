import { useEffect, useRef } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

const roles = [
  'MERN Stack Developer',
  'Next.js Engineer',
  'ML / DL Researcher',
  'Full-Stack Architect',
];

export const Hero = () => {
  const typed = useTypewriter(roles, 75, 2200);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax orbs on mouse move
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handleMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (clientX - cx) / cx;
      const dy = (clientY - cy) / cy;
      hero.querySelectorAll<HTMLElement>('.parallax-orb').forEach((orb, i) => {
        const factor = (i + 1) * 12;
        orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const scrollToAbout = () =>
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080d12] via-[#0a1520] to-[#080d12]" />
      <div className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(32,178,166,0.15), transparent)`,
        }}
      />

      {/* Parallax orbs */}
      <div
        className="parallax-orb orb w-[500px] h-[500px] top-[-100px] left-[-100px] transition-transform duration-300 ease-out"
        style={{ background: 'radial-gradient(circle, rgba(32,178,166,0.18) 0%, transparent 70%)' }}
      />
      <div
        className="parallax-orb orb w-[400px] h-[400px] bottom-[-80px] right-[-60px] transition-transform duration-300 ease-out"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)' }}
      />
      <div
        className="parallax-orb orb w-[300px] h-[300px] top-[30%] right-[5%] animate-float2 transition-transform duration-500 ease-out"
        style={{ background: 'radial-gradient(circle, rgba(32,178,166,0.1) 0%, transparent 70%)' }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(32,178,166,1) 1px, transparent 1px), linear-gradient(90deg, rgba(32,178,166,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 text-center">
        {/* Profile Picture */}
        <div 
          className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#20b2a6]/50 shadow-[0_0_30px_rgba(32,178,166,0.3)]"
          style={{ animation: 'fadeInUp 0.6s ease both' }}
        >
          <img 
            src="/profilepic.jpeg" 
            alt="Zainab Raza Malik" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main heading */}
        <h1
          className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-6"
          style={{ animation: 'fadeInUp 0.7s 0.1s ease both' }}
        >
          Hi, I'm{' '}
          <span className="gradient-text">Zainab</span>
          <br />
          <span className="text-[#e8edf2]">Raza Malik</span>
        </h1>

        {/* Typewriter */}
        <div
          className="h-12 flex items-center justify-center mb-8"
          style={{ animation: 'fadeInUp 0.7s 0.2s ease both' }}
        >
          <p className="text-xl sm:text-2xl text-[#20b2a6] font-mono font-medium">
            {typed}
            <span className="cursor-blink" />
          </p>
        </div>

        {/* Description */}
        <p
          className="max-w-2xl mx-auto text-[#6b7fa3] text-lg leading-relaxed mb-10"
          style={{ animation: 'fadeInUp 0.7s 0.3s ease both' }}
        >
          I build{' '}
          <span className="text-[#e8edf2] font-medium">elegant full-stack applications</span>{' '}
          with the MERN stack and Next.js, while exploring the frontiers of{' '}
          <span className="text-[#e8edf2] font-medium">Machine Learning & Deep Learning</span> research.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
          style={{ animation: 'fadeInUp 0.7s 0.4s ease both' }}
        >
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            <span>View My Work</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Contact Me
          </button>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
          style={{ animation: 'fadeInUp 0.7s 0.5s ease both' }}
        >
          {[
            { label: 'Projects', value: '10+' },
            { label: 'Technologies', value: '15+' },
            { label: 'Research Areas', value: '3+' },
          ].map(s => (
            <div key={s.label} className="glass-card p-4 text-center">
              <p className="text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-xs text-[#6b7fa3] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#6b7fa3] hover:text-[#20b2a6] transition-colors duration-300 group"
        style={{ animation: 'fadeInUp 0.7s 0.7s ease both' }}
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg
          className="group-hover:translate-y-1 transition-transform duration-300"
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </button>
    </section>
  );
};