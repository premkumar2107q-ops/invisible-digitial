import { useEffect, useRef, useState, type ReactNode } from 'react';

interface SectionProps {
  id?: string;
  index: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, index, title, subtitle, children, className = '' }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative py-20 md:py-28 px-5 md:px-8 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`reveal ${visible ? 'is-visible' : ''} mb-10 md:mb-14`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs tracking-techy text-flux-400">{index}</span>
            <span className="h-px w-12 bg-flux-400/40" />
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold text-ink-50 leading-tight">{title}</h2>
          {subtitle && <p className="mt-3 text-ink-200 text-sm md:text-base max-w-2xl">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
