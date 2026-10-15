'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/motion/Reveal';
import { skills, getSkillsByCategory } from '@/data/skills';
import { SkillCategory } from '@/types/content';
import { Code, Server, Cloud, Database, Compass } from 'lucide-react';

const categories: { key: SkillCategory; label: string; icon: React.ElementType }[] = [
  { key: 'Frontend', label: 'Frontend & 3D', icon: Code },
  { key: 'Backend', label: 'Backend & Systems', icon: Server },
  { key: 'DevOps/Cloud', label: 'Cloud & DevOps', icon: Cloud },
  { key: 'Data', label: 'Data & Storage', icon: Database },
  { key: 'Leadership', label: 'Architecture & Leadership', icon: Compass },
];

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('Frontend');
  const currentSkills = getSkillsByCategory(activeCategory);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[var(--bg-elevated)]/30">
      <Container>
        <Reveal>
          <SectionTitle
            index="02"
            eyebrow="SKILLS"
            title="Công nghệ & Năng lực kỹ thuật chuyên sâu"
            description="Kinh nghiệm thực chiến qua nhiều tầng kiến trúc, từ microservices hiệu năng cao đến giao diện tương tác hiện đại."
          />
        </Reveal>

        {/* Marquee Ticker */}
        <div className="mt-8 mb-12 py-3 border-y border-[var(--border)] overflow-hidden relative">
          <div className="flex gap-8 whitespace-nowrap animate-marquee">
            {[...skills, ...skills].map((skill, idx) => (
              <span
                key={`${skill.name}-${idx}`}
                className="inline-flex items-center gap-2 text-xs font-mono text-[var(--fg-muted)] tracking-wider"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25 scale-[1.02]'
                    : 'bg-[var(--bg-elevated)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--glass-bg)] border border-[var(--border)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSkills.map((skill, index) => (
            <Reveal key={skill.name} variant="fadeUp" delay={index * 0.05}>
              <Card interactive className="p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-base text-[var(--fg)]">{skill.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    Lv.{skill.level}
                  </Badge>
                </div>

                {/* Level Dots */}
                <div className="mt-4 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                        lvl <= skill.level
                          ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]'
                          : 'bg-[var(--border)]/60'
                      }`}
                    />
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Skills;
