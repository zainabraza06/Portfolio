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

export const Testimonials = () => {
  const { data, loading } = useApi<Testimonial[]>(fetchTestimonials);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [data]);

  const items = data ?? [];

  // Nothing approved yet? Say nothing rather than showing an empty shell.
  if (!loading && items.length === 0) {
    return <section id="testimonials" aria-hidden="true" className="h-px" />;
  }

  return (
    <section id="testimonials" className="section border-t border-line">
      <div className="shell">
        <div className="section-head reveal">
          <span className="label label-accent">08</span>
          <span className="label">In their words</span>
        </div>

        {loading ? (
          <div className="py-16 label">Loading…</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-x-14 gap-y-12">
            {items.map((t, i) => (
              <figure
                key={t._id}
                className={`reveal reveal-d${Math.min(i + 1, 6)} ${
                  i % 2 === 1 ? 'md:border-l md:border-line md:pl-14' : ''
                }`}
              >
                <blockquote className="font-[family-name:var(--font-serif)] text-[1.6rem] sm:text-[1.9rem] leading-[1.35] tracking-[-0.01em] text-text">
                  <span className="text-accent">“</span>
                  {t.text}
                  <span className="text-accent">”</span>
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt=""
                      loading="lazy"
                      className="w-9 h-9 rounded-full object-cover border border-line"
                    />
                  ) : (
                    <span className="w-9 h-9 rounded-full border border-line flex items-center justify-center label text-[10px]">
                      {t.name.slice(0, 1)}
                    </span>
                  )}
                  <span>
                    <span className="block text-sm font-medium text-text">{t.name}</span>
                    <span className="block label text-[10px] mt-0.5">
                      {[t.role, t.company].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  {t.rating > 0 && (
                    <span className="ml-auto label text-[10px] label-accent" aria-label={`${t.rating} out of 5`}>
                      {t.rating}/5
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
