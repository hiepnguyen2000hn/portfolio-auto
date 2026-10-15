"use client";

import * as React from "react";
import { ArrowUp, Mail } from "lucide-react";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

// Clean inline SVGs for social media platforms to avoid third-party icon bundle issues
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: GithubIcon,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: LinkedinIcon,
  },
  {
    name: "X (Twitter)",
    href: "https://x.com",
    icon: TwitterIcon,
  },
  {
    name: "Email",
    href: "mailto:contact@example.com",
    icon: Mail,
  },
];

const emptySubscribe = () => () => {};

export function Footer() {
  const currentYear = React.useSyncExternalStore(
    emptySubscribe,
    () => new Date().getFullYear(),
    () => 2026
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full border-t border-border/80 bg-bg/50 backdrop-blur-sm py-12 transition-colors">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold">
                SD
              </span>
              <span className="font-semibold text-fg tracking-tight">
                Senior Developer
              </span>
            </div>
            <p className="text-xs sm:text-sm text-fg-muted max-w-sm">
              Crafting high-performance web experiences & interactive 3D
              interfaces.
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-elevated/60 text-fg-muted transition-all duration-200",
                    "hover:text-fg hover:border-primary/40 hover:bg-bg-elevated hover:shadow-[0_0_12px_var(--glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  )}
                  aria-label={item.name}
                  title={item.name}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          {/* Back to top button */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={scrollToTop}
              className={cn(
                "group inline-flex items-center gap-2 rounded-lg border border-border bg-bg-elevated/60 px-3.5 py-2 text-xs font-medium text-fg-muted transition-all duration-200 cursor-pointer",
                "hover:border-primary/40 hover:text-fg hover:bg-bg-elevated hover:shadow-[0_0_12px_var(--glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
              )}
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Bottom copyright & credits */}
        <div className="mt-8 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fg-muted">
          <p>© {currentYear} Senior Developer. All rights reserved.</p>
          <p className="font-mono text-xs">
            Built with{" "}
            <span className="text-primary font-semibold">Next.js</span> &{" "}
            <span className="text-accent font-semibold">Three.js</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
