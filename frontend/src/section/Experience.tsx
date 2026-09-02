import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { useApi } from '../hooks/useApi';
import { fetchExperience } from '../api/services';

interface Exp {
  _id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  logo: string;
  type: 'work' | 'education';
}

const typeConfig = {
  work: { icon: '💼', color: '#20b2a6', label: 'Work' },
  education: { icon: '🎓', color: '#a78bfa', label: 'Education' },
};

export const Experience = () => {
  const { data: experiences, loading, error } = useApi<Exp[]>(fetchExperience);
  const [visibleCount, setVisibleCount] = useState(6);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [experiences, visibleCount]);

  const entries = [...(experiences ?? [])].reverse();
  const shown = entries.slice(0, visibleCount);

  return (
    <section id="experience" className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div
        className="orb w-[400px] h-[400px] top-[10%] right-[-150px] opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)' }}
      />
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <div className="section-tag">📅 Journey</div>
          <h2 className="section-title">
            Experience &amp; <span className="gradient-text">Education</span>
          </h2>
          <p className="text-[#6b7fa3] max-w-xl mx-auto">
            My academic and professional milestones on the way to becoming an AI engineer and ML researcher.
          </p>
        </div>

        {loading && (
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-2/3 mb-3" />
                <div className="h-3 bg-white/5 rounded w-1/3 mb-4" />
                <div className="h-3 bg-white/5 rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="glass-card p-8 text-center text-[#ef4444]">
            <p>Failed to load experience. Update your details via the admin panel.</p>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="glass-card p-12 text-center reveal">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-[#6b7fa3]">No experience entries yet. Add them via the admin panel.</p>
          </div>
        )}

        {/* Timeline — single rail, cards on one side */}
        {!loading && !error && entries.length > 0 && (
          <div className="max-w-3xl mx-auto">
            {shown.map((exp, i) => {
              const cfg = typeConfig[exp.type] ?? typeConfig.work;
              const isLast = i === shown.length - 1;

              return (
                <div
                  key={exp._id}
                  className={`flex gap-4 sm:gap-6 reveal reveal-d${Math.min(i + 1, 6)}`}
                >
                  {/* Rail */}
                  <div className="flex flex-col items-center flex-shrink-0 pt-6">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: cfg.color, boxShadow: `0 0 0 4px ${cfg.color}22` }}
                    />
                    {!isLast && (
                      <span
                        className="w-px flex-1 mt-2"
                        style={{ background: `linear-gradient(${cfg.color}55, ${cfg.color}10)` }}
                      />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 min-w-0 ${isLast ? '' : 'pb-6'}`}>
                    <TimelineCard exp={exp} cfg={cfg} />
                  </div>
                </div>
              );
            })}

            {entries.length > 6 && (
              <div className="flex justify-center mt-12 reveal">
                <button
                  onClick={() => setVisibleCount(prev => (prev >= entries.length ? 6 : entries.length))}
                  className="btn-outline px-8 py-3 text-sm font-medium hover:bg-[#20b2a6] hover:text-white transition-all duration-300"
                >
                  {visibleCount >= entries.length ? 'View Less' : 'View More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const PREVIEW_BULLETS = 2;

function TimelineCard({ exp, cfg }: { exp: Exp; cfg: { icon: string; color: string; label: string } }) {
  const [expanded, setExpanded] = useState(false);
  const bullets = exp.description.split('\n').map(l => l.trim()).filter(Boolean);
  const visible = expanded ? bullets : bullets.slice(0, PREVIEW_BULLETS);
  const remaining = bullets.length - visible.length;

  return (
    <div className="glass-card p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}40` }}
          >
            {cfg.icon}
            <span className="sr-only">{cfg.label}</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-[#e8edf2] font-bold text-base leading-tight">{exp.role}</h3>
            <p className="font-medium text-sm" style={{ color: cfg.color }}>{exp.company}</p>
          </div>
        </div>
        <span
          className="font-mono text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ background: `${cfg.color}12`, color: cfg.color }}
        >
          {exp.duration}
        </span>
      </div>

      {/* Body */}
      {bullets.length > 1 ? (
        <>
          <ul className="mt-3 space-y-1.5">
            {visible.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-[#6b7fa3] text-[13px] leading-relaxed">
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0 mt-[0.55em]"
                  style={{ background: cfg.color }}
                />
                <span className="flex-1">{line}</span>
              </li>
            ))}
          </ul>
          {(remaining > 0 || expanded) && (
            <button
              onClick={() => setExpanded(prev => !prev)}
              className="mt-3 text-xs font-medium hover:underline"
              style={{ color: cfg.color }}
            >
              {expanded ? 'Show less' : `Show ${remaining} more`}
            </button>
          )}
        </>
      ) : (
        <p className="mt-3 text-[#6b7fa3] text-[13px] leading-relaxed">{exp.description}</p>
      )}
    </div>
  );
}
