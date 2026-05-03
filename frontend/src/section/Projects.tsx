import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { useApi } from '../hooks/useApi';
import { fetchProjects } from '../api/services';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  featured: boolean;
}

const FILTERS = ['All', 'Featured', 'MERN', 'Next.js', 'ML/DL'];

export const Projects = () => {
  const { data: projects, loading, error } = useApi<Project[]>(fetchProjects);
  const [filter, setFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [projects, visibleCount]);

  const filtered = (projects ?? []).filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Featured') return p.featured;
    return p.techStack.some(t => t.toLowerCase().includes(filter.toLowerCase()));
  });

  return (
    <section id="projects" className="relative py-28 px-6">
      <div
        className="orb w-[450px] h-[450px] bottom-0 left-[-150px] opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(32,178,166,0.2) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 reveal">
          <div className="section-tag">🛠 Portfolio</div>
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-[#6b7fa3] max-w-xl mx-auto">
            A selection of projects showcasing full-stack development and ML/DL research work.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 reveal">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setVisibleCount(6); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-250 ${
                filter === f
                  ? 'bg-[#20b2a6] text-white shadow-lg shadow-[#20b2a6]/30'
                  : 'glass text-[#6b7fa3] hover:text-[#e8edf2] hover:border-[#20b2a6]/40'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card p-6 h-72 animate-pulse">
                <div className="h-4 bg-white/5 rounded mb-3 w-3/4" />
                <div className="h-3 bg-white/5 rounded mb-2 w-full" />
                <div className="h-3 bg-white/5 rounded mb-2 w-5/6" />
                <div className="h-3 bg-white/5 rounded w-4/6" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="glass-card p-8 text-center text-[#ef4444] max-w-md mx-auto">
            <p className="text-4xl mb-3">⚠️</p>
            <p>Failed to load projects. Please try again later.</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="glass-card p-12 text-center max-w-md mx-auto reveal">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-[#6b7fa3]">No projects found for this filter.</p>
            <button onClick={() => setFilter('All')} className="btn-outline mt-4 text-sm py-2 px-4">
              Show All
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(0, visibleCount).map((p, i) => (
                <div key={p._id} className={`glass-card flex flex-col overflow-hidden reveal reveal-d${Math.min(i % 3 + 1, 6)}`}>
                {/* Image / Placeholder */}
                <div className="h-44 relative overflow-hidden bg-gradient-to-br from-[#0d1520] to-[#1a2535]">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl opacity-20">🖥️</div>
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `linear-gradient(135deg, rgba(32,178,166,0.3) 0%, rgba(167,139,250,0.2) 100%)`,
                        }}
                      />
                    </div>
                  )}
                  {p.featured && (
                    <div className="absolute top-3 right-3 bg-[#f5a623] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-[#e8edf2] text-lg mb-2">{p.title}</h3>
                  <p className="text-[#6b7fa3] text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
                    {p.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.techStack.slice(0, 5).map(t => (
                      <span key={t} className="skill-tag text-[11px] px-2 py-0.5">{t}</span>
                    ))}
                    {p.techStack.length > 5 && (
                      <span className="skill-tag text-[11px] px-2 py-0.5 text-[#6b7fa3]">
                        +{p.techStack.length - 5}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2 mt-auto">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline flex-1 justify-center py-2 text-xs"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        Code
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex-1 justify-center py-2 text-xs"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        <span>Live</span>
                      </a>
                    )}
                    {!p.githubUrl && !p.liveUrl && (
                      <span className="text-xs text-[#6b7fa3] py-2">Links coming soon</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
            
            {filtered.length > 6 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount(prev => prev >= filtered.length ? 6 : filtered.length)}
                  className="btn-outline px-8 py-3 text-sm font-medium hover:bg-[#20b2a6] hover:text-white transition-all duration-300"
                >
                  {visibleCount >= filtered.length ? 'View Less' : 'View More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
