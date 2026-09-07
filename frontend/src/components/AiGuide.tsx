import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchProjects, fetchCertificates, fetchHackathons, fetchKaggle, fetchTestimonials,
} from '../api/services';

/**
 * A small guide that follows the reader down the page and narrates whichever
 * section they are in. Lines are written ahead of time — no model call — so it
 * can never invent a claim about Zainab. Counts and names for the collections
 * come from the API, so adding a project in the admin panel updates what the
 * guide says without touching this file.
 */

interface Line {
  id: string;
  label: string;
  text: string;
}

const LINES: Line[] = [
  {
    id: 'hero',
    label: 'Welcome',
    text: "I'm Zainab's guide to this page. She's a BS Artificial Intelligence student at NUST, SEECS.",
  },
  {
    id: 'about',
    label: 'About',
    text: 'Her focus: generative AI and deep learning, plus computer vision, speech and time-series work.',
  },
  {
    id: 'skills',
    label: 'Skills',
    text: 'PyTorch and TensorFlow for the models; MERN, Next.js and Flutter for shipping them.',
  },
  {
    id: 'projects',
    label: 'Projects',
    text: "Selected work — AI systems and full-stack products.",
  },
  {
    id: 'hackathons',
    label: 'Hackathons',
    text: 'Hackathons she has competed in.',
  },
  {
    id: 'kaggle',
    label: 'Kaggle',
    text: 'Kaggle competitions, notebooks and rankings.',
  },
  {
    id: 'certificates',
    label: 'Certificates',
    text: 'The coursework behind the projects.',
  },
  {
    id: 'featured',
    label: 'Featured',
    text: 'Her flagship: GAUGE-Net, a turbofan life-prediction model that runs unmodified on all four NASA C-MAPSS subsets.',
  },
  {
    id: 'experience',
    label: 'Experience',
    text: 'NESCOM: turbofan life and fuel-consumption prediction. Murrabi: a Whisper and MediaPipe multimodal classifier.',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    text: "What people who have worked with Zainab say.",
  },
  {
    id: 'contact',
    label: 'Contact',
    text: 'Send a message here and it lands in her inbox.',
  },
];

const VOICE_KEY = 'portfolio_guide_voice';
const AUTO_COLLAPSE_MS = 9000;
const TYPE_MS = 18;

interface Titled { title?: string; name?: string; issuer?: string }

/** "Healix – Hospital Management System" → "Healix" */
const shortTitle = (raw: string) =>
  raw.split(/[–—:(-]/)[0].trim() || raw.trim();

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const listOf = (values: string[], limit = 3) => {
  const unique = [...new Set(values.filter(Boolean))];
  const head = unique.slice(0, limit);
  if (head.length === 0) return '';
  if (head.length === 1) return head[0];
  return `${head.slice(0, -1).join(', ')} and ${head[head.length - 1]}`;
};

/** Rewrites the collection lines from live data; anything that fails keeps its written line. */
const withLiveCounts = (
  data: { projects: Titled[]; certificates: Titled[]; hackathons: Titled[]; kaggle: Titled[]; testimonials: Titled[] }
): Record<string, string> => {
  const out: Record<string, string> = {};

  if (data.projects.length > 0) {
    const names = listOf(data.projects.map(p => shortTitle(p.title ?? '')));
    const rest = data.projects.length - Math.min(3, data.projects.length);
    out.projects =
      `She has ${plural(data.projects.length, 'project', 'projects')} here — ${names}` +
      (rest > 0 ? `, and ${rest} more.` : '.') +
      '';
  }

  if (data.certificates.length > 0) {
    const issuers = listOf(data.certificates.map(c => c.issuer ?? ''));
    out.certificates =
      `She holds ${plural(data.certificates.length, 'certification', 'certifications')}` +
      (issuers ? ` — from ${issuers}, among others.` : ' — the coursework behind the projects.');
  }

  if (data.hackathons.length > 0) {
    out.hackathons =
      `She's competed in ${plural(data.hackathons.length, 'hackathon', 'hackathons')}.`;
  }

  if (data.kaggle.length > 0) {
    out.kaggle = `${plural(data.kaggle.length, 'Kaggle entry', 'Kaggle entries')} — competitions, notebooks and rankings.`;
  }

  if (data.testimonials.length > 0) {
    out.testimonials =
      `${plural(data.testimonials.length, 'person', 'people')} who have worked with Zainab.`;
  }

  return out;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

export const AiGuide = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(true);
  const [typed, setTyped] = useState('');
  const [voice, setVoice] = useState(() => {
    try {
      return localStorage.getItem(VOICE_KEY) === 'on';
    } catch {
      return false;
    }
  });

  const [live, setLive] = useState<Record<string, string>>({});

  // Set when the reader closes the bubble: stay quiet until they ask again.
  const silenced = useRef(false);
  const base = LINES[activeIndex];
  const line = { ...base, text: live[base.id] ?? base.text };

  // Counts come from the same API the sections read, so the guide stays
  // right as entries are added or removed in the admin panel.
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchProjects().catch(() => []),
      fetchCertificates().catch(() => []),
      fetchHackathons().catch(() => []),
      fetchKaggle().catch(() => []),
      fetchTestimonials().catch(() => []),
    ]).then(([projects, certificates, hackathons, kaggle, testimonials]) => {
      if (cancelled) return;
      setLive(withLiveCounts({ projects, certificates, hackathons, kaggle, testimonials }));
    });
    return () => { cancelled = true; };
  }, []);

  // ── Which section is the reader in ───────────────────────────────────
  useEffect(() => {
    const pick = () => {
      const marker = window.innerHeight * 0.35;
      let next = 0;
      LINES.forEach((l, i) => {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= marker) next = i;
      });
      setActiveIndex(prev => (prev === next ? prev : next));
    };

    pick();
    window.addEventListener('scroll', pick, { passive: true });
    window.addEventListener('resize', pick);
    return () => {
      window.removeEventListener('scroll', pick);
      window.removeEventListener('resize', pick);
    };
  }, []);

  // ── Reopen on a new section unless the reader closed it ──────────────
  useEffect(() => {
    if (!silenced.current) setOpen(true);
  }, [activeIndex]);

  // ── Type the line out ────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    if (prefersReducedMotion()) {
      setTyped(line.text);
      return;
    }

    setTyped('');
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setTyped(line.text.slice(0, i));
      if (i >= line.text.length) window.clearInterval(timer);
    }, TYPE_MS);
    return () => window.clearInterval(timer);
  }, [line.text, open]);

  // ── Collapse after a while so it never sits in the way ───────────────
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), AUTO_COLLAPSE_MS + line.text.length * TYPE_MS);
    return () => window.clearTimeout(timer);
  }, [line.text, open]);

  // ── Optional speech ──────────────────────────────────────────────────
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (!voice || !open) {
      synth.cancel();
      return;
    }
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.rate = 1.02;
    utterance.pitch = 1;
    synth.speak(utterance);
    return () => synth.cancel();
  }, [line.text, voice, open]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const toggleVoice = useCallback(() => {
    setVoice(prev => {
      const next = !prev;
      try {
        localStorage.setItem(VOICE_KEY, next ? 'on' : 'off');
      } catch {
        /* private browsing — the toggle still works for this visit */
      }
      return next;
    });
  }, []);

  const close = () => {
    silenced.current = true;
    setOpen(false);
    window.speechSynthesis?.cancel();
  };

  const openFromAvatar = () => {
    silenced.current = false;
    setOpen(prev => !prev);
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {open && (
        <div
          className="panel pointer-events-auto w-[min(21rem,calc(100vw-2.5rem))] p-4"
          style={{ animation: 'fadeInUp 0.3s ease both' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="label text-[10px] label-accent">AI Guide</span>
            <span className="label text-[10px] truncate">· {line.label}</span>

            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={toggleVoice}
                aria-pressed={voice}
                aria-label={voice ? 'Turn voice off' : 'Read this aloud'}
                title={voice ? 'Voice on' : 'Read aloud'}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  voice ? 'text-accent bg-accent/12' : 'text-faint hover:text-text'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  {voice ? (
                    <>
                      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                    </>
                  ) : (
                    <path d="M22 9l-6 6M16 9l6 6" />
                  )}
                </svg>
              </button>
              <button
                onClick={close}
                aria-label="Hide the guide"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-faint hover:text-text transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <p className="text-muted text-[13.5px] leading-relaxed" aria-live="polite">
            {typed}
            {typed.length < line.text.length && <span className="cursor-blink" />}
          </p>
        </div>
      )}

      <button
        onClick={openFromAvatar}
        aria-label={open ? 'Hide the AI guide' : 'Ask the AI guide about this section'}
        aria-expanded={open}
        className="relative pointer-events-auto w-12 h-12 rounded-full bg-accent text-accent-ink flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
      >
        {/* A spark, not a robot */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2c.5 4.6 2.4 6.5 7 7-4.6.5-6.5 2.4-7 7-.5-4.6-2.4-6.5-7-7 4.6-.5 6.5-2.4 7-7z" />
        </svg>
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent border-2 border-ink animate-pulse" />
        )}
      </button>
    </div>
  );
};
