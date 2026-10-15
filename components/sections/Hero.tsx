'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown, Send, FileText, Sparkles, Terminal } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroCanvas } from '@/components/three/HeroCanvas';
import { Magnetic } from '@/components/motion/Magnetic';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { TextReveal } from '@/components/motion/TextReveal';
import { profile } from '@/data/profile';

/**
 * Hero Section
 *
 * Arctic Lab Motion & Set-Piece:
 * - Immediate server-rendered semantic content preserved for SEO & LCP
 * - Word-by-word headline reveal with overflow clip
 * - Subtitle & CTA chips with 0.06s ripple stagger
 * - Glass badge with single frost sweep highlight
 * - Magnetic pull on primary action buttons
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
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[var(--primary)]/15 via-[var(--aurora-1)]/10 to-[var(--accent)]/15 blur-3xl sm:w-[900px]"
        aria-hidden="true"
      />

      <Container className="relative z-10 w-full">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Semantic, SEO & LCP-first typography */}
          <div className="flex flex-col items-start justify-center lg:col-span-7">
            {/* Eyebrow status badge with pulsating beacon and frost sweep */}
            <div className="group relative mb-6 inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]/70 px-3.5 py-1.5 text-xs font-mono text-[var(--fg)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--primary)]" />
              </span>
              <span className="text-[var(--fg-muted)]">SYSTEM STATUS //</span>
              <span className="font-semibold text-[var(--fg)]">Available for new opportunities</span>

              {/* Frost sweep shine effect across the badge */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full animate-[pulse_4s_ease-in-out_infinite]"
              />
            </div>

            {/* Impressive Main Headline with word-by-word reveal */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-[var(--fg)] leading-[1.12]">
              <TextReveal
                text="Building Scalable Architecture & High-Performance Web Systems"
                as="span"
                by="words"
              />
            </h1>

            {/* Staggered Subtitle and Action Chips at 0.06s stagger */}
            <Stagger staggerDelay={0.06} className="w-full">
              {/* Subtitle */}
              <StaggerItem>
                <p className="mt-6 max-w-2xl text-base text-[var(--fg-muted)] sm:text-lg lg:text-xl leading-relaxed">
                  Senior Full-Stack &amp; Systems Engineer with 8+ years architecting
                  resilient distributed backends, low-latency microservices, and fluid,
                  accessible web experiences backed by production-grade engineering.
                </p>
              </StaggerItem>

              {/* Quick architectural highlights / badges */}
              <StaggerItem>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[var(--fg-muted)] font-mono">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)]/70 px-2.5 py-1">
                    <Terminal className="h-3.5 w-3.5 text-[var(--primary)]" />
                    Distributed Systems
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)]/70 px-2.5 py-1">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                    Next.js 16 &amp; WebGL
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)]/70 px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--aurora-1)]" />
                    99.99% Reliability
                  </span>
                </div>
              </StaggerItem>

              {/* Action Buttons with Magnetic hover: "Xem dự án", "Liên hệ", "Tải CV" */}
              <StaggerItem>
                <div className="mt-8 flex w-full flex-wrap items-center gap-3 sm:gap-4">
                  <Magnetic>
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <Link href="#projects" className="flex items-center justify-center gap-2">
                        <span>Xem dự án</span>
                        <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                      </Link>
                    </Button>
                  </Magnetic>

                  <Magnetic>
                    <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                      <Link href="#contact" className="flex items-center justify-center gap-2">
                        <Send className="h-4 w-4" />
                        <span>Liên hệ ngay</span>
                      </Link>
                    </Button>
                  </Magnetic>

                  <Magnetic>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                      <a
                        href={profile.cvUrl}
                        download="Alex-Nguyen-Senior-Dev-CV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Tải CV (PDF)</span>
                      </a>
                    </Button>
                  </Magnetic>
                </div>
              </StaggerItem>
            </Stagger>
          </div>

          {/* Right Column: Interactive 3D Canvas */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="relative aspect-square w-full max-w-[460px] sm:max-w-[520px] lg:max-w-none">
              <HeroCanvas />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
