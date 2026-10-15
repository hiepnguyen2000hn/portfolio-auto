'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useScrollProgress } from '@/lib/hooks/useScrollProgress';

interface SectionTick {
  id: string;
  label: string;
  index: string;
}

const SECTIONS: SectionTick[] = [
  { id: 'hero', label: 'Overview', index: '00' },
  { id: 'about', label: 'About', index: '01' },
  { id: 'skills', label: 'Skills', index: '02' },
  { id: 'experience', label: 'Experience', index: '03' },
  { id: 'projects', label: 'Projects', index: '04' },
  { id: 'recognition', label: 'Recognition', index: '05' },
  { id: 'contact', label: 'Contact', index: '06' },
];

export function ScrollRail() {
  const scrollProgress = useScrollProgress();
  const smoothProgress = useSpring(scrollProgress, {
    damping: 30,
    stiffness: 250,
  });

  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0,
      }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Page scroll progress and section quick-nav"
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-6 select-none"
    >
      {/* Background Rail */}
      <div className="relative w-[2px] h-64 bg-[var(--border)] rounded-full overflow-hidden">
        {/* Progress Fill Indicator */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[var(--primary)] via-[var(--accent)] to-[var(--aurora-1)] origin-top rounded-full"
          style={{ height: '100%', scaleY: smoothProgress }}
        />
      </div>

      {/* Navigation Ticks */}
      <div className="absolute top-0 bottom-0 flex flex-col justify-between items-center -right-[7px]">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              aria-label={`Jump to ${sec.label}`}
              className="group relative flex items-center justify-center p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-full"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                  isActive
                    ? 'bg-[var(--accent)] border-[var(--primary)] shadow-[0_0_8px_var(--glow)] scale-125'
                    : 'bg-[var(--bg-elevated)] border-[var(--border)] group-hover:border-[var(--accent)] group-hover:scale-110'
                }`}
              />

              {/* Tooltip on hover */}
              <span className="absolute right-6 opacity-0 pointer-events-none group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--fg)] shadow-lg shadow-black/40">
                <span className="text-[var(--primary)] mr-1">{sec.index}</span>
                {sec.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default ScrollRail;
