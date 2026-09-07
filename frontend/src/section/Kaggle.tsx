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
  const { data, loading, error } = useApi<KaggleComp[]>(fetchKaggle);
  const [expanded, setExpanded] = useState(false);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [data, expanded]);

  const items = data ?? [];
  const shown = expanded ? items : items.slice(0, 4);

  if (!loading && !error && items.length === 0) {
    return <section id="kaggle" aria-hidden="true" className="h-px" />;
  }

  return (
    <section id="kaggle" className="pb-20 sm:pb-28">
      <div className="shell">
        <h3 className="label mb-2 mt-14 sm:mt-20">Kaggle · {items.length}</h3>

        {loading && <div className="py-12 label">Loading…</div>}
        {error && <div className="py-12 text-sm text-bad">Could not load Kaggle entries.</div>}

        {!loading && !error && (
          <div className="border-t border-line">
            {shown.map((comp, i) => (
              <div
                key={comp._id}
                className={`group grid sm:grid-cols-12 gap-2 sm:gap-6 py-5 border-b border-line reveal reveal-d${
                  Math.min(i + 1, 6)
                }`}
              >
                <div className="sm:col-span-2">
                  {comp.rank ? (
                    <span className="inline-flex items-center gap-1.5 label text-[10px] label-accent">
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {comp.rank}
                    </span>
                  ) : (
                    <span className="label text-[10px]">{comp.date}</span>
                  )}
                </div>

                <div className="sm:col-span-7">
                  <p className="text-[16px] font-medium text-text transition-transform duration-500 group-hover:translate-x-1">
                    {comp.title}
                  </p>
                  {comp.description && (
                    <p className="mt-1.5 text-sm text-muted leading-relaxed max-w-2xl">{comp.description}</p>
                  )}
                </div>

                <div className="sm:col-span-3 flex sm:justify-end items-start gap-5">
                  {comp.rank && <span className="label text-[10px] hidden sm:block">{comp.date}</span>}
                  {comp.competitionUrl && (
                    <a href={comp.competitionUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-[13px]">
                      Competition ↗
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
