import { useEffect, useRef } from 'react';

/**
 * A drifting field of data points that thickens around the cursor. Deliberately
 * cheap: ~70 points, one rAF loop, paused when the hero leaves the viewport.
 */
const PointField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const points: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const pointer = { x: -999, y: -999 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = width < 700 ? 34 : 72;
      points.length = 0;
      for (let i = 0; i < target; i += 1) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.14,
          vy: (Math.random() - 0.5) * 0.14,
          r: Math.random() * 1.1 + 0.5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        const near = Math.max(0, 1 - d / 220);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + near * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = near > 0.05
          ? `rgba(91, 75, 196, ${0.25 + near * 0.6})`
          : 'rgba(90, 92, 105, 0.22)';
        ctx.fill();

        if (near > 0.25) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(91, 75, 196, ${(near - 0.25) * 0.32})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      frame = requestAnimationFrame(draw);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      pointer.x = -999;
      pointer.y = -999;
    };

    resize();
    frame = requestAnimationFrame(draw);

    // Stop the loop entirely once the hero is scrolled past.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        frame = requestAnimationFrame(draw);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    }, { threshold: 0 });
    observer.observe(canvas);

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

const META = [
  { k: 'Studying', v: 'BS Artificial Intelligence, NUST SEECS' },
  { k: 'Focus', v: 'Generative AI · Deep Learning' },
  { k: 'Based in', v: 'Pakistan' },
  { k: 'Status', v: 'Open to internships' },
];

export const Hero = () => {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden pt-32">
      {/* Grid + field */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)',
        }}
      />
      <PointField />

      <div className="shell relative z-10 pb-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-end">
          {/* Statement */}
          <div className="lg:col-span-7">
            <p
              className="label label-accent mb-8 sm:mb-10"
              style={{ animation: 'fadeIn 0.8s var(--ease-out-expo) both' }}
            >
              AI Student · Builder · Creative Technologist
            </p>

            <h1 className="display-hero max-w-[16ch]">
              <span className="line-mask">
                <span style={{ animationDelay: '0.05s' }}>Building</span>
              </span>
              <span className="line-mask">
                <span style={{ animationDelay: '0.15s' }} className="text-accent accent-italic pr-2">
                  intelligent
                </span>
              </span>
              <span className="line-mask">
                <span style={{ animationDelay: '0.25s' }}>things for</span>
              </span>
              <span className="line-mask">
                <span style={{ animationDelay: '0.35s' }}>the real world.</span>
              </span>
            </h1>
          </div>

          {/* Beside it, not beneath it */}
          <div className="lg:col-span-5 lg:pb-3">
            <p
              className="lede max-w-md"
              style={{ animation: 'fadeInUp 0.8s var(--ease-out-expo) 0.5s both' }}
            >
              AI student at NUST. I build deep learning systems for{' '}
              <span className="mark">engines, speech and vision</span> — and the software
              that delivers them.
            </p>

            <p
              className="mt-6 flex items-center gap-2.5 label text-[10px]"
              style={{ animation: 'fadeInUp 0.8s var(--ease-out-expo) 0.55s both' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Currently AI/ML intern at NESCOM
            </p>

            <div
              className="mt-8 flex flex-wrap gap-3"
              style={{ animation: 'fadeInUp 0.8s var(--ease-out-expo) 0.6s both' }}
            >
              <button onClick={() => go('projects')} className="btn-primary">
                View my work
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <button onClick={() => go('contact')} className="btn-outline">
                Let's connect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata rail */}
      <div
        className="relative z-10 border-t border-line"
        style={{ animation: 'fadeIn 1s var(--ease-out-expo) 0.8s both' }}
      >
        <dl className="shell grid grid-cols-2 lg:grid-cols-4 divide-line">
          {META.map((m, i) => (
            <div
              key={m.k}
              className={`py-5 lg:py-6 lg:px-6 ${i > 0 ? 'lg:border-l lg:border-line' : ''} ${
                i % 2 === 1 ? 'pl-5 border-l border-line lg:pl-6' : ''
              } ${i < 2 ? 'border-b border-line lg:border-b-0' : ''}`}
            >
              <dt className="label text-[10px] mb-1.5">{m.k}</dt>
              <dd className="text-[13px] sm:text-sm text-text leading-snug">{m.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
