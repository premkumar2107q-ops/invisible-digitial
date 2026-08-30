import { ArrowRight, ChevronDown } from 'lucide-react';
import { FlowPath } from './FlowPath';

interface HeroProps {
  onEnter: () => void;
}

export function Hero({ onEnter }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid bg-radial-glow">
      {/* faint vertical flow lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heroFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(96,165,250,0)" />
              <stop offset="50%" stopColor="rgba(96,165,250,0.15)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0)" />
            </linearGradient>
          </defs>
          {[20, 40, 60, 80].map((x) => (
            <line key={x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="url(#heroFade)" strokeWidth="1" />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 text-center fade-in">
        {/* status */}
        <div className="inline-flex items-center gap-2.5 mb-8 font-mono text-[11px] tracking-techy text-ok-400">
          <span className="status-dot inline-block h-2 w-2 rounded-full bg-ok-400" />
          SYSTEM READY
        </div>

        {/* headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-ink-50 leading-[1.05] tracking-tight">
          YOU DON'T SEE ELECTRICITY.
          <br />
          <span className="text-flux-400">YOU SEE WHAT IT DOES.</span>
        </h1>

        <p className="mt-7 text-ink-200 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Every device around us depends on an invisible flow of electrical energy.
          GRID//FLOW turns that hidden system into something you can see, control and understand.
        </p>

        {/* mini grid diagram */}
        <div className="mt-12 mx-auto max-w-2xl">
          <HeroGridFlow />
        </div>

        {/* CTA */}
        <button
          onClick={onEnter}
          className="group mt-12 inline-flex items-center gap-3 px-7 h-14 rounded bg-flux-500 hover:bg-flux-400 text-white font-mono text-sm font-semibold tracking-techy transition-all hover:shadow-[0_0_30px_-4px_rgba(59,130,246,0.6)]"
        >
          ENTER THE GRID
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="mt-5 font-mono text-[10px] tracking-techy text-ink-300">
          INTERACTIVE ELECTRICAL SIMULATION
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-300 animate-bounce" aria-hidden="true">
        <ChevronDown className="h-5 w-5" />
      </div>
    </section>
  );
}

function HeroGridFlow() {
  // A simplified horizontal flow: SOURCE -> PANEL -> CIRCUITS -> APPLIANCES
  const nodes = [
    { label: 'POWER SOURCE', x: 8 },
    { label: 'MAIN PANEL', x: 33 },
    { label: 'CIRCUITS', x: 58 },
    { label: 'APPLIANCES', x: 83 },
  ];
  return (
    <div className="relative">
      <svg viewBox="0 0 100 40" className="w-full h-auto" role="img" aria-label="Simplified electrical grid flow">
        {/* connecting wires */}
        <FlowPath d="M 12 20 L 29 20" active intensity={0.6} />
        <FlowPath d="M 37 20 L 54 20" active intensity={0.6} />
        <FlowPath d="M 62 20 L 79 20" active intensity={0.6} />
        {/* branch lines after circuits */}
        <FlowPath d="M 58 20 L 58 12 L 79 12" active intensity={0.4} />
        <FlowPath d="M 58 20 L 58 28 L 79 28" active intensity={0.4} />
        {/* nodes */}
        {nodes.map((n) => (
          <g key={n.label}>
            <rect x={n.x - 1} y={17} width="8" height="6" rx="1" fill="#0f141c" stroke="rgba(120,150,190,0.4)" strokeWidth="0.3" />
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-4 gap-1 mt-2">
        {nodes.map((n) => (
          <div key={n.label} className="font-mono text-[9px] md:text-[10px] tracking-techy text-ink-200 text-center">
            {n.label}
          </div>
        ))}
      </div>
    </div>
  );
}
