import { Gauge } from './Gauge';
import { Waveform } from './Waveform';
import { Section } from './Section';
import type { SimulationApi } from '@/sim/useSimulation';
import { MAIN_BREAKER_W, NOMINAL_VOLTAGE } from '@/sim/config';

interface InstrumentPanelProps {
  sim: SimulationApi;
}

export function InstrumentPanel({ sim }: InstrumentPanelProps) {
  const warning = sim.status === 'WARNING';
  const danger = sim.status === 'TRIPPED';

  return (
    <Section
      id="instruments"
      index="SECTION 04"
      title="Live Instrument Panel"
      subtitle="A real-time dashboard. Every value updates as you interact with the grid. The waveform visualizes the live current signal."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gauges */}
        <div className="lg:col-span-2 panel tech-border rounded-lg p-5 md:p-6 bg-grid-fine">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-mono text-xs tracking-techy text-ink-200">PRIMARY METERS</h3>
            <span className="font-mono text-[10px] tracking-techy text-ink-400">SIMULATED / ILLUSTRATIVE</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2">
            <Gauge
              label="VOLTAGE"
              unit="VOLTS"
              display={sim.voltage.toFixed(0)}
              value={sim.voltage}
              max={NOMINAL_VOLTAGE}
            />
            <Gauge
              label="CURRENT"
              unit="AMPS"
              display={sim.totalCurrent.toFixed(1)}
              value={sim.totalCurrent}
              max={MAIN_BREAKER_W / NOMINAL_VOLTAGE}
              warning={warning}
              danger={danger}
            />
            <Gauge
              label="TOTAL POWER"
              unit="WATTS"
              display={sim.totalPower.toFixed(0)}
              value={sim.totalPower}
              max={MAIN_BREAKER_W}
              warning={warning}
              danger={danger}
            />
            <Gauge
              label="SYSTEM LOAD"
              unit="PERCENT"
              display={`${sim.loadPercent.toFixed(0)}`}
              value={sim.loadPercent}
              max={100}
              warning={warning}
              danger={danger}
            />
          </div>
        </div>

        {/* Waveform + counters */}
        <div className="panel tech-border rounded-lg p-5 md:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-mono text-xs tracking-techy text-ink-200">CURRENT WAVEFORM</h3>
            <span className={`font-mono text-[10px] tracking-techy ${danger ? 'text-fault-400' : warning ? 'text-warn-400' : 'text-ok-400'}`}>
              {danger ? 'FAULT' : warning ? 'HIGH LOAD' : 'NOMINAL'}
            </span>
          </div>
          <Waveform data={sim.waveform} height={120} className="flex-1 min-h-[120px]" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Counter label="ACTIVE LOADS" value={String(sim.activeLoads)} />
            <Counter label="ENERGY USED" value={`${sim.energyUsed.toFixed(2)} Wh`} />
          </div>
        </div>
      </div>

      <p className="mt-4 font-mono text-[10px] tracking-techy text-ink-400">
        SIMULATED / ILLUSTRATIVE · VALUES ARE COMPUTED FROM THE INTERACTIVE MODEL, NOT REAL MEASUREMENTS
      </p>
    </Section>
  );
}

function Counter({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded tech-border bg-ink-900 px-3 py-2.5">
      <div className="font-mono text-[9px] tracking-techy text-ink-300">{label}</div>
      <div className="font-mono text-base font-semibold text-ink-50 tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
