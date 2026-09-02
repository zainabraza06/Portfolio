import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';

export const skillGroups = [
  {
    category: 'AI & Machine Learning',
    icon: '🧠',
    color: '#f5a623',
    skills: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'Model Evaluation', 'Feature Engineering', 'Scikit-learn'],
  },
  {
    category: 'Generative AI & LLMs',
    icon: '✨',
    color: '#c084fc',
    skills: ['LLMs', 'RAG Pipelines', 'Agentic AI', 'Generative AI', 'Transformers', 'Prompt Engineering'],
  },
  {
    category: 'Deep Learning & Research',
    icon: '🤖',
    color: '#a78bfa',
    skills: ['PyTorch', 'TensorFlow', 'Keras', 'Computer Vision', 'NLP & Speech', 'Multimodal Fusion', 'Time-Series Forecasting'],
  },
  {
    category: 'Data & Analysis',
    icon: '📊',
    color: '#38bdf8',
    skills: ['Data Analysis', 'NumPy', 'Pandas', 'Matplotlib', 'Data Preprocessing'],
  },
  {
    category: 'Programming Languages',
    icon: '💻',
    color: '#20b2a6',
    skills: ['Python', 'JavaScript', 'TypeScript', 'Dart'],
  },
  {
    category: 'Web & Mobile Development',
    icon: '🌐',
    color: '#f472b6',
    skills: ['MERN Stack', 'Next.js', 'Flutter', 'React Native', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    category: 'Tools & Platforms',
    icon: '🛠️',
    color: '#22c55e',
    skills: ['Git', 'GitHub', 'Jupyter Notebook', 'Google Colab', 'Kaggle', 'VS Code', 'Figma'],
  },
  {
    category: 'Soft Skills',
    icon: '🤝',
    color: '#fb923c',
    skills: ['Problem Solving', 'Critical Thinking', 'Team Collaboration', 'Communication', 'Time Management', 'Adaptability', 'Quick Learner', 'Innovation'],
  },
];

export const Skills = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', [visibleCount]);

  return (
    <section id="skills" className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div
        className="orb w-[500px] h-[500px] top-[20%] right-[-200px] opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <div className="section-tag">⚡ Expertise</div>
          <h2 className="section-title">
            Skills &amp; <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-[#6b7fa3] max-w-xl mx-auto">
            A curated set of tools I use to build AI systems, run ML/DL research, and ship the products around them.
          </p>
        </div>

        {/* Skill groups */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.slice(0, visibleCount).map((group, gi) => (
            <div
              key={group.category}
              className={`glass-card p-6 reveal reveal-d${Math.min(gi + 1, 6)}`}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${group.color}20`, border: `1px solid ${group.color}40` }}
                >
                  {group.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[#e8edf2] text-sm">{group.category}</h3>
                  <p className="text-xs text-[#6b7fa3]">{group.skills.length} technologies</p>
                </div>
              </div>

              {/* Skill bar accent */}
              <div className="w-full h-0.5 rounded-full mb-4" style={{ background: `${group.color}30` }}>
                <div className="h-full rounded-full" style={{ width: '100%', background: `linear-gradient(90deg, ${group.color}, transparent)` }} />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map(skill => (
                  <span
                    key={skill}
                    className="skill-tag"
                    style={{ '--hover-color': group.color } as React.CSSProperties}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* "More" card */}
          <div className="glass-card p-6 reveal reveal-d6 flex flex-col items-center justify-center text-center gap-3 border-dashed">
            <div className="w-12 h-12 rounded-2xl bg-[#20b2a6]/10 border border-[#20b2a6]/30 flex items-center justify-center text-2xl animate-float">
              🚀
            </div>
            <p className="text-[#e8edf2] font-semibold">Always Learning</p>
            <p className="text-[#6b7fa3] text-sm">
              Continuously expanding skill set — currently exploring LLM fine-tuning, RAG pipelines &amp; transformer architectures.
            </p>
          </div>
        </div>

        {skillGroups.length > 6 && (
          <div className="flex justify-center mt-12 reveal">
            <button
              onClick={() => setVisibleCount(prev => prev >= skillGroups.length ? 6 : skillGroups.length)}
              className="btn-outline px-8 py-3 text-sm font-medium hover:bg-[#20b2a6] hover:text-white transition-all duration-300"
            >
              {visibleCount >= skillGroups.length ? 'View Less' : 'View More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
