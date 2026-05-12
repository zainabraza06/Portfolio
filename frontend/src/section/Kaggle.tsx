import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { useApi } from '../hooks/useApi';
import { fetchKaggle } from '../api/services';

interface KaggleComp {
  _id: string;
  title: string;
  description: string;
  competitionUrl: string;
  rank: string;
  date: string;
  imageUrl: string;
}

export const Kaggle = () => {
  const { data: kaggle, loading, error } = useApi<KaggleComp[]>(fetchKaggle);
  const [visibleCount, setVisibleCount] = useState(6);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [kaggle, visibleCount]);

  return (
    <section id="kaggle" className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div
        className="orb w-[400px] h-[400px] top-[40%] left-[-150px] opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(32,190,255,0.3) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <div className="section-tag">📊 Data Science</div>
          <h2 className="section-title">
            Kaggle <span className="gradient-text">Competitions</span>
          </h2>
          <p className="text-[#6b7fa3] max-w-xl mx-auto">
            Machine Learning challenges and predictive modeling competitions on Kaggle.
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
            <p>Failed to load Kaggle data. Check backend connection.</p>
          </div>
        )}

        {!loading && !error && (kaggle ?? []).length === 0 && (
          <div className="glass-card p-12 text-center reveal max-w-md mx-auto">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-[#6b7fa3]">No Kaggle competitions added yet.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (kaggle ?? []).length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(kaggle ?? []).slice(0, visibleCount).map((comp, i) => (
              <div
                key={comp._id}
                className={`glass-card group overflow-hidden flex flex-col transition-all duration-300 hover:border-[#20beff]/50 reveal reveal-d${Math.min(i + 1, 6)}`}
                style={{
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)',
                }}
              >
                {/* Image / Fallback */}
                <div className="h-48 w-full bg-[#1e2d3d] relative overflow-hidden border-b border-white/5">
                  {comp.imageUrl ? (
                    <img
                      src={comp.imageUrl}
                      alt={comp.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0d1520] to-[#1e2d3d]">
                      <span className="text-5xl opacity-20">📊</span>
                    </div>
                  )}
                  {comp.rank && (
                    <div className="absolute top-3 left-3 bg-[#20beff]/20 border border-[#20beff]/30 text-[#20beff] px-2.5 py-1 rounded-md shadow-lg backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                      {comp.rank}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[#e8edf2] font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#20beff] transition-colors">
                    {comp.title}
                  </h3>
                  <p className="text-[#6b7fa3] text-sm line-clamp-3 mb-4 flex-1">
                    {comp.description}
                  </p>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5 pb-3">
                    <span className="text-[#6b7fa3] text-xs font-mono">{comp.date}</span>
                  </div>

                  {comp.competitionUrl && (
                    <div className="pt-3">
                      <a href={comp.competitionUrl} target="_blank" rel="noopener noreferrer" className="btn-outline w-full justify-center py-2 text-xs">
                        View on Kaggle
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
            
            {(kaggle ?? []).length > 6 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount(prev => prev >= (kaggle ?? []).length ? 6 : (kaggle ?? []).length)}
                  className="btn-outline px-8 py-3 text-sm font-medium hover:bg-[#20beff] hover:text-white transition-all duration-300"
                >
                  {visibleCount >= (kaggle ?? []).length ? 'View Less' : 'View More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
