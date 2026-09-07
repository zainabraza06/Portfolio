import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { useApi } from '../hooks/useApi';
import { fetchResearch } from '../api/services';

interface ResearchItem {
  _id: string;
  title: string;
  context: string;
  period: string;
  status: 'ongoing' | 'complete';
  summary: string;
  method: string;
  results: string;
  tags: string[];
  link: string;
  featured: boolean;
}

const Entry = ({ item, index }: { item: ResearchItem; index: number }) => {
  const [open, setOpen] = useState(false);
  const results = item.results.split('\n').map(l => l.trim()).filter(Boolean);
  const hasDetail = results.length > 0 || Boolean(item.method);

  return (
    <article
      className={`group border-b border-line py-8 reveal reveal-d${Math.min(index + 1, 6)}`}
    >
      <div className="grid lg:grid-cols-12 gap-4 lg:gap-8">
        {/* Meta */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                item.status === 'ongoing' ? 'bg-accent animate-pulse' : 'bg-faint'
              }`}
            />
            <span className="label text-[10px]">
              {item.status === 'ongoing' ? 'In progress' : 'Complete'}
            </span>
          </div>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-[12px] text-muted lg:pl-[18px]">
            {[item.context, item.period].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* Body */}
        <div className="lg:col-span-9">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="display-md text-text">{item.title}</h3>
            {item.featured && (
              <a href="#featured" className="label text-[10px] label-accent hover:underline">
                Featured ↑
              </a>
            )}
          </div>

          <p className="mt-3 text-[15px] leading-relaxed text-muted max-w-3xl">{item.summary}</p>

          {hasDetail && (
            <>
              <div
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pt-5 space-y-5 max-w-3xl">
                    {item.method && (
                      <div>
                        <p className="label text-[10px] mb-1.5">Method</p>
                        <p className="text-[15px] leading-relaxed text-muted">{item.method}</p>
                      </div>
                    )}
                    {results.length > 0 && (
                      <div>
                        <p className="label text-[10px] mb-1.5">Results</p>
                        <ul className="space-y-1.5">
                          {results.map((r, i) => (
                            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-text">
                              <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0 mt-[0.62em]" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                className="mt-4 label text-[10px] label-accent hover:underline"
              >
                {open ? '— Less' : '+ Method & results'}
              </button>
            </>
          )}

          {(item.tags?.length > 0 || item.link) && (
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              {item.tags?.map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="link-underline text-sm font-medium">
                  Read more ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export const Research = () => {
  const { data, loading, error } = useApi<ResearchItem[]>(fetchResearch);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [data]);

  const items = data ?? [];

  if (!loading && !error && items.length === 0) {
    return <section id="research" aria-hidden="true" className="h-px" />;
  }

  return (
    <section id="research" className="section border-t border-line">
      <div className="shell">
        <div className="section-head reveal">
          <span className="label label-accent">05</span>
          <span className="label">Research</span>
          <span className="label ml-auto">{items.length} {items.length === 1 ? 'entry' : 'entries'}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-8 sm:mb-12 reveal">
          <h2 className="display-xl lg:col-span-6 max-w-[13ch]">
            Independent <span className="accent-italic text-accent">research</span>.
          </h2>
          <p className="lede lg:col-span-6 self-end max-w-md">
            Work taken on outside the internships. The engine and speech research
            is detailed under Experience.
          </p>
        </div>

        {loading && <div className="py-16 label">Loading…</div>}
        {error && <div className="py-16 text-sm text-bad">Could not load research right now.</div>}

        {!loading && !error && (
          <div className="border-t border-line">
            {items.map((item, i) => (
              <Entry key={item._id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
