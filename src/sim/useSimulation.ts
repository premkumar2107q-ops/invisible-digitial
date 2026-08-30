import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  APPLIANCES,
  CIRCUIT_BREAKER_W,
  MAIN_BREAKER_W,
  NOMINAL_VOLTAGE,
  type CircuitId,
  type FaultScenario,
} from './config';

export interface ApplianceState {
  id: string;
  on: boolean;
}

export interface CircuitState {
  id: CircuitId;
  tripped: boolean;
}

export type SystemStatus = 'READY' | 'NORMAL' | 'WARNING' | 'TRIPPED';

export interface SimulationState {
  appliances: Record<string, ApplianceState>;
  circuits: Record<CircuitId, CircuitState>;
  running: boolean;
  fault: FaultScenario;
  // live metrics
  voltage: number;
  totalPower: number;
  totalCurrent: number;
  loadPercent: number;
  activeLoads: number;
  energyUsed: number; // Wh (accumulated)
  status: SystemStatus;
  lastTrip: { circuit: CircuitId; reason: string } | null;
  waveform: number[];
}

const TICK_MS = 100;

function initialAppliances(): Record<string, ApplianceState> {
  const out: Record<string, ApplianceState> = {};
  for (const a of APPLIANCES) out[a.id] = { id: a.id, on: false };
  return out;
}

function initialCircuits(): Record<CircuitId, CircuitState> {
  return {
    A: { id: 'A', tripped: false },
    B: { id: 'B', tripped: false },
    C: { id: 'C', tripped: false },
  };
}

function computePower(
  appliances: Record<string, ApplianceState>,
  circuits: Record<CircuitId, CircuitState>,
  fault: FaultScenario
): { perCircuit: Record<CircuitId, number>; total: number } {
  const perCircuit: Record<CircuitId, number> = { A: 0, B: 0, C: 0 };
  for (const a of APPLIANCES) {
    const st = appliances[a.id];
    if (!st.on) continue;
    if (circuits[a.circuit].tripped) continue;
    perCircuit[a.circuit] += a.power;
  }
  // Short-circuit scenario: force circuit C to an extreme draw (illustrative)
  if (fault === 'SHORT' && !circuits.C.tripped) {
    perCircuit.C = 6000;
  }
  const total = perCircuit.A + perCircuit.B + perCircuit.C;
  return { perCircuit, total };
}

function statusFor(load: number, anyTripped: boolean): SystemStatus {
  if (anyTripped) return 'TRIPPED';
  if (load > MAIN_BREAKER_W * 0.8) return 'WARNING';
  if (load > 0) return 'NORMAL';
  return 'READY';
}

export interface SimulationApi extends SimulationState {
  toggleAppliance: (id: string) => void;
  setRunning: (v: boolean) => void;
  reset: () => void;
  setFault: (f: FaultScenario) => void;
  clearTrip: (c: CircuitId) => void;
  perCircuit: Record<CircuitId, number>;
  circuitCurrent: Record<CircuitId, number>;
  simulateOverload: () => void;
}

export function useSimulation(): SimulationApi {
  const [appliances, setAppliances] = useState<Record<string, ApplianceState>>(initialAppliances);
  const [circuits, setCircuits] = useState<Record<CircuitId, CircuitState>>(initialCircuits);
  const [running, setRunning] = useState(true);
  const [fault, setFault] = useState<FaultScenario>('NORMAL');
  const [energyUsed, setEnergyUsed] = useState(0);
  const [lastTrip, setLastTrip] = useState<{ circuit: CircuitId; reason: string } | null>(null);
  const [waveform, setWaveform] = useState<number[]>(() => new Array(80).fill(0));
  const waveRef = useRef<number[]>(new Array(80).fill(0));

  const { perCircuit, total } = useMemo(
    () => computePower(appliances, circuits, fault),
    [appliances, circuits, fault]
  );

  const totalCurrent = total / NOMINAL_VOLTAGE;
  const loadPercent = Math.min(100, (total / MAIN_BREAKER_W) * 100);
  const activeLoads = APPLIANCES.filter((a) => appliances[a.id].on && !circuits[a.circuit].tripped).length;
  const anyTripped = circuits.A.tripped || circuits.B.tripped || circuits.C.tripped;
  const status = statusFor(total, anyTripped);

  const circuitCurrent: Record<CircuitId, number> = {
    A: perCircuit.A / NOMINAL_VOLTAGE,
    B: perCircuit.B / NOMINAL_VOLTAGE,
    C: perCircuit.C / NOMINAL_VOLTAGE,
  };

  // Voltage sags slightly under heavy load (illustrative)
  const voltage = NOMINAL_VOLTAGE - (loadPercent / 100) * 6;

  // Trip detection: any circuit exceeding its breaker, or main exceeding its breaker.
  useEffect(() => {
    if (!running) return;
    const tripCircuit = (id: CircuitId, reason: string) => {
      setCircuits((prev) => {
        if (prev[id].tripped) return prev;
        setLastTrip({ circuit: id, reason });
        return { ...prev, [id]: { ...prev[id], tripped: true } };
      });
    };
    (['A', 'B', 'C'] as CircuitId[]).forEach((id) => {
      if (perCircuit[id] > CIRCUIT_BREAKER_W[id] && !circuits[id].tripped) {
        tripCircuit(id, perCircuit[id] > 4000 ? 'Short-circuit detected' : 'Overload detected');
      }
    });
    if (total > MAIN_BREAKER_W && !circuits.A.tripped && !circuits.B.tripped && !circuits.C.tripped) {
      // trip the heaviest circuit
      const heaviest = (['A', 'B', 'C'] as CircuitId[]).reduce((a, b) =>
        perCircuit[a] >= perCircuit[b] ? a : b
      );
      tripCircuit(heaviest, 'Main breaker overload');
    }
  }, [perCircuit, circuits, total, running]);

  // Energy accumulation + waveform
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setEnergyUsed((e) => e + (total / 3600) * (TICK_MS / 1000));
      // waveform sample: amplitude based on current with a little noise
      const amp = totalCurrent * 0.04;
      const t = Date.now() / 1000;
      const sample = amp * Math.sin(t * 8) + amp * 0.3 * Math.sin(t * 19);
      waveRef.current = [...waveRef.current.slice(1), sample];
      setWaveform([...waveRef.current]);
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [running, total, totalCurrent]);

  const toggleAppliance = useCallback((id: string) => {
    setAppliances((prev) => ({ ...prev, [id]: { id, on: !prev[id].on } }));
  }, []);

  const reset = useCallback(() => {
    setAppliances(initialAppliances());
    setCircuits(initialCircuits());
    setFault('NORMAL');
    setEnergyUsed(0);
    setLastTrip(null);
    waveRef.current = new Array(80).fill(0);
    setWaveform([...waveRef.current]);
    setRunning(true);
  }, []);

  const clearTrip = useCallback((id: CircuitId) => {
    setCircuits((prev) => ({ ...prev, [id]: { ...prev[id], tripped: false } }));
    setLastTrip(null);
  }, []);

  const simulateOverload = useCallback(() => {
    // Turn on the high-power appliances to force an overload.
    setAppliances((prev) => ({
      ...prev,
      ac: { id: 'ac', on: true },
      heater: { id: 'heater', on: true },
      tv: { id: 'tv', on: true },
      light: { id: 'light', on: true },
    }));
    setFault('OVERLOAD');
  }, []);

  return {
    appliances,
    circuits,
    running,
    fault,
    voltage,
    totalPower: total,
    totalCurrent,
    loadPercent,
    activeLoads,
    energyUsed,
    status,
    lastTrip,
    waveform,
    perCircuit,
    circuitCurrent,
    toggleAppliance,
    setRunning,
    reset,
    setFault,
    clearTrip,
    simulateOverload,
  };
}
