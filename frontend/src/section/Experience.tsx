import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { useApi } from '../hooks/useApi';
import { fetchExperience } from '../api/services';

interface Exp {
  _id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  logo: string;
  type: 'work' | 'education';
}

const PREVIEW_BULLETS = 2;

const Entry = ({ exp, index }: { exp: Exp; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const bullets = exp.description.split('\n').map(l => l.trim()).filter(Boolean);
  const visible = expanded ? bullets : bullets.slice(0, PREVIEW_BULLETS);
  const remaining = bullets.length - visible.length;

  return (
    <div
      className={`group grid sm:grid-cols-12 gap-3 sm:gap-8 py-8 border-b border-line reveal reveal-d${
        Math.min(index + 1, 6)
      }`}
    >
      {/* Rail + dates */}
      <div className="sm:col-span-4 lg:col-span-3 flex sm:block items-center gap-3">
        <span className="flex items-center gap-2.5">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-transform duration-500 group-hover:scale-150 ${
              exp.type === 'work' ? 'bg-accent' : 'bg-faint'
            }`}
          />
          <span className="label text-[10px]">{exp.type === 'work' ? 'Work' : 'Education'}</span>
        </span>
        <p className="sm:mt-2 font-[family-name:var(--font-mono)] text-[12px] text-muted sm:pl-[18px]">
          {exp.duration}
        </p>
      </div>

      {/* Body */}
      <div className="sm:col-span-8 lg:col-span-9">
        <h3 className="display-md text-text">{exp.role}</h3>
        <p className="text-[15px] text-accent mt-0.5">{exp.company}</p>

        {bullets.length > 1 ? (
          <>
            <ul className="mt-4 space-y-2 max-w-3xl">
              {visible.map((line, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                  <span className="w-1 h-1 rounded-full bg-line flex-shrink-0 mt-[0.62em]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            {(remaining > 0 || expanded) && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="mt-4 label text-[10px] label-accent hover:underline"
              >
                {expanded ? '— Show less' : `+ ${remaining} more`}
              </button>
            )}
          </>
        ) : (
          <p className="mt-3 text-[15px] leading-relaxed text-muted max-w-3xl">{exp.description}</p>
        )}
      </div>
    </div>
  );
};

export const Experience = () => {
  const { data, loading, error } = useApi<Exp[]>(fetchExperience);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [data]);

  const entries = [...(data ?? [])].reverse();

  return (
    <section id="experience" className="section border-t border-line">
      <div className="shell">
        <div className="section-head reveal">
          <span className="label label-accent">05</span>
          <span className="label">Experience &amp; education</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-8 sm:mb-12 reveal">
          <h2 className="display-xl lg:col-span-6 max-w-[12ch]">
            The <span className="accent-italic text-accent">path</span> so far.
          </h2>
          <p className="lede lg:col-span-6 self-end max-w-md">
            Two AI internships, a degree in progress, and the schooling underneath it.
          </p>
        </div>

        {loading && <div className="py-20 text-center label">Loading…</div>}
        {error && <div className="py-20 text-center text-sm text-bad">Could not load this right now.</div>}

        {!loading && !error && entries.length > 0 && (
          <div className="border-t border-line">
            {entries.map((exp, i) => (
              <Entry key={exp._id} exp={exp} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
