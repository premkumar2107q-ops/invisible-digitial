import { useState } from 'react';
import { ArrowDown, Battery, Gauge as GaugeIcon, Plug, Zap } from 'lucide-react';
import { Section } from './Section';

interface Concept {
  id: string;
  label: string;
  icon: typeof Zap;
  desc: string;
}

const CONCEPTS: Concept[] = [
  { id: 'source', label: 'ENERGY SOURCE', icon: Battery, desc: 'Where electrical energy originates — a generator, a battery, or the utility grid.' },
  { id: 'voltage', label: 'VOLTAGE', icon: Zap, desc: 'The electrical potential difference that drives current through a circuit.' },
  { id: 'current', label: 'CURRENT', icon: GaugeIcon, desc: 'The rate at which electric charge flows through a conductor.' },
  { id: 'power', label: 'POWER', icon: Plug, desc: 'The rate at which electrical energy is being transferred or used.' },
  { id: 'action', label: 'APPLIANCE ACTION', icon: Zap, desc: 'The visible result — light, heat, motion, or cooling — produced by the appliance.' },
];

export function InvisibleVisible() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Section
      id="invisible-visible"
      index="SECTION 08"
      title="Invisible to Visible"
      subtitle="Five concepts connect an invisible energy source to a visible action. Hover or tap each one to reveal what it means."
    >
      <div className="panel tech-border rounded-lg p-6 md:p-10 bg-grid-fine">
        <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-0">
          {CONCEPTS.map((c, i) => {
            const Icon = c.icon;
            const isActive = active === c.id;
            return (
              <div key={c.id} className="flex flex-col md:flex-row items-stretch flex-1">
                <button
                  onMouseEnter={() => setActive(c.id)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(isActive ? null : c.id)}
                  onFocus={() => setActive(c.id)}
                  className={`group flex-1 rounded tech-border p-5 text-center transition-all duration-300 ${
                    isActive ? 'bg-flux-500/15 border-flux-400/50' : 'bg-ink-900 hover:bg-ink-800'
                  }`}
                  aria-expanded={isActive}
                >
                  <Icon className={`h-7 w-7 mx-auto mb-3 transition-colors ${isActive ? 'text-flux-400' : 'text-ink-300'}`} />
                  <div className={`font-mono text-xs font-semibold tracking-techy transition-colors ${isActive ? 'text-flux-300' : 'text-ink-200'}`}>
                    {c.label}
                  </div>
                  <div className={`mt-3 text-sm leading-relaxed transition-all duration-300 ${isActive ? 'text-ink-100 opacity-100 max-h-40' : 'text-ink-400 opacity-0 max-h-0 overflow-hidden'}`}>
                    {c.desc}
                  </div>
                </button>
                {i < CONCEPTS.length - 1 && (
                  <div className="flex items-center justify-center px-1 md:px-2">
                    <ArrowDown className="h-4 w-4 text-flux-400/50 rotate-90 md:rotate-0" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
