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
            My academic and professional milestones on the way to becoming a full-stack developer and ML researcher.
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

        {!loading && !error && (experiences ?? []).length === 0 && (
          <div className="glass-card p-12 text-center reveal">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-[#6b7fa3]">No experience entries yet. Add them via the admin panel.</p>
          </div>
        )}

        {/* Timeline */}
        {!loading && !error && (experiences ?? []).length > 0 && (
          <div className="relative">
            {/* Center line */}
            <div className="hidden md:block timeline-line" />

            <div className="space-y-10">
              {[...(experiences ?? [])].reverse().slice(0, visibleCount).map((exp, i) => {
                const cfg = typeConfig[exp.type] ?? typeConfig.work;
                const isLeft = i % 2 === 0;

                return (
                  <div
                    key={exp._id}
                    className={`relative flex items-start gap-6 md:gap-0 reveal reveal-d${Math.min(i + 1, 6)}`}
                  >
                    {/* Desktop: left side */}
                    <div className="hidden md:block w-[calc(50%-2rem)]">
                      {isLeft && (
                        <div className="glass-card p-5 mr-8">
                          <TimelineCard exp={exp} cfg={cfg} isLeft={true} />
                        </div>
                      )}
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex flex-col items-center w-16 flex-shrink-0 relative z-10">
                      <div className="timeline-dot" style={{ background: cfg.color, boxShadow: `0 0 0 4px ${cfg.color}30` }} />
                    </div>

                    {/* Desktop: right side */}
                    <div className="hidden md:block w-[calc(50%-2rem)]">
                      {!isLeft && (
                        <div className="glass-card p-5 ml-8">
                          <TimelineCard exp={exp} cfg={cfg} isLeft={false} />
                        </div>
                      )}
                    </div>

                    {/* Mobile card */}
                    <div className="md:hidden flex gap-4 w-full">
                      <div className="flex flex-col items-center gap-1 mt-1">
                        <div className="timeline-dot w-3 h-3" style={{ background: cfg.color }} />
                        {i < (experiences ?? []).length - 1 && (
                          <div className="w-0.5 flex-1 min-h-[40px]" style={{ background: `${cfg.color}40` }} />
                        )}
                      </div>
                      <div className="glass-card p-4 flex-1 mb-2">
                        <TimelineCard exp={exp} cfg={cfg} isLeft={false} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {(experiences ?? []).length > 6 && (
              <div className="flex justify-center mt-12 reveal">
                <button
                  onClick={() => setVisibleCount(prev => prev >= (experiences ?? []).length ? 6 : (experiences ?? []).length)}
                  className="btn-outline px-8 py-3 text-sm font-medium hover:bg-[#20b2a6] hover:text-white transition-all duration-300"
                >
                  {visibleCount >= (experiences ?? []).length ? 'View Less' : 'View More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

function TimelineCard({ exp, cfg, isLeft }: { exp: Exp; cfg: { icon: string; color: string; label: string }; isLeft?: boolean }) {
  return (
    <>
      <div className={`flex items-start gap-3 mb-3 ${isLeft ? 'flex-row-reverse' : ''}`}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}40` }}
        >
          {cfg.icon}
        </div>
        <div className={`flex-1 min-w-0 flex flex-col ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1"
            style={{ background: `${cfg.color}18`, color: cfg.color }}
          >
            {cfg.label}
          </span>
          <h3 className="text-[#e8edf2] font-bold text-base leading-tight">{exp.role}</h3>
          <p className="font-medium text-sm" style={{ color: cfg.color }}>{exp.company}</p>
        </div>
      </div>
      <p className={`text-xs text-[#6b7fa3] mb-2 font-mono ${isLeft ? 'text-right' : 'text-left'}`}>{exp.duration}</p>
      <p className={`text-[#6b7fa3] text-sm leading-relaxed ${isLeft ? 'text-right' : 'text-left'}`}>{exp.description}</p>
    </>
  );
}