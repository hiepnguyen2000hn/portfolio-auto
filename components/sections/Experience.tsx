'use client';

import React, { useRef } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/motion/Reveal';
import { experiences } from '@/data/experience';
import { formatRange, durationBetween } from '@/lib/date';
import { useElementScrollProgress } from '@/lib/hooks/useScrollProgress';
import { Briefcase, MapPin, ExternalLink, Calendar } from 'lucide-react';

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Draw-on-scroll timeline bound to section progress
  const rawProgress = useElementScrollProgress(sectionRef, ['start center', 'end center']);
  const lineProgress = useSpring(rawProgress, { damping: 25, stiffness: 200 });

  return (
    <section ref={sectionRef} id="experience" className="py-24 relative overflow-hidden">
      <Container>
        <Reveal variant="blurIn">
          <SectionTitle
            index="03"
            eyebrow="EXPERIENCE"
            title="Hành trình sự nghiệp & Tác động thực tế"
            description="Kinh nghiệm dẫn dắt kỹ thuật và xây dựng sản phẩm bền bỉ qua các giai đoạn tăng trưởng quy mô lớn."
          />
        </Reveal>

        <div className="mt-16 relative">
          {/* Vertical SVG Timeline Rail drawing itself on scroll */}
          <div className="hidden md:block absolute left-8 top-4 bottom-4 w-1 pointer-events-none -translate-x-1/2">
            {/* Background track line */}
            <div className="w-0.5 h-full mx-auto bg-[var(--border)] rounded-full" />

            {/* Dynamic drawing foreground line */}
            <motion.div
              style={{
                scaleY: prefersReducedMotion ? 1 : lineProgress,
                transformOrigin: 'top',
              }}
              className="absolute inset-0 w-0.5 mx-auto bg-gradient-to-b from-[var(--primary)] via-[var(--accent)] to-[var(--aurora-1)] rounded-full shadow-[0_0_8px_var(--glow)]"
            />
          </div>

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const rangeText = formatRange(exp.start, exp.end);
              const durationText = durationBetween(exp.start, exp.end);
              const isEven = index % 2 === 0;

              return (
                <div key={exp.company + index} className="relative md:pl-20">
                  {/* Timeline Dot with spring pop when in view */}
                  <motion.div
                    initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
                    className="hidden md:flex absolute left-[25px] top-6 w-3.5 h-3.5 rounded-full bg-[var(--primary)] border-4 border-[var(--bg)] shadow-md shadow-[var(--primary)]/50 z-10"
                  />

                  {/* Alternating slide-in card on desktop */}
                  <Reveal
                    variant={isEven ? 'slideLeft' : 'fadeUp'}
                    delay={0.1}
                  >
                    <Card interactive className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
                        <div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-[var(--accent)]" />
                            <h3 className="text-xl sm:text-2xl font-bold text-[var(--fg)]">
                              {exp.role}
                            </h3>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-base text-[var(--primary)] font-medium">
                            {exp.companyUrl ? (
                              <a
                                href={exp.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 hover:underline"
                              >
                                {exp.company}
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span>{exp.company}</span>
                            )}
                            <span className="text-[var(--fg-muted)]">•</span>
                            <span className="text-xs sm:text-sm text-[var(--fg-muted)] inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {exp.location}
                            </span>
                          </div>
                        </div>

                        {/* Date Range & Duration */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs font-mono text-[var(--fg-muted)] shrink-0 tabular-nums">
                          <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                          <span>{rangeText}</span>
                          <span className="text-[var(--primary)]">({durationText})</span>
                        </div>
                      </div>

                      {/* Highlights */}
                      <ul className="mt-5 space-y-3">
                        {exp.highlights.map((highlight, hIndex) => (
                          <li
                            key={hIndex}
                            className="flex items-start gap-3 text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Stack Badges */}
                      <div className="mt-6 pt-4 border-t border-[var(--border)]/50 flex flex-wrap gap-2">
                        {exp.stack.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Experience;
