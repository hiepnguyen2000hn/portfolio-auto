import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  index?: string | number;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  gradient?: boolean;
  align?: "left" | "center";
}

export function SectionTitle({
  className,
  index,
  eyebrow,
  title,
  description,
  gradient = false,
  align = "left",
  ...props
}: SectionTitleProps) {
  const isCenter = align === "center";

  // Format readout as "01 / ABOUT" if index is provided
  const formattedEyebrow = React.useMemo(() => {
    if (index !== undefined && eyebrow) {
      const idxStr = typeof index === 'number' ? String(index).padStart(2, '0') : index;
      const cleanEyebrow = eyebrow.replace(/^\d+[\.\/\s]+/, '').trim();
      return `${idxStr} / ${cleanEyebrow.toUpperCase()}`;
    }
    return eyebrow;
  }, [index, eyebrow]);

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isCenter ? "items-center text-center mx-auto max-w-3xl" : "items-start text-left",
        className
      )}
      {...props}
    >
      {formattedEyebrow && (
        <div className="inline-flex items-center gap-2">
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[var(--primary)] uppercase tabular-nums">
            {formattedEyebrow}
          </span>
          <span className="h-px w-6 bg-[var(--primary)]/30" />
        </div>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-[1.15]",
          gradient
            ? "bg-gradient-to-r from-[var(--fg)] via-[var(--fg)]/90 to-[var(--primary)] bg-clip-text text-transparent"
            : "text-[var(--fg)]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-[var(--fg-muted)] max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
