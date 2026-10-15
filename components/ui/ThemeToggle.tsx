"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThemeToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Render placeholder structure to prevent layout shift during SSR/hydration
  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-elevated/60 text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          className
        )}
        aria-label="Toggle theme"
        disabled
        {...props}
      >
        <span className="h-4 w-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-elevated/70 text-fg-muted transition-all duration-200 hover:border-primary/40 hover:text-fg hover:shadow-[0_0_12px_var(--glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-95 cursor-pointer",
        className
      )}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      {...props}
    >
      {/* Sun icon for light mode */}
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-300 ease-in-out text-amber-500",
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
        aria-hidden="true"
      />
      {/* Moon icon for dark mode */}
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300 ease-in-out text-indigo-400 group-hover:text-cyan-400",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        )}
        aria-hidden="true"
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
