'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/motion/Reveal';
import { skills, getSkillsByCategory } from '@/data/skills';
import { SkillCategory } from '@/types/content';
import { Code, Server, Cloud, Database, Compass } from 'lucide-react';
import { dur, ease, stagger } from '@/lib/motion';

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
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[var(--bg-elevated)]/30">
      <Container>
        <Reveal variant="blurIn">
          <SectionTitle
            index="02"
            eyebrow="SKILLS"
            title="Công nghệ & Năng lực kỹ thuật chuyên sâu"
            description="Kinh nghiệm thực chiến qua nhiều tầng kiến trúc, từ microservices hiệu năng cao đến giao diện tương tác hiện đại."
          />
        </Reveal>

        {/* Marquee Ticker with pause on hover */}
        <div className="mt-8 mb-12 py-3 border-y border-[var(--border)] overflow-hidden relative group">
          <div
            className={`flex gap-8 whitespace-nowrap ${
              prefersReducedMotion ? '' : 'animate-marquee group-hover:[animation-play-state:paused]'
            }`}
          >
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

        {/* Category Tabs with layoutId active pill sliding */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] text-[var(--fg)]"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSkillTab"
                    className="absolute inset-0 rounded-xl bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/25 -z-10"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--primary)]/40 -z-20 transition-colors" />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--accent)]'}`} />
                <span className={isActive ? 'text-white font-semibold' : 'text-[var(--fg-muted)]'}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid cross-fading with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: dur.fast, ease: ease.out }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {currentSkills.map((skill, index) => (
              <Card key={skill.name} interactive className="p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-base text-[var(--fg)]">{skill.name}</h4>
                  <Badge variant="outline" className="text-xs font-mono tabular-nums">
                    Lv.{skill.level}
                  </Badge>
                </div>

                {/* Level Bars filling from 0 with stagger and shimmer */}
                <div className="mt-4 flex items-center gap-1.5 overflow-hidden">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isFilled = lvl <= skill.level;
                    return (
                      <div
                        key={lvl}
                        className="relative h-2 flex-1 rounded-full bg-[var(--border)]/60 overflow-hidden"
                      >
                        {isFilled && (
                          <motion.div
                            initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: dur.normal,
                              delay: prefersReducedMotion ? 0 : index * stagger.fast + lvl * 0.04,
                              ease: ease.out,
                            }}
                            className="absolute inset-0 origin-left bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

export default Skills;
