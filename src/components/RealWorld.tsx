import { useState } from 'react';
import { Car, Factory, HeartPulse, Lightbulb, Server, Smartphone, Wind, type LucideIcon } from 'lucide-react';
import { Section } from './Section';
import { REAL_WORLD } from '@/sim/config';

const ICONS: Record<string, LucideIcon> = {
  Smartphone,
  Lightbulb,
  Wind,
  Car,
  Factory,
  HeartPulse,
  Server,
};

export function RealWorld() {
  const [open, setOpen] = useState<string | null>('phone');

  return (
    <Section
      id="real-world"
      index="SECTION 09"
      title="Real World"
      subtitle="Electricity is everywhere, but you only ever see its effects. Tap a card to compare what you see with what is invisibly happening."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {REAL_WORLD.map((card) => {
          const Icon = ICONS[card.icon] ?? Lightbulb;
          const isOpen = open === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setOpen(isOpen ? null : card.id)}
              aria-expanded={isOpen}
              className={`panel tech-border rounded-lg p-5 text-left transition-all duration-300 ${
                isOpen ? 'border-flux-400/40 shadow-[0_0_24px_-10px_rgba(59,130,246,0.5)]' : 'hover:border-ink-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded tech-border bg-ink-900 text-flux-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-ink-50 text-sm">{card.title}</h3>
              </div>

              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-3 pt-1">
                  <div className="rounded tech-border bg-ink-900 p-3">
                    <div className="font-mono text-[9px] tracking-techy text-flux-400 mb-1">WHAT YOU SEE</div>
                    <p className="text-sm text-ink-100 leading-relaxed">{card.youSee}</p>
                  </div>
                  <div className="rounded tech-border bg-ink-900 p-3">
                    <div className="font-mono text-[9px] tracking-techy text-warn-400 mb-1">WHAT IS HAPPENING INVISIBLY</div>
                    <p className="text-sm text-ink-100 leading-relaxed">{card.invisible}</p>
                  </div>
                </div>
              </div>

              {!isOpen && (
                <p className="font-mono text-[10px] tracking-techy text-ink-400 mt-1">TAP TO REVEAL</p>
              )}
            </button>
          );
        })}
      </div>
    </Section>
  );
}
