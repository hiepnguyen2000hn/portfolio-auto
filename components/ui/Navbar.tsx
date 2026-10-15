"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Monitor scroll offset to toggle transparent vs glass navbar
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver to highlight current active section
  React.useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const sectionIds = ["about", "skills", "experience", "projects", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: 0,
      }
    );

    // Initial check and periodic check if DOM sections are loaded dynamically
    const observeElements = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };

    observeElements();
    const timeout = setTimeout(observeElements, 500);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  // Close mobile menu on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Handle smooth scroll when clicking links
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setActiveSection(targetId);
      } else if (typeof window !== "undefined") {
        window.history.pushState(null, "", href);
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-[var(--bg)]/90 dark:bg-[var(--bg)]/92 backdrop-blur-xl border-b border-[var(--border)] shadow-md shadow-black/5 py-3"
          : "bg-[var(--bg)]/75 dark:bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)]/40 py-4"
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo / Initials */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary font-mono text-sm font-bold tracking-tight transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-fg group-hover:shadow-[0_0_15px_var(--glow)]">
              SD
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm sm:text-base tracking-tight text-fg group-hover:text-primary transition-colors">
                Portfolio<span className="text-accent">.</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-bg-elevated/40 backdrop-blur-md"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={cn(
                    "relative px-3.5 py-1.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "text-primary font-semibold bg-primary/10 shadow-sm"
                      : "text-fg-muted hover:text-fg hover:bg-bg-elevated/60"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions: ThemeToggle + Download CV */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button asChild size="sm" variant="primary">
              <a href="/cv.pdf" download="CV.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="h-3.5 w-3.5" />
                <span>Tải CV</span>
              </a>
            </Button>
          </div>

          {/* Mobile Right Bar: ThemeToggle + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-elevated/70 text-fg-muted hover:text-fg hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Dropdown */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          mobileMenuOpen
            ? "max-h-96 opacity-100 border-b border-border mt-3"
            : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <div className="glass px-4 py-5 shadow-xl">
          <Container>
            <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-fg-muted hover:text-fg hover:bg-bg-elevated/60"
                    )}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </a>
                );
              })}

              <div className="pt-3 mt-2 border-t border-border/60">
                <Button asChild size="md" variant="primary" className="w-full">
                  <a
                    href="/cv.pdf"
                    download="CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Download className="h-4 w-4" />
                    <span>Tải CV</span>
                  </a>
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      </div>
    </header>
  );
}
