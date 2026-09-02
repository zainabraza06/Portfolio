import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A small guide that follows the reader down the page and narrates whichever
 * section they are in. Lines are written ahead of time — no model call — so it
 * can never invent a claim about Zainab.
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
    text: "Hi — I'm Zainab's AI guide. She's a BS Artificial Intelligence student at NUST, SEECS. Scroll on and I'll tell you what you're looking at.",
  },
  {
    id: 'about',
    label: 'About',
    text: 'Her focus is generative AI and deep learning — LLMs, RAG pipelines and agentic systems — plus computer vision, speech and time-series work.',
  },
  {
    id: 'skills',
    label: 'Skills',
    text: 'PyTorch, TensorFlow and Keras for the models; MERN, Next.js and Flutter for shipping them. She writes Python, TypeScript and Dart.',
  },
  {
    id: 'projects',
    label: 'Projects',
    text: "These are things she's actually built — a hospital management platform, a pandemic simulator, gesture-controlled web apps, and an AI fashion stylist.",
  },
  {
    id: 'hackathons',
    label: 'Hackathons',
    text: 'Hackathons she has competed in — the same engineering, compressed into a weekend.',
  },
  {
    id: 'kaggle',
    label: 'Kaggle',
    text: 'Her Kaggle work: competition entries, notebooks and rankings.',
  },
  {
    id: 'certificates',
    label: 'Certificates',
    text: 'Certifications from DeepLearning.AI and Stanford, Microsoft, Meta and IBM — the coursework behind the projects.',
  },
  {
    id: 'experience',
    label: 'Experience',
    text: 'At NESCOM she designed GAUGE-Net for turbofan engine life prediction and now works on fuel-consumption models. At Murrabi she built a Whisper and MediaPipe multimodal classifier.',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    text: "What people who've worked alongside Zainab have to say.",
  },
  {
    id: 'contact',
    label: 'Contact',
    text: 'This is the part that matters — send her a message here and it lands straight in her inbox.',
  },
];

const VOICE_KEY = 'portfolio_guide_voice';
const AUTO_COLLAPSE_MS = 9000;
const TYPE_MS = 18;

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

  // Set when the reader closes the bubble: stay quiet until they ask again.
  const silenced = useRef(false);
  const line = LINES[activeIndex];

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
  }, [line, open]);

  // ── Collapse after a while so it never sits in the way ───────────────
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), AUTO_COLLAPSE_MS + line.text.length * TYPE_MS);
    return () => window.clearTimeout(timer);
  }, [line, open]);

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
  }, [line, voice, open]);

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
          className="glass-card pointer-events-auto w-[min(20rem,calc(100vw-2.5rem))] p-4"
          style={{ animation: 'fadeInUp 0.3s ease both' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#20b2a6]">
              AI Guide
            </span>
            <span className="text-[10px] text-[#6b7fa3] truncate">· {line.label}</span>

            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={toggleVoice}
                aria-pressed={voice}
                aria-label={voice ? 'Turn voice off' : 'Read this aloud'}
                title={voice ? 'Voice on' : 'Read aloud'}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  voice ? 'text-[#20b2a6] bg-[#20b2a6]/15' : 'text-[#6b7fa3] hover:text-[#e8edf2]'
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
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6b7fa3] hover:text-[#e8edf2] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <p className="text-[#6b7fa3] text-[13px] leading-relaxed" aria-live="polite">
            {typed}
            {typed.length < line.text.length && <span className="cursor-blink" />}
          </p>
        </div>
      )}

      <button
        onClick={openFromAvatar}
        aria-label={open ? 'Hide the AI guide' : 'Ask the AI guide about this section'}
        aria-expanded={open}
        className="relative pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 animate-float"
        style={{
          background: 'linear-gradient(135deg, rgba(32,178,166,0.9), rgba(167,139,250,0.85))',
          boxShadow: '0 8px 30px rgba(32,178,166,0.35)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#08131a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="8" width="16" height="12" rx="4" />
          <path d="M12 8V4" />
          <circle cx="12" cy="3" r="1.4" fill="#08131a" />
          <circle cx="9.5" cy="14" r="1.2" fill="#08131a" stroke="none" />
          <circle cx="14.5" cy="14" r="1.2" fill="#08131a" stroke="none" />
        </svg>
        {!open && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-[#080d12]" />
        )}
      </button>
    </div>
  );
};
