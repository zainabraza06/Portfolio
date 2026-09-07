import { EMAIL, SOCIALS } from '../section/Contact';

export const Footer = () => (
  <footer className="border-t border-line">
    <div className="shell py-10 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-[-0.02em] text-text">
            Zainab Raza Malik<span className="text-accent">.</span>
          </p>
          <p className="mt-1.5 text-sm text-muted">
            BS Artificial Intelligence, NUST SEECS · Pakistan
          </p>
        </div>

        <nav aria-label="Elsewhere" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-sm text-muted hover:text-text transition-colors duration-300"
            >
              {s.label}
            </a>
          ))}
          <a href={`mailto:${EMAIL}`} className="link-underline text-sm text-muted hover:text-text transition-colors duration-300">
            Email
          </a>
        </nav>
      </div>

      <div className="mt-10 pt-5 border-t border-line-soft flex flex-col sm:flex-row justify-between gap-2">
        <p className="label text-[10px]">© {new Date().getFullYear()} Zainab Raza Malik</p>
        <p className="label text-[10px]">Built with React, Express &amp; MongoDB</p>
      </div>
    </div>
  </footer>
);
