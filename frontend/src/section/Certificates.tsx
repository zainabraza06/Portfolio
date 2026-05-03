import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { useApi } from '../hooks/useApi';
import { fetchCertificates } from '../api/services';

interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  linkedInUrl: string;
  imageUrl: string;
}

export const Certificates = () => {
  const { data: certificates, loading, error } = useApi<Certificate[]>(fetchCertificates);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [certificates]);
  const [visibleCount, setVisibleCount] = useState(6);

  return (
    <section id="certificates" className="relative py-28 px-6">
      <div
        className="orb w-[500px] h-[500px] top-[10%] left-[-200px] opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <div className="section-tag">🏆 Achievements</div>
          <h2 className="section-title">
            Certificates & <span className="gradient-text">Activity</span>
          </h2>
          <p className="text-[#6b7fa3] max-w-xl mx-auto">
            Recent milestones, courses, and professional updates featured on LinkedIn.
          </p>
        </div>

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card h-[300px] animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="glass-card p-8 text-center text-[#ef4444] reveal">
            <p>Failed to load certificates. Check backend connection.</p>
          </div>
        )}

        {!loading && !error && (certificates ?? []).length === 0 && (
          <div className="glass-card p-12 text-center reveal max-w-md mx-auto">
            <p className="text-4xl mb-3">🏅</p>
            <p className="text-[#6b7fa3]">No certificates added yet. Add them via the Admin Dashboard.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (certificates ?? []).length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(certificates ?? []).slice(0, visibleCount).map((cert, i) => (
              <a
                key={cert._id}
                href={cert.linkedInUrl || '#'}
                target={cert.linkedInUrl ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={`glass-card group overflow-hidden flex flex-col no-underline transition-all duration-300 hover:border-[#20b2a6]/50 reveal reveal-d${Math.min(i + 1, 6)}`}
                style={{
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)',
                }}
              >
                {/* Image / Fallback */}
                <div className="h-48 w-full bg-[#1e2d3d] relative overflow-hidden border-b border-white/5">
                  {cert.imageUrl ? (
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0d1520] to-[#1e2d3d]">
                      <span className="text-5xl opacity-20">🏅</span>
                    </div>
                  )}
                  {/* LinkedIn Icon Badge */}
                  {cert.linkedInUrl && (
                    <div className="absolute top-3 right-3 bg-[#0077b5] text-white p-1.5 rounded-lg shadow-lg opacity-90 backdrop-blur-md">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[#e8edf2] font-bold text-lg mb-1 line-clamp-2 group-hover:text-[#20b2a6] transition-colors">
                    {cert.title}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium">
                    <span className="text-[#20b2a6] bg-[#20b2a6]/10 px-2.5 py-1 rounded-full">
                      {cert.issuer}
                    </span>
                    <span className="text-[#6b7fa3] font-mono">{cert.date}</span>
                  </div>
                </div>
              </a>
            ))}
            </div>
            
            {(certificates ?? []).length > 6 && (
              <div className="flex justify-center mt-12 reveal">
                <button
                  onClick={() => setVisibleCount(prev => prev >= (certificates ?? []).length ? 6 : (certificates ?? []).length)}
                  className="btn-outline px-8 py-3 text-sm font-medium hover:bg-[#20b2a6] hover:text-white transition-all duration-300"
                >
                  {visibleCount >= (certificates ?? []).length ? 'View Less' : 'View More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
