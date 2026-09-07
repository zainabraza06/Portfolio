import { useState } from 'react';
import { useScrollRevealAll } from '../hooks/useScrollReveal';
import { submitContact } from '../api/services';

export const EMAIL = 'zainabraza1960@gmail.com';

export const SOCIALS = [
  { label: 'GitHub', handle: '@zainabraza06', href: 'https://github.com/zainabraza06' },
  { label: 'LinkedIn', handle: 'Zainab Raza Malik', href: 'https://www.linkedin.com/in/zainab-raza-malik-9b9a42219/' },
];

export const Contact = () => {
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', []);
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
      setMsg('Something went wrong. Please try again, or email me directly.');
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 6000);
  };

  return (
    <section id="contact" className="section border-t border-line">
      <div className="shell">
        <div className="section-head reveal">
          <span className="label label-accent">09</span>
          <span className="label">Contact</span>
        </div>

        <h2 className="display-hero display-hero--flow max-w-[13ch] reveal">
          Have an idea?
          <br />
          Let's build something{' '}
          <span className="accent-italic text-accent">intelligent</span>.
        </h2>

        <div className="mt-14 sm:mt-20 grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Direct lines */}
          <div className="lg:col-span-5 reveal-left">
            <a
              href={`mailto:${EMAIL}`}
              className="group block border-t border-line py-6"
            >
              <span className="label text-[10px]">Email</span>
              <span className="mt-2 flex items-center gap-3 text-[clamp(1.1rem,2.4vw,1.6rem)] font-[family-name:var(--font-display)] tracking-[-0.02em] text-text break-all">
                {EMAIL}
                <span className="text-accent transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </span>
            </a>

            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between gap-4 border-t border-line py-5 transition-colors duration-300 hover:text-accent"
              >
                <span className="text-[17px] font-medium text-text group-hover:text-accent transition-colors duration-300">
                  {s.label}
                </span>
                <span className="label text-[10px] flex items-center gap-2">
                  {s.handle}
                  <span className="text-faint group-hover:text-accent transition-colors duration-300">↗</span>
                </span>
              </a>
            ))}

            <p className="mt-8 text-sm text-muted leading-relaxed max-w-sm">
              Open to AI/ML and full-stack roles, research collaborations and freelance work.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 reveal-right">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="field-label">Name *</label>
                <input id="contact-name" name="name" type="text" required value={form.name}
                  onChange={handleChange} placeholder="Your name" className="form-input" />
              </div>
              <div>
                <label htmlFor="contact-email" className="field-label">Email *</label>
                <input id="contact-email" name="email" type="email" required value={form.email}
                  onChange={handleChange} placeholder="you@company.com" className="form-input" />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="contact-subject" className="field-label">Subject *</label>
              <input id="contact-subject" name="subject" type="text" required value={form.subject}
                onChange={handleChange} placeholder="Role, collaboration, question…" className="form-input" />
            </div>

            <div className="mt-5">
              <label htmlFor="contact-message" className="field-label">Message *</label>
              <textarea id="contact-message" name="message" required rows={6} value={form.message}
                onChange={handleChange} placeholder="A few lines about the role or project." className="form-input resize-none" />
            </div>

            {status !== 'idle' && status !== 'loading' && (
              <p
                role="status"
                className={`mt-5 flex items-start gap-2.5 text-sm ${status === 'success' ? 'text-ok' : 'text-bad'}`}
              >
                <span aria-hidden="true">{status === 'success' ? '✓' : '!'}</span>
                {msg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary mt-7 disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending…' : 'Send message'}
              {status !== 'loading' && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
