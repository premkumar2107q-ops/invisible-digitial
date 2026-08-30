import { Fan, Flame, Laptop, Lightbulb, Tv, Wind, type LucideIcon } from 'lucide-react';
import { Section } from './Section';
import { APPLIANCES, type CircuitId } from '@/sim/config';
import type { SimulationApi } from '@/sim/useSimulation';

interface AppliancePanelProps {
  sim: SimulationApi;
}

const ICONS: Record<string, LucideIcon> = {
  Lightbulb,
  Fan,
  Tv,
  Laptop,
  Wind,
  Flame,
};

const CIRCUIT_TAG: Record<CircuitId, string> = {
  A: 'text-flux-400',
  B: 'text-emerald-400',
  C: 'text-warn-400',
};

export function AppliancePanel({ sim }: AppliancePanelProps) {
  return (
    <Section
      id="control"
      index="SECTION 03"
      title="Control the Invisible"
      subtitle="Toggle each appliance on or off. Watch current, power and the grid visualization respond instantly. The cause-and-effect is the whole point."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {APPLIANCES.map((a) => {
          const st = sim.appliances[a.id];
          const on = st.on && !sim.circuits[a.circuit].tripped;
          const Icon = ICONS[a.icon] ?? Lightbulb;
          const current = (a.power / 120).toFixed(2);
          return (
            <div
              key={a.id}
              className={`panel tech-border rounded-lg p-4 transition-all duration-300 ${
                on ? 'border-flux-400/40 shadow-[0_0_20px_-8px_rgba(59,130,246,0.5)]' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded tech-border bg-ink-900 transition-colors ${on ? 'text-flux-400' : 'text-ink-300'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-ink-50 text-sm">{a.name}</div>
                    <div className={`font-mono text-[10px] tracking-techy ${CIRCUIT_TAG[a.circuit]}`}>CIRCUIT {a.circuit}</div>
                  </div>
                </div>
                <Toggle on={on} onClick={() => sim.toggleAppliance(a.id)} label={`${a.name} ${st.on ? 'on' : 'off'}`} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Metric label="POWER" value={on ? `${a.power} W` : '0 W'} active={on} />
                <Metric label="CURRENT" value={on ? `${current} A` : '0 A'} active={on} />
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-ink-300">{a.description}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 font-mono text-[10px] tracking-techy text-ink-400">
        SIMULATED / ILLUSTRATIVE VALUES · POWER RATINGS ARE APPROXIMATE
      </p>
    </Section>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`relative h-6 w-11 rounded-full tech-border transition-colors ${on ? 'bg-flux-500/30' : 'bg-ink-800'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full transition-all duration-300 ${
          on ? 'left-[22px] bg-flux-400 shadow-[0_0_10px_rgba(96,165,250,0.7)]' : 'left-0.5 bg-ink-300'
        }`}
      />
    </button>
  );
}

function Metric({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="rounded tech-border bg-ink-900 px-2.5 py-2">
      <div className="font-mono text-[9px] tracking-techy text-ink-300">{label}</div>
      <div className={`font-mono text-sm font-semibold tabular-nums ${active ? 'text-flux-300' : 'text-ink-400'}`}>{value}</div>
    </div>
  );
}
