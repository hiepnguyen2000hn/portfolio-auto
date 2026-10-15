'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/motion/Reveal';
import { achievements } from '@/data/achievements';
import { testimonials } from '@/data/testimonials';
import { Award, Mic, GitPullRequest, Trophy, Quote } from 'lucide-react';
import { dur, ease, stagger } from '@/lib/motion';

const iconMap: Record<string, React.ElementType> = {
  award: Award,
  mic: Mic,
  'git-pull-request': GitPullRequest,
  trophy: Trophy,
};

export function Achievements() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="recognition" className="py-24 relative overflow-hidden">
      <Container>
        {/* Achievements Section */}
        <Reveal variant="blurIn">
          <SectionTitle
            index="05"
            eyebrow="RECOGNITION"
            title="Thành tích & Chứng nhận chuyên môn"
            description="Những dấu mốc ghi nhận sự cống hiến kỹ thuật và đóng góp cho cộng đồng công nghệ."
          />
        </Reveal>

        {/* Hand-of-cards deal in animation */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, idx) => {
            const IconComponent = (item.icon && iconMap[item.icon]) || Award;
            const dealRotation = -4 + idx * 2.5; // -4deg, -1.5deg, +1deg, +3.5deg

            return (
              <motion.div
                key={item.title}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 30, rotate: dealRotation }
                }
                whileInView={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, rotate: 0 }
                }
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: dur.normal,
                  delay: prefersReducedMotion ? 0 : idx * stagger.normal,
                  ease: ease.out,
                }}
              >
                <Card interactive className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--accent)] flex items-center justify-center border border-[var(--primary)]/20">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[var(--accent)] tabular-nums">
                        {item.year}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-[var(--fg)] mb-2">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials Strip with slow marquee that pauses on hover */}
        <div className="mt-24">
          <Reveal variant="fadeUp">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
                Social Proof
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--fg)]">
                Nhận xét từ đồng nghiệp & Lãnh đạo
              </h3>
            </div>
          </Reveal>

          {/* Marquee Strip container */}
          <div className="relative overflow-hidden group py-4">
            <div
              className={`flex gap-6 whitespace-normal ${
                prefersReducedMotion
                  ? 'grid grid-cols-1 md:grid-cols-3'
                  : 'w-max animate-marquee group-hover:[animation-play-state:paused]'
              }`}
            >
              {(prefersReducedMotion
                ? testimonials
                : [...testimonials, ...testimonials]
              ).map((t, idx) => (
                <div
                  key={`${t.name}-${idx}`}
                  className="w-full md:w-[380px] lg:w-[420px] shrink-0"
                >
                  <Card interactive className="p-6 flex flex-col justify-between h-full relative">
                    <div>
                      <Quote className="w-8 h-8 text-[var(--primary)]/30 mb-3" />
                      <p className="text-sm text-[var(--fg-muted)] italic leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[var(--border)]/60 flex items-center gap-3">
                      {t.avatar && (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[var(--bg-elevated)] shrink-0 border border-[var(--border)]">
                          <Image
                            src={t.avatar}
                            alt={t.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h5 className="font-bold text-sm text-[var(--fg)]">{t.name}</h5>
                        <p className="text-xs text-[var(--fg-muted)]">
                          {t.role} • {t.company}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Achievements;
