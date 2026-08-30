import { useEffect, useRef, useState } from 'react';
import { Section } from './Section';
import { FlowPath } from './FlowPath';

export function FinalExperience() {
  const [phase, setPhase] = useState(0);
  // 0: quiet, 1: one circuit activates, 2: flow travels, 3: final statement
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const timers = [
          setTimeout(() => setPhase(1), 800),
          setTimeout(() => setPhase(2), 2000),
          setTimeout(() => setPhase(3), 3600),
        ];
        obs.disconnect();
        return () => timers.forEach(clearTimeout);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const flowActive = phase >= 1;

  return (
    <section ref={ref} id="final" className="relative py-24 md:py-36 px-5 md:px-8 overflow-hidden bg-grid bg-radial-glow">
      <div className="max-w-4xl mx-auto text-center">
        {/* quiet grid -> one light */}
        <div className="mb-14">
          <svg viewBox="0 0 300 120" className="w-full max-w-md mx-auto h-auto" role="img" aria-label="Final grid visualization">
            {/* source */}
            <rect x="10" y="54" width="50" height="12" rx="2" fill="#0c1118" stroke="rgba(120,150,190,0.3)" strokeWidth="1" />
            {/* wire */}
            <FlowPath d="M 60 60 L 140 60" active={flowActive} intensity={0.5} />
            {/* panel */}
            <rect x="140" y="48" width="50" height="24" rx="2" fill="#0c1118" stroke={flowActive ? 'rgba(96,165,250,0.5)' : 'rgba(120,150,190,0.3)'} strokeWidth="1" />
            {/* wire to light */}
            <FlowPath d="M 190 60 L 250 60" active={flowActive} intensity={0.5} />
            {/* the light */}
            <circle cx="262" cy="60" r="10" fill={phase >= 1 ? '#fbbf24' : '#0c1118'} stroke={phase >= 1 ? '#fbbf24' : 'rgba(120,150,190,0.3)'} strokeWidth="1" className="transition-all duration-700" style={phase >= 1 ? { filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.7))' } : {}} />
            {phase >= 1 && (
              <circle cx="262" cy="60" r="3" fill="#fff" className="fade-in" />
            )}
          </svg>
        </div>

        {phase >= 1 && (
          <div className="fade-in">
            <h2 className="text-2xl md:text-4xl font-semibold text-ink-50 leading-tight">
              YOU SAW A LIGHT TURN ON.
            </h2>
            <p className="mt-5 text-ink-300 text-base md:text-lg">
              BUT BEHIND THAT SIMPLE ACTION...
            </p>
          </div>
        )}

        {phase >= 2 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-3 fade-in">
            {['VOLTAGE', 'CURRENT', 'POWER', 'CONTROL', 'PROTECTION'].map((w, i) => (
              <span
                key={w}
                className="font-mono text-xs md:text-sm font-semibold tracking-techy text-flux-300 tech-border border-flux-400/30 rounded-full px-4 py-2 bg-flux-500/5"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {w}
              </span>
            ))}
          </div>
        )}

        {phase >= 3 && (
          <div className="mt-16 fade-in">
            <p className="text-xl md:text-3xl font-semibold text-ink-50 leading-relaxed">
              ELECTRICITY IS INVISIBLE.
            </p>
            <p className="mt-3 text-xl md:text-3xl font-semibold text-flux-400 leading-relaxed">
              ITS EFFECTS ARE NOT.
            </p>
            <div className="mt-14 inline-flex items-center gap-2.5">
              <span className="h-px w-10 bg-flux-400/40" />
              <span className="font-mono text-sm md:text-base font-semibold tracking-techy text-ink-50">
                GRID<span className="text-flux-400">//</span>FLOW
              </span>
              <span className="h-px w-10 bg-flux-400/40" />
            </div>
            <p className="mt-4 font-mono text-[10px] md:text-xs tracking-techy text-ink-300">
              THE ELECTRICITY YOU CAN'T SEE
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
