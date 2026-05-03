import { useEffect, useRef, useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';

const stats = [
  { value: 10, suffix: '+', label: 'Projects Completed' },
  { value: 2, suffix: '+', label: 'Years of Coding' },
  { value: 15, suffix: '+', label: 'Technologies' },
  { value: 3, suffix: '+', label: 'Research Areas' },
];

function CountUp({ target, suffix = '', inView }: { target: number; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <>{count}{suffix}</>;
}

export const About = () => {
  useScrollRevealAll();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStatsInView(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="relative py-28 px-6">
      <div className="orb w-[400px] h-[400px] top-0 left-[-150px] opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(32,178,166,0.2) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <div className="section-tag">✦ About Me</div>
          <h2 className="section-title">
            Crafting <span className="gradient-text">Digital Experiences</span>
          </h2>
          <p className="text-[#6b7fa3] max-w-2xl mx-auto">
            A passionate developer and researcher blending elegant code with intelligent systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left – Avatar */}
          <div className="reveal-left flex justify-center">
            <div className="relative w-72 h-80">
              {/* Rotating ring */}
              <div className="absolute inset-[-16px] rounded-[2rem] border-2 border-dashed border-[#20b2a6]/30 animate-spin-slow" />
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: '0 0 60px rgba(32,178,166,0.2), 0 0 120px rgba(32,178,166,0.08)' }} />
              
              {/* Status Badge */}
              <div className="absolute -top-4 -left-6 z-10 inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs font-medium animate-float"
                   style={{ animationDelay: '1s' }}>
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-[#e8edf2]">Available for opportunities</span>
              </div>
              {/* Actual Photo */}
              <div className="relative w-full h-full glass-card rounded-2xl overflow-hidden flex items-center justify-center">
                <img 
                  src="/profilepic.jpeg" 
                  alt="Zainab Raza Malik" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 glass rounded-xl px-3 py-2 flex items-center gap-2 animate-float">
                <span className="text-lg">🎓</span>
                <div>
                  <p className="text-xs font-semibold text-[#e8edf2]">BS AI Student</p>
                  <p className="text-[10px] text-[#6b7fa3]">@ NUST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right – Bio */}
          <div className="reveal-right space-y-5">
            <h3 className="text-2xl font-bold text-[#e8edf2] font-serif">
              Hello! I'm <span className="gradient-text">Zainab Raza Malik</span>
            </h3>
            <p className="text-[#6b7fa3] leading-relaxed">
              I'm a Computer Science student and full-stack developer specializing in the{' '}
              <span className="text-[#e8edf2] font-medium">MERN stack with Next.js</span>. I love building
              scalable web applications that combine beautiful interfaces with powerful backends.
            </p>
            <p className="text-[#6b7fa3] leading-relaxed">
              Beyond web development, I actively engage in{' '}
              <span className="text-[#e8edf2] font-medium">Machine Learning & Deep Learning research</span>,
              exploring computer vision, NLP, and intelligent data-driven systems.
            </p>

            {/* Key facts */}
            <div className="space-y-3 pt-2">
              {[
                { icon: '📍', label: 'Location', val: 'Pakistan' },
                { icon: '🎓', label: 'Degree', val: 'BS Artificial Intelligence @ NUST' },
                { icon: '💡', label: 'Interests', val: 'MERN Stack · Next.js · ML/DL · Research' },
                { icon: '🌐', label: 'Languages', val: 'English · Urdu' },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="text-lg w-7">{f.icon}</span>
                  <span className="text-[#6b7fa3] text-sm w-20 shrink-0">{f.label}:</span>
                  <span className="text-[#e8edf2] text-sm font-medium">{f.val}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                <span>Get In Touch</span>
              </button>
              <a
                href="/CV.pdf"
                download
                className="btn-outline"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Resume
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`glass-card p-6 text-center reveal reveal-d${i + 1}`}
            >
              <p className="text-4xl font-bold gradient-text font-mono">
                <CountUp target={s.value} suffix={s.suffix} inView={statsInView} />
              </p>
              <p className="text-sm text-[#6b7fa3] mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};