'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Tilt } from '@/components/motion/Tilt';
import { Project } from '@/types/content';
import { ArrowUpRight, Globe } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

interface FeaturedProjectsProps {
  projects: Project[];
  showHeader?: boolean;
}

export function FeaturedProjects({ projects, showHeader = true }: FeaturedProjectsProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-[var(--bg-elevated)]/20">
      <Container>
        {showHeader && (
          <Reveal variant="blurIn">
            <SectionTitle
              index="04"
              eyebrow="PROJECTS"
              title="Dự án tiêu biểu & Kết quả thực tiễn"
              description="Các dự án kỹ thuật quy mô cao, tập trung giải quyết độ trễ, lưu lượng lớn và trải nghiệm tương tác trực quan."
            />
          </Reveal>
        )}

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const isLead = index === 0;

            return (
              <div
                key={project.slug}
                className={`${isLead ? 'lg:col-span-2' : 'lg:col-span-1'}`}
              >
                <Reveal variant="fadeUp" delay={index * 0.1}>
                  <Tilt specular maxTilt={4}>
                    <Card interactive className="group overflow-hidden flex flex-col h-full border-[var(--border)]">
                      <div className={`grid grid-cols-1 ${isLead ? 'lg:grid-cols-12' : ''} gap-6`}>
                        {/* Ảnh bìa với parallax & layoutId */}
                        <div className={`${isLead ? 'lg:col-span-7' : 'w-full'} relative aspect-[16/9] overflow-hidden rounded-xl bg-[var(--bg-elevated)]`}>
                          <motion.div
                            layoutId={`project-img-${project.slug}`}
                            className="relative w-full h-full"
                          >
                            <Image
                              src={project.coverImage}
                              alt={project.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 60vw"
                              className={`object-cover transition-transform duration-700 ${
                                prefersReducedMotion ? '' : 'group-hover:scale-110 group-hover:translate-y-[-2%]'
                              }`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                          </motion.div>

                          {/* Hover case study badge */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <span className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--bg-elevated)]/90 border border-[var(--primary)]/40 text-[var(--accent)] backdrop-blur-md shadow-lg shadow-black/40">
                              View case study ↗
                            </span>
                          </div>
                        </div>

                        {/* Nội dung dự án */}
                        <div className={`${isLead ? 'lg:col-span-5' : 'w-full'} p-6 flex flex-col justify-between`}>
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)]">
                                {project.role} • {project.period}
                              </span>
                              <div className="flex items-center gap-2">
                                {project.repoUrl && (
                                  <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                                    aria-label="Source code repository"
                                  >
                                    <GithubIcon className="w-4 h-4" />
                                  </a>
                                )}
                                {project.liveUrl && (
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                                    aria-label="Live preview"
                                  >
                                    <Globe className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            </div>

                            <motion.h3
                              layoutId={`project-title-${project.slug}`}
                              className="mt-2 text-xl sm:text-2xl font-bold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors"
                            >
                              <Link href={`/projects/${project.slug}`} className="focus-visible:outline-none focus-visible:underline">
                                {project.title}
                              </Link>
                            </motion.h3>

                            <p className="mt-3 text-sm text-[var(--fg-muted)] leading-relaxed line-clamp-3">
                              {project.summary}
                            </p>

                            {/* Key Metrics */}
                            {project.metrics && project.metrics.length > 0 && (
                              <div className="mt-5 grid grid-cols-2 gap-3 py-3 border-y border-[var(--border)]/60">
                                {project.metrics.slice(0, 2).map((m, mIdx) => (
                                  <div key={mIdx}>
                                    <div className="text-lg font-bold font-mono text-[var(--primary)] tabular-nums">
                                      {m.value}
                                    </div>
                                    <div className="text-xs text-[var(--fg-muted)]">{m.label}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="mt-6 pt-2">
                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {project.stack.slice(0, 5).map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>

                            <Button asChild variant="outline" size="sm" className="w-full justify-between group/btn">
                              <Link href={`/projects/${project.slug}`}>
                                <span>Đọc case study kỹ thuật</span>
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Tilt>
                </Reveal>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProjects;
