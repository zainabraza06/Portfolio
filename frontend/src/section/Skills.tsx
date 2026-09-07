import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';

interface Skill {
  name: string;
  note?: string;
}

interface SkillGroup {
  category: string;
  kicker: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'AI & Machine Learning',
    kicker: 'Where most of my time goes',
    skills: [
      { name: 'Machine Learning', note: 'Classical models and meta-classifiers — the fall-detection work runs on one.' },
      { name: 'Deep Learning', note: 'Causal attention, BiLSTMs and cross-attention fusion.' },
      { name: 'Neural Networks', note: 'Architecture design, not just calling fit().' },
      { name: 'Model Evaluation', note: 'Seed-level distributions, McNemar tests, ablations that actually isolate a component.' },
      { name: 'Feature Engineering', note: 'A geometry-aware channel was the single largest accuracy driver in GAUGE-Net.' },
      { name: 'Scikit-learn', note: 'Baselines, pipelines and the boring parts that keep results honest.' },
    ],
  },
  {
    category: 'Generative AI & LLMs',
    kicker: 'What I am going deep on now',
    skills: [
      { name: 'LLMs', note: 'Prompting, evaluation and fine-tuning workflows.' },
      { name: 'RAG Pipelines', note: 'Retrieval over private corpora — chunking, embeddings, grounding.' },
      { name: 'Agentic AI', note: 'Tool-using loops that plan, act and check their own work.' },
      { name: 'Generative AI', note: 'Text and multimodal generation.' },
      { name: 'Transformers', note: 'Whisper encoders in production research; attention internals by hand.' },
      { name: 'Prompt Engineering', note: 'Structured prompting and output contracts.' },
    ],
  },
  {
    category: 'Deep Learning & Research',
    kicker: 'The research stack',
    skills: [
      { name: 'PyTorch', note: 'Training loops, custom modules, experiment tracking.' },
      { name: 'TensorFlow', note: 'Model building and deployment paths.' },
      { name: 'Keras', note: 'Fast baselines before the real architecture.' },
      { name: 'Computer Vision', note: 'MediaPipe skeletal landmarks, gesture recognition, gait datasets.' },
      { name: 'NLP & Speech', note: 'Whisper, wav2vec 2.0 and HuBERT benchmarked head to head.' },
      { name: 'Multimodal Fusion', note: 'Bidirectional cross-attention over paired audio and video streams.' },
      { name: 'Time-Series Forecasting', note: 'Turbofan remaining-useful-life and fuel-consumption models at NESCOM.' },
    ],
  },
  {
    category: 'Data & Analysis',
    kicker: 'Before any model exists',
    skills: [
      { name: 'Data Analysis', note: 'Finding out whether the dataset can answer the question at all.' },
      { name: 'NumPy', note: 'Array work, signal windows, vectorised features.' },
      { name: 'Pandas', note: 'Cleaning and reshaping the messy parts.' },
      { name: 'Matplotlib', note: 'Plots that make a result arguable.' },
      { name: 'Data Preprocessing', note: 'Self-collected classroom audio and video, 413 samples across 120 participants.' },
    ],
  },
  {
    category: 'Languages',
    kicker: 'Day to day',
    skills: [
      { name: 'Python', note: 'Every model on this page was trained in it.' },
      { name: 'JavaScript', note: 'The web half of everything I ship.' },
      { name: 'TypeScript', note: 'This site, Healix and NHMS are all typed.' },
      { name: 'Dart', note: 'Flutter builds.' },
    ],
  },
  {
    category: 'Web & Mobile',
    kicker: 'Getting it in front of people',
    skills: [
      { name: 'MERN Stack', note: 'Healix, NHMS and this portfolio — front to back, including the admin panel.' },
      { name: 'Next.js', note: 'Server rendering and routing for production apps.' },
      { name: 'Flutter', note: 'Cross-platform mobile from a single Dart codebase.' },
      { name: 'React', note: 'Component architecture, hooks, and the interaction work.' },
      { name: 'Node.js', note: 'APIs, auth and file handling.' },
      { name: 'Express', note: 'The REST layer behind this site.' },
      { name: 'MongoDB', note: 'Schema design with Mongoose.' },
      { name: 'Tailwind CSS', note: 'Design systems in the markup.' },
    ],
  },
  {
    category: 'Tools',
    kicker: 'The workshop',
    skills: [
      { name: 'Git', note: 'Branching, review, and a readable history.' },
      { name: 'GitHub', note: 'Where the code lives.' },
      { name: 'Jupyter Notebook', note: 'Exploration and result write-ups.' },
      { name: 'Google Colab', note: 'GPU time when I need it.' },
      { name: 'Kaggle', note: 'Competitions and public notebooks.' },
      { name: 'VS Code', note: 'Home.' },
      { name: 'Figma', note: 'Interfaces before they are code.' },
    ],
  },
];

const SOFT_SKILLS = [
  'Problem Solving', 'Critical Thinking', 'Team Collaboration', 'Communication',
  'Time Management', 'Adaptability', 'Quick Learner', 'Innovation',
];

const DEFAULT_NOTE = 'Hover a skill to see where I have actually used it.';

export const Skills = () => {
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', []);
  const [note, setNote] = useState<{ name: string; text: string } | null>(null);

  const show = (skill: Skill) =>
    setNote({ name: skill.name, text: skill.note ?? 'Part of my everyday toolkit.' });

  return (
    <section id="skills" className="section border-t border-line">
      <div className="shell">
        <div className="section-head reveal">
          <span className="label label-accent">02</span>
          <span className="label">Skills</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Sticky reader */}
          <div className="lg:col-span-4 reveal-left">
            <div className="lg:sticky lg:top-28">
              <h2 className="display-xl max-w-[12ch]">
                The <span className="accent-italic text-accent">toolkit</span>.
              </h2>

              <div
                className="mt-8 panel p-5 min-h-[128px] flex flex-col justify-center"
                aria-live="polite"
              >
                {note ? (
                  <>
                    <p className="label text-[10px] label-accent mb-2">{note.name}</p>
                    <p className="text-[15px] text-text leading-relaxed">{note.text}</p>
                  </>
                ) : (
                  <p className="text-[15px] text-faint leading-relaxed">{DEFAULT_NOTE}</p>
                )}
              </div>
            </div>
          </div>

          {/* Groups */}
          <div className="lg:col-span-8">
            {skillGroups.map((group, gi) => (
              <div
                key={group.category}
                className={`grid sm:grid-cols-12 gap-3 sm:gap-6 py-7 border-b border-line reveal reveal-d${Math.min(gi + 1, 6)} ${
                  gi === 0 ? 'border-t' : ''
                }`}
              >
                <div className="sm:col-span-4">
                  <h3 className="display-md text-text">{group.category}</h3>
                  <p className="label text-[10px] mt-2">{group.kicker}</p>
                </div>

                <div className="sm:col-span-8 flex flex-wrap gap-2 content-start">
                  {group.skills.map(skill => (
                    <button
                      key={skill.name}
                      type="button"
                      className="skill-tag"
                      onMouseEnter={() => show(skill)}
                      onFocus={() => show(skill)}
                      onClick={() => show(skill)}
                      onMouseLeave={() => setNote(null)}
                      onBlur={() => setNote(null)}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Soft skills, stated plainly rather than boxed */}
            <div className="grid sm:grid-cols-12 gap-3 sm:gap-6 py-7 border-b border-line reveal">
              <div className="sm:col-span-4">
                <h3 className="display-md text-text">Ways of working</h3>
              </div>
              <p className="sm:col-span-8 text-[15px] text-muted leading-relaxed">
                {SOFT_SKILLS.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
