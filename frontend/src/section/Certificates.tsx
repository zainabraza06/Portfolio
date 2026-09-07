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
  const { data, loading, error } = useApi<Certificate[]>(fetchCertificates);
  const [expanded, setExpanded] = useState(false);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [data, expanded]);

  const items = data ?? [];
  const shown = expanded ? items : items.slice(0, 5);

  return (
    <section id="certificates" className="section border-t border-line pb-0">
      <div className="shell">
        <div className="section-head reveal">
          <span className="label label-accent">06</span>
          <span className="label">Archive</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-8 sm:mb-12 reveal">
          <h2 className="display-xl lg:col-span-6 max-w-[14ch]">
            Certifications, <span className="accent-italic text-accent">hackathons</span>, Kaggle.
          </h2>
          <p className="lede lg:col-span-6 self-end max-w-md">
            The coursework, the weekends, and the leaderboards behind the projects above.
          </p>
        </div>

        <h3 className="label mb-2">Certifications · {items.length}</h3>

        {loading && <div className="py-12 label">Loading…</div>}
        {error && <div className="py-12 text-sm text-bad">Could not load certifications.</div>}

        {!loading && !error && (
          <div className="border-t border-line">
            {shown.map((cert, i) => {
              const Row = cert.linkedInUrl ? 'a' : 'div';
              return (
                <Row
                  key={cert._id}
                  {...(cert.linkedInUrl
                    ? { href: cert.linkedInUrl, target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className={`group grid sm:grid-cols-12 gap-1 sm:gap-6 items-baseline py-5 border-b border-line transition-colors duration-300 hover:bg-ink-2/60 reveal reveal-d${
                    Math.min(i + 1, 6)
                  }`}
                >
                  <span className="label text-[10px] sm:col-span-1">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sm:col-span-6 text-[16px] font-medium text-text transition-transform duration-500 group-hover:translate-x-1">
                    {cert.title}
                  </span>
                  <span className="sm:col-span-3 text-sm text-muted">{cert.issuer}</span>
                  <span className="sm:col-span-2 flex items-center justify-between gap-2">
                    <span className="label text-[10px]">{cert.date}</span>
                    {cert.linkedInUrl && (
                      <span className="text-faint transition-colors duration-300 group-hover:text-accent" aria-hidden="true">↗</span>
                    )}
                  </span>
                </Row>
              );
            })}
          </div>
        )}

        {items.length > 5 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-6 label text-[10px] label-accent hover:underline"
          >
            {expanded ? '— Show less' : `+ ${items.length - 5} more`}
          </button>
        )}
      </div>
    </section>
  );
};
