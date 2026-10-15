import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllProjects, getProjectBySlug } from '@/lib/projects';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProjectTitleMorph, ProjectImageMorph } from '@/components/projects/ProjectHeaderMorph';
import { ArrowLeft, Globe, Calendar, Users, Briefcase } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} · Case Study`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [
        {
          url: project.coverImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}

async function ProjectDetailContent({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen pt-28 pb-24">
      <Container>
        {/* Breadcrumb & Back Link */}
        <div className="mb-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách dự án</span>
          </Link>
        </div>

        {/* Header */}
        <header className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs uppercase">
              Case Study
            </Badge>
            <span className="text-xs text-[var(--fg-muted)]">•</span>
            <span className="text-xs font-mono text-[var(--accent)]">{project.period}</span>
          </div>

          <ProjectTitleMorph slug={slug} title={project.title} />

          <p className="mt-4 text-lg sm:text-xl text-[var(--fg-muted)] leading-relaxed">
            {project.summary}
          </p>

          {/* Meta Information Bar */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-6 text-sm text-[var(--fg-muted)]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[var(--accent)]" />
                <span>{project.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--accent)]" />
                <span>{project.period}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--accent)]" />
                <span>Quy mô: {project.teamSize}</span>
              </div>
            </div>

            {/* External Links */}
            <div className="flex items-center gap-3">
              {project.repoUrl && (
                <Button asChild variant="outline" size="sm">
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="w-4 h-4 mr-2" />
                    Source Code
                  </a>
                </Button>
              )}
              {project.liveUrl && (
                <Button asChild variant="primary" size="sm">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" />
                    Live System
                  </a>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Cover Image with shared element morph */}
        <ProjectImageMorph slug={slug} title={project.title} coverImage={project.coverImage} />

        {/* Metrics Row */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[var(--bg-elevated)]/40 border border-[var(--border)]">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--accent)]">
                  {m.value}
                </div>
                <div className="mt-1 text-xs text-[var(--fg-muted)] uppercase tracking-wider">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack Badges */}
        <div className="mt-10">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--fg-muted)] mb-3">
            Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm font-mono">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Markdown Content */}
        {project.content && (
          <div className="mt-12 pt-10 border-t border-[var(--border)] max-w-3xl prose prose-neutral dark:prose-invert">
            <div className="space-y-6 text-base text-[var(--fg)] leading-relaxed whitespace-pre-line">
              {project.content}
            </div>
          </div>
        )}
      </Container>
    </article>
  );
}

export default function ProjectDetailPage(props: Props) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen pt-36 text-center text-[var(--fg-muted)]">
          Đang tải case study...
        </div>
      }
    >
      <ProjectDetailContent {...props} />
    </React.Suspense>
  );
}
