import { AlertTriangle, ShieldAlert, Zap } from 'lucide-react';
import { Section } from './Section';
import type { SimulationApi } from '@/sim/useSimulation';
import { MAIN_BREAKER_W } from '@/sim/config';

interface OverloadTestProps {
  sim: SimulationApi;
}

export function OverloadTest({ sim }: OverloadTestProps) {
  const warning = sim.status === 'WARNING';
  const tripped = sim.status === 'TRIPPED';
  const loadPct = sim.loadPercent;

  return (
    <Section
      id="overload"
      index="SECTION 05"
      title="Make Something Happen"
      subtitle="Turn on several high-power appliances, or trigger the overload test directly. Watch the load climb, the paths stress, and the protection respond."
    >
      <div className="panel tech-border rounded-lg p-5 md:p-8 bg-grid-fine">
        {/* load bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 font-mono text-[10px] tracking-techy">
            <span className="text-ink-200">SYSTEM LOAD</span>
            <span className={tripped ? 'text-fault-400' : warning ? 'text-warn-400' : 'text-ink-300'}>
              {loadPct.toFixed(0)}% / 100%
            </span>
          </div>
          <div className="relative h-3 rounded-full tech-border bg-ink-900 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                tripped ? 'bg-fault-500' : warning ? 'bg-warn-500' : 'bg-flux-500'
              }`}
              style={{ width: `${loadPct}%` }}
            />
            {/* threshold markers */}
            <div className="absolute top-0 bottom-0 w-px bg-warn-400/60" style={{ left: '80%' }} aria-hidden="true" />
            <div className="absolute top-0 bottom-0 w-px bg-fault-400/60" style={{ left: '100%' }} aria-hidden="true" />
          </div>
          <div className="flex justify-between mt-1 font-mono text-[9px] tracking-techy text-ink-400">
            <span>0 W</span>
            <span className="text-warn-400">80% WARNING</span>
            <span className="text-fault-400">{MAIN_BREAKER_W} W TRIP</span>
          </div>
        </div>

        {/* status banner */}
        <div
          className={`rounded-lg tech-border p-4 mb-6 transition-all duration-300 ${
            tripped
              ? 'bg-fault-500/10 border-fault-400/40'
              : warning
              ? 'bg-warn-500/10 border-warn-400/40'
              : 'bg-ink-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {tripped ? (
              <ShieldAlert className="h-6 w-6 text-fault-400" />
            ) : warning ? (
              <AlertTriangle className="h-6 w-6 text-warn-400" />
            ) : (
              <Zap className="h-6 w-6 text-flux-400" />
            )}
            <div>
              <div
                className={`font-mono text-sm font-semibold tracking-techy ${
                  tripped ? 'text-fault-400' : warning ? 'text-warn-400' : 'text-ink-100'
                }`}
              >
                {tripped ? 'CIRCUIT PROTECTION TRIGGERED' : warning ? 'HIGH LOAD DETECTED' : 'SYSTEM WITHIN LIMITS'}
              </div>
              {tripped && sim.lastTrip && (
                <div className="font-mono text-[11px] text-ink-300 mt-1">
                  CIRCUIT {sim.lastTrip.circuit} DISCONNECTED · {sim.lastTrip.reason.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={sim.simulateOverload}
            disabled={tripped}
            className="flex items-center gap-2 px-5 h-12 rounded bg-warn-500/90 hover:bg-warn-500 disabled:opacity-40 disabled:cursor-not-allowed text-ink-950 font-mono text-xs font-semibold tracking-techy transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            SIMULATE OVERLOAD
          </button>
          {tripped && sim.lastTrip && (
            <button
              onClick={() => sim.clearTrip(sim.lastTrip!.circuit)}
              className="flex items-center gap-2 px-5 h-12 rounded tech-border bg-ink-850 hover:bg-ink-700 text-ink-100 font-mono text-xs font-semibold tracking-techy transition-colors"
            >
              RESET CIRCUIT {sim.lastTrip.circuit}
            </button>
          )}
          <button
            onClick={sim.reset}
            className="flex items-center gap-2 px-5 h-12 rounded tech-border bg-ink-850 hover:bg-ink-700 text-ink-100 font-mono text-xs font-semibold tracking-techy transition-colors"
          >
            FULL RESET
          </button>
        </div>

        {tripped && (
          <p className="mt-6 text-sm text-ink-200 leading-relaxed max-w-2xl fade-in">
            Protective devices disconnect a circuit when an unsafe condition is detected.
            The affected circuit is now isolated; the rest of the grid remains energized.
          </p>
        )}
      </div>

      <p className="mt-4 font-mono text-[10px] tracking-techy text-ink-400">
        SIMPLIFIED EDUCATIONAL VISUALIZATION · NO REAL ELECTRICAL HAZARD IS PRESENT
      </p>
    </Section>
  );
}
