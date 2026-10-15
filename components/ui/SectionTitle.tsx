import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  gradient?: boolean;
  align?: "left" | "center";
}

export function SectionTitle({
  className,
  eyebrow,
  title,
  description,
  gradient = false,
  align = "left",
  ...props
}: SectionTitleProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isCenter ? "items-center text-center mx-auto max-w-3xl" : "items-start text-left",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-primary uppercase">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-[1.15]",
          gradient
            ? "bg-gradient-to-r from-fg via-fg/90 to-primary bg-clip-text text-transparent"
            : "text-fg"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-fg-muted max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
