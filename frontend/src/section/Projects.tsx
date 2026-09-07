import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { useApi } from '../hooks/useApi';
import { fetchProjects } from '../api/services';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  problem?: string;
  outcome?: string;
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  featured: boolean;
}

const FILTERS = ['Featured', 'All', 'Python', 'TypeScript', 'JavaScript'];
const PREVIEW_COUNT = 5;

/** Stands in for a screenshot: a quiet plotted field keyed to the project index. */
const CoverFallback = ({ index, tech }: { index: number; tech: string[] }) => (
  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] border border-line bg-ink-2">
    <div
      className="absolute inset-0 opacity-[0.5]"
      style={{
        backgroundImage: 'radial-gradient(var(--color-line) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    />
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={Array.from({ length: 9 }, (_, i) => {
          const x = (i / 8) * 400;
          const y = 210 - Math.sin(i * 0.8 + index) * 46 - i * 9;
          return `${x},${y}`;
        }).join(' ')}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        opacity="0.75"
      />
    </svg>
    <span className="absolute top-5 left-5 label text-[10px]">{tech.slice(0, 3).join(' / ')}</span>
    <span className="absolute bottom-4 right-6 font-[family-name:var(--font-display)] text-[5rem] leading-none text-line select-none">
      {String(index + 1).padStart(2, '0')}
    </span>
  </div>
);

const Case = ({ project, index }: { project: Project; index: number }) => {
  const flip = index % 2 === 1;

  return (
    <article
      className={`group grid lg:grid-cols-12 gap-8 lg:gap-14 items-center py-12 sm:py-16 border-b border-line reveal reveal-d${
        Math.min(index + 1, 6)
      }`}
    >
      {/* Visual */}
      <div className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
        <a
          href={project.liveUrl || project.githubUrl || undefined}
          target={project.liveUrl || project.githubUrl ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-[var(--radius-md)]"
          tabIndex={project.liveUrl || project.githubUrl ? 0 : -1}
          aria-label={project.liveUrl || project.githubUrl ? `Open ${project.title}` : undefined}
        >
          {project.imageUrl ? (
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-ink-2">
              <img
                src={project.imageUrl}
                alt={project.title}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </div>
          ) : (
            <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]">
              <CoverFallback index={index} tech={project.techStack} />
            </div>
          )}
        </a>
      </div>

      {/* Copy */}
      <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="label text-[10px] label-accent">{String(index + 1).padStart(2, '0')}</span>
          <span className="h-px flex-1 bg-line transition-colors duration-500 group-hover:bg-accent/60" />
          {project.featured && <span className="label text-[10px]">Featured</span>}
        </div>

        <h3 className="display-lg text-text transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
          {project.title}
        </h3>

        <p className="mt-4 text-[15px] leading-relaxed text-muted">{project.description}</p>

        {(project.problem || project.outcome) && (
          <dl className="mt-6 space-y-3 border-t border-line pt-5">
            {project.problem && (
              <div>
                <dt className="label text-[10px] mb-1">Problem</dt>
                <dd className="text-sm text-muted leading-relaxed">{project.problem}</dd>
              </div>
            )}
            {project.outcome && (
              <div>
                <dt className="label text-[10px] mb-1">Outcome</dt>
                <dd className="text-sm text-text leading-relaxed">{project.outcome}</dd>
              </div>
            )}
          </dl>
        )}

        {project.techStack?.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map(t => (
              <li key={t} className="tag">{t}</li>
            ))}
          </ul>
        )}

        {(project.liveUrl || project.githubUrl) && (
          <div className="mt-7 flex flex-wrap items-center gap-6">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-sm font-medium">
                Live demo ↗
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-sm font-medium">
                Source ↗
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export const Projects = () => {
  const { data: projects, loading, error } = useApi<Project[]>(fetchProjects);
  const [filter, setFilter] = useState('Featured');
  const [expanded, setExpanded] = useState(false);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [projects, expanded, filter]);

  const all = projects ?? [];
  const filtered = all.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Featured') return p.featured;
    return p.techStack?.some(t => t.toLowerCase().includes(filter.toLowerCase()));
  });
  // Featured leads; the rest of the repos sit behind one click.
  const shown = expanded ? filtered : filtered.slice(0, PREVIEW_COUNT);

  return (
    <section id="projects" className="section border-t border-line">
      <div className="shell">
        <div className="section-head reveal">
          <span className="label label-accent">03</span>
          <span className="label">Selected work</span>
          <span className="label ml-auto">{all.length} projects</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-6 reveal">
          <h2 className="display-xl lg:col-span-7 max-w-[14ch]">
            Things I've <span className="accent-italic text-accent">built</span>.
          </h2>
          <p className="lede lg:col-span-5 self-end max-w-md">
            Research and products, built end to end.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 py-5 border-y border-line mb-2 reveal">
          {FILTERS.map(f => {
            const count = f === 'All'
              ? all.length
              : f === 'Featured'
                ? all.filter(p => p.featured).length
                : all.filter(p => p.techStack?.some(t => t.toLowerCase().includes(f.toLowerCase()))).length;

            return (
              <button
                key={f}
                onClick={() => { setFilter(f); setExpanded(false); }}
                aria-pressed={filter === f}
                className={`text-sm font-medium transition-colors duration-300 ${
                  filter === f ? 'text-accent' : 'text-muted hover:text-text'
                }`}
              >
                {f}
                <sup className="ml-1 label text-[9px] tracking-normal">{count}</sup>
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="py-24 text-center label">Loading work…</div>
        )}

        {error && (
          <div className="py-24 text-center text-bad text-sm">
            Could not load projects right now.
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-24 text-center label">Nothing under this filter yet.</div>
        )}

        {shown.map((project, i) => (
          <Case key={project._id} project={project} index={i} />
        ))}

        {filtered.length > PREVIEW_COUNT && (
          <div className="pt-10 flex justify-center reveal">
            <button onClick={() => setExpanded(e => !e)} className="btn-outline">
              {expanded
                ? 'Show less'
                : `Show all ${filtered.length} projects`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
