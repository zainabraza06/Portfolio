import { useRef, useState, useEffect } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { useApi } from '../hooks/useApi';
import { fetchTestimonials } from '../api/services';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  rating: number;
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? '#f5a623' : '#1e2d3d'} stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

export const Testimonials = () => {
  const { data: testimonials, loading } = useApi<Testimonial[]>(fetchTestimonials);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [testimonials, visibleCount]);
  const allItems = testimonials ?? [];
  const items = allItems.slice(0, visibleCount);

  // Auto-scroll carousel
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setActive(a => (a + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  // Scroll the carousel itself to the active card. scrollIntoView would
  // scroll the page too, yanking the viewer down here on load.
  const firstRun = useRef(true);
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || items.length === 0) return;
    const card = container.children[active] as HTMLElement | undefined;
    if (!card) return;
    container.scrollTo({
      left: card.offsetLeft - (container.clientWidth - card.clientWidth) / 2,
      behavior: firstRun.current ? 'auto' : 'smooth',
    });
    firstRun.current = false;
  }, [active, items.length]);

  return (
    <section id="testimonials" className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div
        className="orb w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bottom-0 right-[-150px] opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(32,178,166,0.2) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <div className="section-tag">💬 Testimonials</div>
          <h2 className="section-title">
            What People <span className="gradient-text">Say</span>
          </h2>
          <p className="text-[#6b7fa3] max-w-xl mx-auto">
            Feedback from colleagues, collaborators, and clients I've worked with.
          </p>
        </div>

        {loading && (
          <div className="flex gap-4 sm:gap-6 overflow-hidden">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card p-6 min-w-[280px] sm:min-w-[320px] h-52 animate-pulse flex-shrink-0">
                <div className="h-3 bg-white/5 rounded w-3/4 mb-3" />
                <div className="h-3 bg-white/5 rounded w-full mb-2" />
                <div className="h-3 bg-white/5 rounded w-5/6" />
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="glass-card p-12 text-center reveal max-w-md mx-auto">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-[#6b7fa3]">Testimonials will appear here once approved via the admin panel.</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            {/* Carousel */}
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 reveal"
            >
              {items.map((t, i) => (
                <div
                  key={t._id}
                  onClick={() => setActive(i)}
                  className={`glass-card p-6 min-w-[280px] sm:min-w-[320px] max-w-[340px] sm:max-w-[380px] flex-shrink-0 snap-center cursor-pointer transition-all duration-500 ${
                    active === i
                      ? 'border-[#20b2a6]/50 shadow-lg shadow-[#20b2a6]/10 scale-[1.02]'
                      : 'opacity-70 hover:opacity-90'
                  }`}
                >
                  {/* Quote mark */}
                  <div className="text-4xl text-[#20b2a6]/30 font-serif leading-none mb-3">"</div>
                  <p className="text-[#6b7fa3] text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                  <Stars rating={t.rating} />
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#20b2a6] to-[#178f85] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        t.name[0]
                      )}
                    </div>
                    <div>
                      <p className="text-[#e8edf2] font-semibold text-sm">{t.name}</p>
                      <p className="text-[#6b7fa3] text-xs">{t.role} @ {t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${
                    active === i ? 'w-6 h-2 bg-[#20b2a6]' : 'w-2 h-2 bg-[#1e2d3d] hover:bg-[#20b2a6]/50'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            
            {allItems.length > 6 && (
              <div className="flex justify-center mt-12 reveal">
                <button
                  onClick={() => {
                    setVisibleCount(prev => prev >= allItems.length ? 6 : allItems.length);
                    setActive(0);
                  }}
                  className="btn-outline px-8 py-3 text-sm font-medium hover:bg-[#20b2a6] hover:text-white transition-all duration-300"
                >
                  {visibleCount >= allItems.length ? 'View Less' : 'View More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
