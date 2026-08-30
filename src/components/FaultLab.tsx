import { CheckCircle2, ShieldAlert, ShieldX, Unplug, Zap } from 'lucide-react';
import { Section } from './Section';
import { FAULTS, type FaultScenario } from '@/sim/config';
import type { SimulationApi } from '@/sim/useSimulation';

interface FaultLabProps {
  sim: SimulationApi;
}

const FAULT_ICONS: Record<FaultScenario, typeof CheckCircle2> = {
  NORMAL: CheckCircle2,
  OVERLOAD: ShieldAlert,
  OPEN: Unplug,
  SHORT: ShieldX,
};

export function FaultLab({ sim }: FaultLabProps) {
  const active = FAULTS[sim.fault];
  const Icon = FAULT_ICONS[sim.fault];

  return (
    <Section
      id="fault-lab"
      index="SECTION 06"
      title="Fault Lab"
      subtitle="Select a condition and observe what changed, what the system detected, and how protection responded. This is a purely simulated educational environment."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* selector */}
        <div className="lg:col-span-1 panel tech-border rounded-lg p-5">
          <h3 className="font-mono text-xs tracking-techy text-ink-200 mb-4">SELECT SCENARIO</h3>
          <div className="flex flex-col gap-2">
            {(Object.keys(FAULTS) as FaultScenario[]).map((key) => {
              const f = FAULTS[key];
              const ItemIcon = FAULT_ICONS[key];
              const isActive = sim.fault === key;
              return (
                <button
                  key={key}
                  onClick={() => sim.setFault(key)}
                  className={`flex items-center gap-3 px-4 py-3 rounded tech-border text-left transition-all ${
                    isActive
                      ? f.danger
                        ? 'bg-fault-500/15 border-fault-400/50'
                        : 'bg-flux-500/15 border-flux-400/50'
                      : 'bg-ink-900 hover:bg-ink-800 border-ink-700/60'
                  }`}
                  aria-pressed={isActive}
                >
                  <ItemIcon className={`h-5 w-5 ${isActive ? (f.danger ? 'text-fault-400' : 'text-flux-400') : 'text-ink-300'}`} />
                  <div>
                    <div className={`font-mono text-xs font-semibold tracking-techy ${isActive ? 'text-ink-50' : 'text-ink-200'}`}>
                      {f.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-5 text-[11px] leading-relaxed text-ink-400">
            These scenarios are simulated. Never attempt to create a real electrical fault.
          </p>
        </div>

        {/* readout */}
        <div className="lg:col-span-2 panel tech-border rounded-lg p-5 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex h-11 w-11 items-center justify-center rounded tech-border ${active.danger ? 'bg-fault-500/10 text-fault-400' : 'bg-flux-500/10 text-flux-400'}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-techy text-ink-300">SCENARIO</div>
              <div className="font-mono text-lg font-semibold text-ink-50 tracking-techy">{active.label}</div>
            </div>
          </div>

          <div className="space-y-4">
            <Readout step="01" title="WHAT CHANGED?" body={active.whatChanged} danger={active.danger} />
            <Readout step="02" title="WHAT THE SYSTEM DETECTED" body={active.detected} danger={active.danger} />
            <Readout step="03" title="HOW PROTECTION RESPONDED" body={active.response} danger={active.danger} />
          </div>

          {sim.fault !== 'NORMAL' && (
            <div className="mt-6 flex items-center gap-2 font-mono text-[11px] tracking-techy text-ink-300">
              <Zap className="h-3.5 w-3.5 text-flux-400" />
              LIVE STATE: {sim.status === 'TRIPPED' ? 'PROTECTION ACTIVE' : sim.status === 'WARNING' ? 'MONITORING' : 'OBSERVING'}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

function Readout({ step, title, body, danger }: { step: string; title: string; body: string; danger: boolean }) {
  return (
    <div className="rounded tech-border bg-ink-900 p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`font-mono text-[10px] tracking-techy ${danger ? 'text-fault-400' : 'text-flux-400'}`}>{step}</span>
        <span className="font-mono text-[10px] tracking-techy text-ink-200">{title}</span>
      </div>
      <p className="text-sm text-ink-100 leading-relaxed">{body}</p>
    </div>
  );
}
