import { useEffect, useRef, useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { useApi } from '../hooks/useApi';
import { fetchProjects, fetchCertificates } from '../api/services';
import { skillGroups } from './Skills';

function CountUp({ target, suffix = '', decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      const duration = 1100;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // easeOutExpo
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setValue(target * eased);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const NOTES = [
  { k: 'Currently building', v: 'Agentic AI systems, RAG pipelines and LLM-powered tools.' },
  { k: 'Working with', v: 'Python, PyTorch and LangGraph · MERN, Next.js and Flutter.' },
  { k: 'Focused on', v: 'Generative AI, applied ML, and shipping models as products.' },
];

export const About = () => {
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', []);
  const { data: projects } = useApi<unknown[]>(fetchProjects);
  const { data: certificates } = useApi<unknown[]>(fetchCertificates);

  const techCount = skillGroups
    .filter(g => g.category !== 'Soft Skills')
    .reduce((sum, g) => sum + g.skills.length, 0);

  const stats = [
    { value: projects?.length ?? 0, suffix: '', label: 'Projects shipped' },
    { value: techCount, suffix: '', label: 'Technologies' },
    { value: certificates?.length ?? 0, suffix: '', label: 'Certifications' },
    { value: 3.91, suffix: '', decimals: 2, label: 'CGPA at NUST' },
  ];

  return (
    <section id="about" className="section">
      <div className="shell">
        <div className="section-head reveal">
          <span className="label label-accent">01</span>
          <span className="label">About</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Portrait */}
          <div className="lg:col-span-4 reveal-left">
            <div className="lg:sticky lg:top-28">
              <figure className="relative">
                <div className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-ink-2">
                  <img
                    src="/profilepic.jpeg"
                    alt="Zainab Raza Malik"
                    loading="lazy"
                    width={640}
                    height={800}
                    className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-[filter] duration-700"
                  />
                </div>
                <figcaption className="flex items-center gap-2 mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="label text-[10px]">Islamabad · Open to internships</span>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Story */}
          <div className="lg:col-span-8 reveal-right">
            <h2 className="display-xl max-w-[16ch]">
              I build models, and the{' '}
              <span className="accent-italic text-accent">software around them</span>.
            </h2>

            <div className="mt-8 sm:mt-10 space-y-6 max-w-2xl">
              <p className="lede">
                I'm a <span className="mark">BS Artificial Intelligence student at NUST, SEECS</span>,
                building AI/ML solutions end to end — generative AI and LLM applications,
                RAG pipelines and agentic systems that do real work rather than demos.
              </p>
              <p className="text-muted">
                My projects run from multi-agent research assistants and retrieval-grounded
                tools to computer vision, speech and time-series models. I ship them as
                full-stack products — MERN and Next.js on the web, Flutter on mobile — so the
                model reaches the person who needs it.
              </p>
            </div>

            <dl className="mt-12 border-t border-line">
              {NOTES.map(note => (
                <div key={note.k} className="grid sm:grid-cols-12 gap-2 sm:gap-6 py-5 border-b border-line">
                  <dt className="label text-[10px] sm:col-span-4 sm:pt-1">{note.k}</dt>
                  <dd className="sm:col-span-8 text-[15px] text-muted leading-relaxed">{note.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 border-t border-line">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-8 lg:py-10 ${i % 2 === 1 ? 'pl-6 border-l border-line' : ''} ${
                i > 1 ? '' : 'border-b border-line lg:border-b-0'
              } ${i === 2 ? 'lg:border-l lg:border-line lg:pl-6' : ''} ${i === 3 ? 'lg:pl-6' : ''}`}
            >
              <p className="stat-value text-text">
                <CountUp target={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                {s.decimals === undefined && s.value > 0 && <span className="text-accent">+</span>}
              </p>
              <p className="label text-[10px] mt-3">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
