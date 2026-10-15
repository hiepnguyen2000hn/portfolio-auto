'use client';

import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/motion/Reveal';
import { achievements } from '@/data/achievements';
import { testimonials } from '@/data/testimonials';
import { Award, Mic, GitPullRequest, Trophy, Quote } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  award: Award,
  mic: Mic,
  'git-pull-request': GitPullRequest,
  trophy: Trophy,
};

export function Achievements() {
  return (
    <section id="recognition" className="py-24 relative overflow-hidden">
      <Container>
        {/* Achievements Section */}
        <Reveal>
          <SectionTitle
            index="05"
            eyebrow="RECOGNITION"
            title="Thành tích & Chứng nhận chuyên môn"
            description="Những dấu mốc ghi nhận sự cống hiến kỹ thuật và đóng góp cho cộng đồng công nghệ."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, idx) => {
            const IconComponent = (item.icon && iconMap[item.icon]) || Award;
            return (
              <Reveal key={item.title} variant="fadeUp" delay={idx * 0.08}>
                <Card interactive className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--accent)] flex items-center justify-center border border-[var(--primary)]/20">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[var(--accent)]">
                        {item.year}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-[var(--fg)] mb-2">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="mt-24">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
                Social Proof
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--fg)]">
                Nhận xét từ đồng nghiệp & Lãnh đạo
              </h3>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <Reveal key={t.name} variant="scaleIn" delay={idx * 0.1}>
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
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Achievements;
