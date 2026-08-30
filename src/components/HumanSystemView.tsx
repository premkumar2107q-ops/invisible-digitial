import { useState } from 'react';
import { ArrowDown, Snowflake, Zap } from 'lucide-react';
import { Section } from './Section';

type View = 'HUMAN' | 'SYSTEM';

export function HumanSystemView() {
  const [view, setView] = useState<View>('HUMAN');

  return (
    <Section
      id="views"
      index="SECTION 07"
      title="Human View vs System View"
      subtitle="The same action looks completely different depending on who is watching. Toggle between what you experience and what the grid experiences."
    >
      {/* toggle */}
      <div className="inline-flex tech-border rounded-full bg-ink-900 p-1 mb-8">
        {(['HUMAN', 'SYSTEM'] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            aria-pressed={view === v}
            className={`px-5 py-2 rounded-full font-mono text-xs font-semibold tracking-techy transition-all ${
              view === v ? 'bg-flux-500 text-white shadow-[0_0_16px_-4px_rgba(59,130,246,0.6)]' : 'text-ink-300 hover:text-ink-100'
            }`}
          >
            {v} VIEW
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Human view */}
        <div className={`panel tech-border rounded-lg p-6 md:p-8 transition-all duration-500 ${view === 'HUMAN' ? 'border-flux-400/40 shadow-[0_0_30px_-12px_rgba(59,130,246,0.5)]' : 'opacity-50'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Snowflake className="h-5 w-5 text-flux-400" />
            <h3 className="font-mono text-sm tracking-techy text-ink-100">HUMAN VIEW</h3>
          </div>
          <div className="flex flex-col gap-4">
            <Step label="YOU TURN ON THE AC" muted />
            <ArrowDown className="h-4 w-4 text-ink-400 mx-auto" />
            <Step label="THE ROOM GETS COOLER" highlight />
            <p className="mt-4 text-sm text-ink-300 leading-relaxed">
              That is all a person sees: a temperature change. Everything else is invisible.
            </p>
          </div>
        </div>

        {/* System view */}
        <div className={`panel tech-border rounded-lg p-6 md:p-8 transition-all duration-500 ${view === 'SYSTEM' ? 'border-flux-400/40 shadow-[0_0_30px_-12px_rgba(59,130,246,0.5)]' : 'opacity-50'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5 text-flux-400" />
            <h3 className="font-mono text-sm tracking-techy text-ink-100">SYSTEM VIEW</h3>
          </div>
          <div className="flex flex-col gap-3">
            {['APPLIANCE ENABLED', 'LOAD INCREASE', 'CURRENT CHANGES', 'POWER DEMAND CHANGES', 'PROTECTION MONITORS SYSTEM'].map((s, i, arr) => (
              <div key={s} className="flex flex-col items-center">
                <Step label={s} highlight={i === arr.length - 1} />
                {i < arr.length - 1 && <ArrowDown className="h-3.5 w-3.5 text-flux-400/60 my-1" />}
              </div>
            ))}
            <p className="mt-4 text-sm text-ink-300 leading-relaxed">
              The grid sees a cascade of electrical events — load, current, power, protection — all invisible to you.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Step({ label, highlight, muted }: { label: string; highlight?: boolean; muted?: boolean }) {
  return (
    <div
      className={`w-full rounded tech-border px-4 py-3 text-center font-mono text-xs tracking-techy transition-colors ${
        highlight
          ? 'bg-flux-500/15 border-flux-400/40 text-flux-300'
          : muted
          ? 'bg-ink-900 text-ink-300'
          : 'bg-ink-900 text-ink-100'
      }`}
    >
      {label}
    </div>
  );
}
