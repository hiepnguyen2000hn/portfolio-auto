import React from 'react';
import Link from 'next/link';
import { ArrowDown, Send, FileText, Sparkles, Terminal } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroCanvas } from '@/components/three/HeroCanvas';
import { profile } from '@/data/profile';

/**
 * Hero Section
 *
 * Server Component optimized for high SEO scores and minimal Largest Contentful Paint (LCP).
 * - Immediate server-rendered typography (H1, Subtitle, CTAs)
 * - Two-column responsive layout (Desktop: left text, right 3D canvas; Mobile: layered canvas background)
 * - Interactive CTAs linking to #projects, #contact, and downloadable CV
 */
export function Hero(): React.JSX.Element {
  return (
    <section
      id="hero"
      aria-label="Hero Section"
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-16 sm:py-24 lg:py-28"
    >
      {/* Background ambient lighting gradients */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#6E56CF]/15 to-[#22D3EE]/15 blur-3xl sm:w-[900px]"
        aria-hidden="true"
      />

      <Container className="relative z-10 w-full">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Semantic, SEO & LCP-first typography */}
          <div className="flex flex-col items-start justify-center lg:col-span-7">
            {/* Eyebrow status badge with pulsating green beacon */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Available for new opportunities</span>
            </div>

            {/* Impressive Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.12]">
              Building{' '}
              <span className="bg-gradient-to-r from-[#6E56CF] via-[#9333EA] to-[#22D3EE] bg-clip-text text-transparent">
                Scalable Architecture
              </span>{' '}
              &amp; High-Performance Web Systems
            </h1>

            {/* Subtitle highlighting Senior Full-Stack / Systems Engineer expertise */}
            <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed text-zinc-600 dark:text-zinc-300">
              Senior Full-Stack &amp; Systems Engineer with 8+ years architecting
              resilient distributed backends, low-latency microservices, and fluid,
              accessible web experiences backed by production-grade engineering.
            </p>

            {/* Quick architectural highlights / badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/70 px-2.5 py-1">
                <Terminal className="h-3.5 w-3.5 text-[#6E56CF]" />
                Distributed Systems
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/70 px-2.5 py-1">
                <Sparkles className="h-3.5 w-3.5 text-[#22D3EE]" />
                Next.js 16 &amp; WebGL
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/70 px-2.5 py-1">
                99.99% Reliability
              </span>
            </div>

            {/* Action Buttons: "Xem dự án", "Liên hệ", "Tải CV" */}
            <div className="mt-8 flex w-full flex-wrap items-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="#projects" className="flex items-center justify-center gap-2">
                  <span>Xem dự án</span>
                  <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </Link>
              </Button>

              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                <Link href="#contact" className="flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Liên hệ</span>
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <a
                  href={profile.cvUrl || '/cv.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Tải CV</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column: 3D Canvas on Desktop, background overlay on mobile */}
          <div className="relative flex items-center justify-center lg:col-span-5 h-[380px] sm:h-[450px] lg:h-[540px]">
            {/* Mobile background backdrop: renders subtly without blocking clicks */}
            <div className="absolute inset-0 -z-10 lg:static lg:z-auto lg:h-full lg:w-full opacity-40 lg:opacity-100 pointer-events-none lg:pointer-events-auto">
              <HeroCanvas className="h-full w-full" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
