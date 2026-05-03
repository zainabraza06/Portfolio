import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { useApi } from '../hooks/useApi';
import { fetchHackathons } from '../api/services';

interface Hackathon {
  _id: string;
  title: string;
  description: string;
  date: string;
  projectUrl: string;
  certificateUrl: string;
  imageUrl: string;
}

export const Hackathons = () => {
  const { data: hackathons, loading, error } = useApi<Hackathon[]>(fetchHackathons);
  const [visibleCount, setVisibleCount] = useState(6);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [hackathons, visibleCount]);

  return (
    <section id="hackathons" className="relative py-28 px-6">
      <div
        className="orb w-[500px] h-[500px] top-[10%] right-[-200px] opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.3) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <div className="section-tag">🚀 Innovation</div>
          <h2 className="section-title">
            Hackathons & <span className="gradient-text">Competitions</span>
          </h2>
          <p className="text-[#6b7fa3] max-w-xl mx-auto">
            Events where I collaborated, built rapid prototypes, and solved real-world problems.
          </p>
        </div>

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card h-[350px] animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="glass-card p-8 text-center text-[#ef4444] reveal">
            <p>Failed to load hackathons. Check backend connection.</p>
          </div>
        )}

        {!loading && !error && (hackathons ?? []).length === 0 && (
          <div className="glass-card p-12 text-center reveal max-w-md mx-auto">
            <p className="text-4xl mb-3">🚀</p>
            <p className="text-[#6b7fa3]">No hackathons added yet. Add them via the Admin Dashboard.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (hackathons ?? []).length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(hackathons ?? []).slice(0, visibleCount).map((hack, i) => (
              <div
                key={hack._id}
                className={`glass-card group overflow-hidden flex flex-col transition-all duration-300 hover:border-[#f5a623]/50 reveal reveal-d${Math.min(i + 1, 6)}`}
                style={{
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)',
                }}
              >
                {/* Image / Fallback */}
                <div className="h-48 w-full bg-[#1e2d3d] relative overflow-hidden border-b border-white/5">
                  {hack.imageUrl ? (
                    <img
                      src={hack.imageUrl}
                      alt={hack.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0d1520] to-[#1e2d3d]">
                      <span className="text-5xl opacity-20">🚀</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[#e8edf2] font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#f5a623] transition-colors">
                    {hack.title}
                  </h3>
                  <p className="text-[#6b7fa3] text-sm line-clamp-3 mb-4 flex-1">
                    {hack.description}
                  </p>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5 pb-3">
                    <span className="text-[#f5a623] bg-[#f5a623]/10 px-2.5 py-1 rounded-full text-xs font-medium">
                      Hackathon
                    </span>
                    <span className="text-[#6b7fa3] text-xs font-mono">{hack.date}</span>
                  </div>

                  <div className="flex gap-2 pt-3">
                    {hack.projectUrl && (
                      <a href={hack.projectUrl} target="_blank" rel="noopener noreferrer" className="btn-outline flex-1 justify-center py-2 text-xs">
                        View Project
                      </a>
                    )}
                    {hack.certificateUrl && (
                      <a href={hack.certificateUrl} target="_blank" rel="noopener noreferrer" className="btn-outline flex-1 justify-center py-2 text-xs">
                        Certificate
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
            
            {(hackathons ?? []).length > 6 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount(prev => prev >= (hackathons ?? []).length ? 6 : (hackathons ?? []).length)}
                  className="btn-outline px-8 py-3 text-sm font-medium hover:bg-[#f5a623] hover:text-white transition-all duration-300"
                >
                  {visibleCount >= (hackathons ?? []).length ? 'View Less' : 'View More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
