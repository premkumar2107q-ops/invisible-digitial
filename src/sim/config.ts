// Static configuration for the GRID//FLOW simulation.
// All electrical values are illustrative — see "SIMULATED / ILLUSTRATIVE" labels in the UI.

export type CircuitId = 'A' | 'B' | 'C';

export interface ApplianceConfig {
  id: string;
  name: string;
  short: string;
  circuit: CircuitId;
  power: number; // Watts (illustrative)
  icon: string; // lucide icon name key
  description: string;
}

// Each circuit has a protective breaker that trips at this load (W).
export const CIRCUIT_BREAKER_W: Record<CircuitId, number> = {
  A: 1800,
  B: 1800,
  C: 1800,
};

export const MAIN_BREAKER_W = 4200;

export const NOMINAL_VOLTAGE = 120; // V (illustrative)

export const APPLIANCES: ApplianceConfig[] = [
  { id: 'light', name: 'Light', short: 'LIGHT', circuit: 'A', power: 60, icon: 'Lightbulb', description: 'A small resistive load — converts electrical energy into light and heat.' },
  { id: 'fan', name: 'Fan', short: 'FAN', circuit: 'A', power: 75, icon: 'Fan', description: 'A motor load — converts electrical energy into mechanical motion.' },
  { id: 'tv', name: 'TV', short: 'TV', circuit: 'B', power: 150, icon: 'Tv', description: 'A mixed electronic load — display, backlight and processing circuitry.' },
  { id: 'laptop', name: 'Laptop', short: 'LAPTOP', circuit: 'B', power: 65, icon: 'Laptop', description: 'A low-power electronic load with its own internal power converter.' },
  { id: 'ac', name: 'Air Conditioner', short: 'AC', circuit: 'C', power: 1200, icon: 'Wind', description: 'A high-power compressor load — the largest single draw on the grid.' },
  { id: 'heater', name: 'Water Heater', short: 'HEATER', circuit: 'C', power: 1500, icon: 'Flame', description: 'A high-power resistive load — converts electrical energy directly into heat.' },
];

export type FaultScenario = 'NORMAL' | 'OVERLOAD' | 'OPEN' | 'SHORT';

export interface FaultInfo {
  id: FaultScenario;
  label: string;
  whatChanged: string;
  detected: string;
  response: string;
  danger: boolean;
}

export const FAULTS: Record<FaultScenario, FaultInfo> = {
  NORMAL: {
    id: 'NORMAL',
    label: 'NORMAL',
    whatChanged: 'All circuits operating within their rated capacity.',
    detected: 'No abnormal condition. Current and voltage remain within nominal range.',
    response: 'No protective action required. System continues to monitor.',
    danger: false,
  },
  OVERLOAD: {
    id: 'OVERLOAD',
    label: 'OVERLOAD',
    whatChanged: 'Total demand on a circuit exceeds its rated capacity.',
    detected: 'Excessive simulated load — sustained current above the breaker rating.',
    response: 'Protection tripped. The overloaded circuit is disconnected to prevent damage.',
    danger: true,
  },
  OPEN: {
    id: 'OPEN',
    label: 'OPEN CIRCUIT',
    whatChanged: 'A break in the conducting path stops current from flowing.',
    detected: 'Current drops to zero on the affected path while voltage remains present.',
    response: 'No protection trip required — an open circuit is not inherently dangerous, but the load stops working.',
    danger: false,
  },
  SHORT: {
    id: 'SHORT',
    label: 'SHORT-CIRCUIT',
    whatChanged: 'A near-zero resistance path bypasses the normal load.',
    detected: 'Current rises rapidly toward an extreme value, far beyond rated capacity.',
    response: 'Protection tripped instantly. The circuit is disconnected before damage can occur.',
    danger: true,
  },
};

export interface RealWorldCard {
  id: string;
  title: string;
  icon: string;
  youSee: string;
  invisible: string;
}

export const REAL_WORLD: RealWorldCard[] = [
  { id: 'phone', title: 'Phone Charging', icon: 'Smartphone', youSee: 'A small indicator appears and the battery percentage climbs.', invisible: 'A power converter draws a small, regulated current to refill a chemical battery.' },
  { id: 'lighting', title: 'Home Lighting', icon: 'Lightbulb', youSee: 'A room fills with light the instant you flip a switch.', invisible: 'Current flows through a resistive or electronic load, converting energy into light and heat.' },
  { id: 'ac', title: 'Air Conditioning', icon: 'Wind', youSee: 'The room slowly becomes cooler and more comfortable.', invisible: 'A compressor draws a large, sustained current to move heat against its natural flow.' },
  { id: 'ev', title: 'Electric Vehicles', icon: 'Car', youSee: 'A vehicle travels quietly with no fuel tank or exhaust.', invisible: 'A high-capacity battery delivers hundreds of amps to an electric motor on demand.' },
  { id: 'factory', title: 'Factories', icon: 'Factory', youSee: 'Machines stamp, lift and assemble without visible effort.', invisible: 'Three-phase power drives large motors whose load shifts with every mechanical action.' },
  { id: 'hospital', title: 'Hospitals', icon: 'HeartPulse', youSee: 'Life-support equipment runs without interruption, even during an outage.', invisible: 'Redundant supplies and backup generators keep critical circuits energized at all times.' },
  { id: 'data', title: 'Data Centers', icon: 'Server', youSee: 'Web pages load instantly from somewhere far away.', invisible: 'Vast arrays of servers draw precisely metered power, with cooling loads as large as the compute itself.' },
];
