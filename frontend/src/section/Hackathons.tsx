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
  const { data, loading, error } = useApi<Hackathon[]>(fetchHackathons);
  const [expanded, setExpanded] = useState(false);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [data, expanded]);

  const items = data ?? [];
  const shown = expanded ? items : items.slice(0, 4);

  if (!loading && !error && items.length === 0) {
    return <section id="hackathons" aria-hidden="true" className="h-px" />;
  }

  return (
    <section id="hackathons" className="pb-4 sm:pb-8">
      <div className="shell">
        <h3 className="label mb-2 mt-14 sm:mt-20">Hackathons · {items.length}</h3>

        {loading && <div className="py-12 label">Loading…</div>}
        {error && <div className="py-12 text-sm text-bad">Could not load hackathons.</div>}

        {!loading && !error && (
          <div className="border-t border-line">
            {shown.map((hack, i) => (
              <div
                key={hack._id}
                className={`group grid sm:grid-cols-12 gap-2 sm:gap-6 py-5 border-b border-line reveal reveal-d${
                  Math.min(i + 1, 6)
                }`}
              >
                <span className="label text-[10px] sm:col-span-2 sm:pt-1">{hack.date}</span>

                <div className="sm:col-span-7">
                  <p className="text-[16px] font-medium text-text transition-transform duration-500 group-hover:translate-x-1">
                    {hack.title}
                  </p>
                  {hack.description && (
                    <p className="mt-1.5 text-sm text-muted leading-relaxed max-w-2xl">{hack.description}</p>
                  )}
                </div>

                <div className="sm:col-span-3 flex sm:justify-end items-start gap-5">
                  {hack.projectUrl && (
                    <a href={hack.projectUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-[13px]">
                      Project ↗
                    </a>
                  )}
                  {hack.certificateUrl && (
                    <a href={hack.certificateUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-[13px]">
                      Certificate ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 4 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-6 label text-[10px] label-accent hover:underline"
          >
            {expanded ? '— Show less' : `+ ${items.length - 4} more`}
          </button>
        )}
      </div>
    </section>
  );
};
