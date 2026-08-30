import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { GridDiagram } from '@/components/GridDiagram';
import { AppliancePanel } from '@/components/AppliancePanel';
import { InstrumentPanel } from '@/components/InstrumentPanel';
import { OverloadTest } from '@/components/OverloadTest';
import { FaultLab } from '@/components/FaultLab';
import { HumanSystemView } from '@/components/HumanSystemView';
import { InvisibleVisible } from '@/components/InvisibleVisible';
import { RealWorld } from '@/components/RealWorld';
import { FinalExperience } from '@/components/FinalExperience';
import { useSimulation } from '@/sim/useSimulation';

function App() {
  const sim = useSimulation();
  const [entered, setEntered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const handleEnter = () => {
    setEntered(true);
    // smooth scroll to grid after transition
    setTimeout(() => {
      document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleReduceMotion = () => {
    setReduceMotion((v) => {
      const next = !v;
      if (next) document.documentElement.classList.add('reduce-motion');
      else document.documentElement.classList.remove('reduce-motion');
      return next;
    });
  };

  // respect prefers-reduced-motion on mount
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      toggleReduceMotion();
    }
  }, []);

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      <Header
        status={sim.status}
        running={sim.running}
        reduceMotion={reduceMotion}
        onToggleRun={() => sim.setRunning(!sim.running)}
        onReset={sim.reset}
        onToggleReduceMotion={toggleReduceMotion}
        onEnter={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        entered={entered}
      />

      {!entered ? (
        <Hero onEnter={handleEnter} />
      ) : (
        <main className="pt-14">
          <GridDiagram sim={sim} />
          <Divider />
          <AppliancePanel sim={sim} />
          <Divider />
          <InstrumentPanel sim={sim} />
          <Divider />
          <OverloadTest sim={sim} />
          <Divider />
          <FaultLab sim={sim} />
          <Divider />
          <HumanSystemView />
          <Divider />
          <InvisibleVisible />
          <Divider />
          <RealWorld />
          <Divider />
          <FinalExperience />
          <Footer />
        </main>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8">
      <div className="h-px bg-gradient-to-r from-transparent via-ink-700/60 to-transparent" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink-800/60 py-10 px-5 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-mono text-xs tracking-techy text-ink-400">
          GRID<span className="text-flux-400">//</span>FLOW · INTERACTIVE ELECTRICAL SIMULATION
        </div>
        <div className="font-mono text-[10px] tracking-techy text-ink-500 text-center md:text-right">
          SIMPLIFIED EDUCATIONAL VISUALIZATION · ALL VALUES SIMULATED / ILLUSTRATIVE
          <br />
          NOT A REAL ELECTRICAL MEASUREMENT INSTRUMENT
        </div>
      </div>
    </footer>
  );
}

export default App;
