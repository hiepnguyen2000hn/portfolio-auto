'use client';

import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/motion/Reveal';
import { profile } from '@/data/profile';
import { Award, Code2, Users2, ShieldCheck } from 'lucide-react';

const stats = [
  {
    icon: Award,
    value: `${profile.yearsOfExperience}+`,
    label: 'Năm kinh nghiệm',
    detail: 'Hệ thống phân tán & Web quy mô lớn',
  },
  {
    icon: Code2,
    value: '24+',
    label: 'Production Systems',
    detail: 'Xây dựng & vận hành trên AWS/GCP',
  },
  {
    icon: Users2,
    value: '15+',
    label: 'Engineers Mentored',
    detail: 'Thúc đẩy chuẩn mực engineering',
  },
  {
    icon: ShieldCheck,
    value: '99.99%',
    label: 'Uptime & Reliability',
    detail: 'Zero-downtime migrations',
  },
];

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <Container>
        <Reveal>
          <SectionTitle
            index="01"
            eyebrow="ABOUT"
            title="Đam mê kiến trúc bền vững & trải nghiệm đỉnh cao"
            description="Tập trung vào giải quyết các bài toán kỹ thuật phức tạp với giải pháp thanh lịch, hiệu quả và dễ mở rộng."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cột trái: Thông tin tóm tắt & Stats */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal variant="fadeUp" delay={0.1}>
              <div className="space-y-4 text-base sm:text-lg text-[var(--fg-muted)] leading-relaxed">
                {profile.summary.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Reveal key={stat.label} variant="scaleIn" delay={0.15 + i * 0.08}>
                    <Card interactive className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 text-[var(--accent)] flex items-center justify-center border border-[var(--primary)]/20">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--fg)] tabular-nums">
                          {stat.value}
                        </span>
                      </div>
                      <h4 className="mt-3 font-semibold text-sm text-[var(--fg)]">{stat.label}</h4>
                      <p className="mt-1 text-xs text-[var(--fg-muted)]">{stat.detail}</p>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Cột phải: Avatar Card với viền gradient */}
          <div className="lg:col-span-5 flex justify-center">
            <Reveal variant="scaleIn" delay={0.2} className="relative group">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl p-1 bg-gradient-to-tr from-[var(--primary)] via-[var(--accent)] to-[var(--aurora-2)] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="w-full h-full rounded-[22px] overflow-hidden bg-[var(--bg-elevated)] relative">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    width={320}
                    height={320}
                    priority
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/90 via-transparent to-transparent flex flex-col justify-end p-6">
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)]">
                      {profile.location}
                    </span>
                    <h3 className="text-lg font-bold text-[var(--fg)] mt-1">{profile.name}</h3>
                    <p className="text-xs text-[var(--fg-muted)]">{profile.headline}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default About;
