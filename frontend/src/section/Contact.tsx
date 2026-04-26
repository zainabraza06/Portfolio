import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { submitContact } from '../api/services';

const socials = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    label: 'GitHub',
    href: 'https://github.com/zainabraza06',
    value: '@zainabraza06',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/zainab-raza-malik',
    value: 'Zainab Raza Malik',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    href: 'mailto:zainab@example.com',
    value: 'zainab@example.com',
  },
];

export const Contact = () => {
  useScrollRevealAll();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await submitContact(form);
      setMsg(res.message);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setMsg('Something went wrong. Please try again or email me directly.');
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="relative py-28 px-6">
      <div
        className="orb w-[400px] h-[400px] top-0 left-[-150px] opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(32,178,166,0.2) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 reveal">
          <div className="section-tag">📬 Contact</div>
          <h2 className="section-title">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-[#6b7fa3] max-w-xl mx-auto">
            Have a project in mind, a research question, or just want to say hi? I'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Left – info */}
          <div className="md:col-span-2 space-y-6 reveal-left">
            <div className="glass-card p-6">
              <h3 className="text-[#e8edf2] font-bold text-lg mb-1">Get in touch</h3>
              <p className="text-[#6b7fa3] text-sm leading-relaxed">
                I'm open to freelance projects, research collaborations, and full-time opportunities.
              </p>
            </div>

            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-4 flex items-center gap-4 group no-underline"
              >
                <div className="w-10 h-10 rounded-xl bg-[#20b2a6]/10 border border-[#20b2a6]/30 flex items-center justify-center text-[#20b2a6] group-hover:bg-[#20b2a6]/20 transition-colors">
                  {s.icon}
                </div>
                <div>
                  <p className="text-[#6b7fa3] text-xs">{s.label}</p>
                  <p className="text-[#e8edf2] text-sm font-medium">{s.value}</p>
                </div>
                <svg className="ml-auto text-[#6b7fa3] group-hover:text-[#20b2a6] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            ))}
          </div>

          {/* Right – Form */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-3 glass-card p-8 space-y-5 reveal-right"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-[#6b7fa3] mb-1.5 uppercase tracking-wide">Name *</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-[#6b7fa3] mb-1.5 uppercase tracking-wide">Email *</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#6b7fa3] mb-1.5 uppercase tracking-wide">Subject *</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder="Project inquiry, collaboration..."
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-[#6b7fa3] mb-1.5 uppercase tracking-wide">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project or idea..."
                className="form-input resize-none"
              />
            </div>

            {/* Status toast */}
            {status !== 'idle' && status !== 'loading' && (
              <div className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
                status === 'success'
                  ? 'bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e]'
                  : 'bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444]'
              }`}>
                <span>{status === 'success' ? '✅' : '❌'}</span>
                <span>{msg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};