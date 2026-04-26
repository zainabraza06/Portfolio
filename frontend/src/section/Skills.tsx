import { useScrollRevealAll } from '../hooks/useScrollReveal';

const skillGroups = [
  {
    category: 'Frontend',
    icon: '🎨',
    color: '#20b2a6',
    skills: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5 / CSS3', 'Redux', 'Framer Motion'],
  },
  {
    category: 'Backend',
    icon: '⚙️',
    color: '#a78bfa',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'GraphQL', 'JWT Auth', 'Socket.io'],
  },
  {
    category: 'Database',
    icon: '🗄️',
    color: '#f5a623',
    skills: ['MongoDB', 'Mongoose', 'PostgreSQL', 'Redis', 'Firebase'],
  },
  {
    category: 'ML / DL Research',
    icon: '🧠',
    color: '#22c55e',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Computer Vision', 'NLP'],
  },
  {
    category: 'Tools & DevOps',
    icon: '🛠️',
    color: '#fb923c',
    skills: ['Git & GitHub', 'Docker', 'VS Code', 'Postman', 'Vercel', 'Linux'],
  },
];

export const Skills = () => {
  useScrollRevealAll();

  return (
    <section id="skills" className="relative py-28 px-6">
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
            A curated set of tools I use to build full-stack products and conduct ML/DL research.
          </p>
        </div>

        {/* Skill groups */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, gi) => (
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
              Continuously expanding skill set — currently exploring LLM fine-tuning & RAG pipelines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
