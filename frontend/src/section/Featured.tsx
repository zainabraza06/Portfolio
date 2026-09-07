import { useScrollRevealAll } from '../hooks/useScrollReveal';

const NUMBERS = [
  { value: '16.2%', label: 'Better NASA Score on FD002', note: 'vs. STARNet, the strongest published baseline' },
  { value: '11.3%', label: 'Better NASA Score on FD004', note: 'the other hard multi-regime subset' },
  { value: '745,984', label: 'Parameters', note: 'sub-12 ms inference across all four subsets' },
];

export const Featured = () => {
  useScrollRevealAll('.reveal, .reveal-left, .reveal-right', []);

  return (
    <section id="featured" className="on-paper section">
      <div className="shell">
        <div className="flex items-baseline gap-4 pb-5 border-b border-paper-ink/15 mb-10 sm:mb-16 reveal">
          <span className="label text-paper-ink/70">04</span>
          <span className="label">Featured research</span>
          <span className="label ml-auto hidden sm:block">NESCOM · 2026</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="display-hero text-paper-ink max-w-[9ch]">
              GAUGE
              <span className="accent-italic">-Net</span>
            </h2>
            <p className="mt-6 text-[1.15rem] leading-relaxed text-paper-ink/80 max-w-xl">
              One architecture that predicts how much life a turbofan engine has left —
              and holds up on <span className="font-medium text-paper-ink">all four</span> NASA
              C-MAPSS subsets without being rebuilt for each one.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-5 text-[15px] leading-relaxed text-paper-ink/75 lg:pt-4">
            <p>
              Published state-of-the-art models quietly change their architecture for the
              harder multi-regime subsets, which weakens any claim that they generalise.
              GAUGE-Net is deployed unmodified across FD001 to FD004 — a dual-path
              causal-attention design that has to earn its accuracy the same way everywhere.
            </p>
            <p>
              Its novel piece is a geometry-aware feature channel: Riemannian and Wasserstein
              distance from a learned healthy-reference state, fed straight in as model input.
              A five-stage component ablation confirmed that channel as the single largest
              driver of the accuracy gains.
            </p>
            <p className="text-paper-ink/60">
              It records a regression on FD003's NASA Score and near-parity on FD001. Both are
              in the results, because a paper that only reports its wins is not a result.
            </p>
          </div>
        </div>

        {/* Numbers */}
        <div className="mt-14 sm:mt-20 grid sm:grid-cols-3 border-t border-paper-ink/15">
          {NUMBERS.map((n, i) => (
            <div
              key={n.label}
              className={`py-8 sm:py-10 sm:px-8 first:sm:pl-0 last:sm:pr-0 border-b sm:border-b-0 border-paper-ink/15 ${
                i > 0 ? 'sm:border-l sm:border-paper-ink/15' : ''
              } reveal reveal-d${i + 1}`}
            >
              <p className="stat-value text-paper-ink">{n.value}</p>
              <p className="mt-3 text-sm font-medium text-paper-ink">{n.label}</p>
              <p className="mt-1 text-[13px] text-paper-ink/60 leading-relaxed">{n.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 label text-paper-ink/60 reveal">
          Currently extending the work to thrust-specific fuel consumption prediction
        </p>
      </div>
    </section>
  );
};
