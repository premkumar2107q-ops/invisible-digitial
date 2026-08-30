import { Battery, Zap } from 'lucide-react';
import { FlowPath } from './FlowPath';
import { Section } from './Section';
import type { CircuitId } from '@/sim/config';
import type { SimulationApi } from '@/sim/useSimulation';
import { CIRCUIT_BREAKER_W, NOMINAL_VOLTAGE } from '@/sim/config';

interface GridDiagramProps {
  sim: SimulationApi;
}

const CIRCUIT_COLORS: Record<CircuitId, string> = {
  A: '#60a5fa',
  B: '#34d399',
  C: '#fbbf24',
};

export function GridDiagram({ sim }: GridDiagramProps) {
  const { perCircuit, circuits, circuitCurrent, totalPower, totalCurrent, voltage } = sim;

  const sourceActive = totalPower > 0;
  const stressed = sim.status === 'WARNING' || sim.status === 'TRIPPED';

  return (
    <Section
      id="grid"
      index="SECTION 02"
      title="The Electrical Grid"
      subtitle="A miniature grid: a power source feeds a main switchboard, which distributes energy across three protected circuits. Animated flow represents current — not literal electrons."
    >
      {/* legend */}
      <div className="flex flex-wrap items-center gap-4 mb-6 font-mono text-[10px] tracking-techy text-ink-300">
        <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-flux-500/70" />V = VOLTAGE</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-flux-400/70" />A = CURRENT</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-flux-300/70" />W = POWER</span>
        <span className="ml-auto text-ink-400">SIMPLIFIED EDUCATIONAL MODEL</span>
      </div>

      <div className="panel tech-border rounded-lg p-4 md:p-8 bg-grid-fine overflow-x-auto">
        <div className="min-w-[680px]">
          <svg viewBox="0 0 760 300" className="w-full h-auto" role="img" aria-label="Interactive electrical grid diagram">
            {/* === Power Source === */}
            <g>
              <rect x="20" y="120" width="110" height="60" rx="4" fill="#0c1118" stroke="rgba(120,150,190,0.35)" strokeWidth="1.5" />
              <rect x="20" y="120" width="110" height="22" rx="4" fill="rgba(59,130,246,0.08)" />
              <text x="75" y="135" textAnchor="middle" className="font-mono" fill="#8b9bb0" fontSize="8" letterSpacing="1.5">POWER SOURCE</text>
              <Battery x="60" y="145" width="30" height="28" className="text-flux-400" />
              <text x="75" y="195" textAnchor="middle" className="font-mono" fill="#b8c4d4" fontSize="9">{voltage.toFixed(0)} V</text>
            </g>

            {/* source -> main */}
            <FlowPath d="M 130 150 L 210 150" active={sourceActive} intensity={Math.min(1, totalCurrent / 30)} stressed={stressed} />

            {/* === Main Switchboard === */}
            <g>
              <rect x="210" y="100" width="130" height="100" rx="4" fill="#0c1118" stroke="rgba(120,150,190,0.35)" strokeWidth="1.5" />
              <rect x="210" y="100" width="130" height="22" rx="4" fill="rgba(59,130,246,0.08)" />
              <text x="275" y="115" textAnchor="middle" className="font-mono" fill="#8b9bb0" fontSize="8" letterSpacing="1.5">MAIN SWITCHBOARD</text>
              <Zap x="263" y="130" width="24" height="24" className="text-flux-400" />
              <text x="275" y="172" textAnchor="middle" className="font-mono" fill="#b8c4d4" fontSize="9">{totalCurrent.toFixed(1)} A</text>
              <text x="275" y="186" textAnchor="middle" className="font-mono" fill="#8b9bb0" fontSize="8">{totalPower.toFixed(0)} W</text>
            </g>

            {/* main -> branch bus */}
            <FlowPath d="M 340 150 L 390 150" active={sourceActive} intensity={Math.min(1, totalCurrent / 30)} stressed={stressed} />
            <line x1="390" y1="60" x2="390" y2="240" stroke="rgba(120,150,190,0.35)" strokeWidth="1.5" />

            {/* === Circuits A B C === */}
            {(['A', 'B', 'C'] as CircuitId[]).map((id, i) => {
              const y = 60 + i * 90;
              const active = perCircuit[id] > 0 && !circuits[id].tripped;
              const circStressed = perCircuit[id] > CIRCUIT_BREAKER_W[id] * 0.8;
              const color = circuits[id].tripped ? '#ef4444' : CIRCUIT_COLORS[id];
              return (
                <g key={id}>
                  {/* bus tap */}
                  <FlowPath d={`M 390 ${y} L 430 ${y}`} active={active} intensity={Math.min(1, circuitCurrent[id] / 15)} stressed={circStressed || circuits[id].tripped} />
                  {/* breaker */}
                  <rect x="430" y={y - 14} width="70" height="28" rx="3" fill="#0c1118" stroke={circuits[id].tripped ? '#ef4444' : 'rgba(120,150,190,0.35)'} strokeWidth="1.5" />
                  <rect x="430" y={y - 14} width="70" height="12" rx="3" fill={circuits[id].tripped ? 'rgba(239,68,68,0.15)' : `${color}22`} />
                  <text x="465" y={y - 4} textAnchor="middle" className="font-mono" fill={circuits[id].tripped ? '#f87171' : color} fontSize="7" letterSpacing="1">CIRCUIT {id}</text>
                  <text x="465" y={y + 9} textAnchor="middle" className="font-mono" fill={circuits[id].tripped ? '#f87171' : '#b8c4d4'} fontSize="8">
                    {circuits[id].tripped ? 'TRIPPED' : `${circuitCurrent[id].toFixed(1)} A`}
                  </text>
                  {/* breaker -> appliances */}
                  <FlowPath d={`M 500 ${y} L 560 ${y}`} active={active} intensity={Math.min(1, circuitCurrent[id] / 15)} stressed={circStressed || circuits[id].tripped} />
                  {/* appliance node */}
                  <rect x="560" y={y - 16} width="160" height="32" rx="3" fill="#0c1118" stroke={active ? `${color}55` : 'rgba(120,150,190,0.2)'} strokeWidth="1.5" />
                  <circle cx="575" cy={y} r="3" fill={active ? color : 'rgba(120,150,190,0.3)'} />
                  <text x="586" y={y - 3} className="font-mono" fill={active ? '#b8c4d4' : '#5a6b80'} fontSize="8">LOADS</text>
                  <text x="586" y={y + 8} className="font-mono" fill={active ? color : '#5a6b80'} fontSize="8">{perCircuit[id].toFixed(0)} W</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <p className="mt-4 font-mono text-[10px] tracking-techy text-ink-400">
        SIMULATED / ILLUSTRATIVE · NOMINAL {NOMINAL_VOLTAGE} V · BREAKER RATING {CIRCUIT_BREAKER_W.A} W / CIRCUIT
      </p>
    </Section>
  );
}
