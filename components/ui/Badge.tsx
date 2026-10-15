import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "accent";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-bg-elevated/80 text-fg-muted border-border hover:border-primary/40 hover:text-fg",
    secondary:
      "bg-bg-elevated/60 text-fg-muted border-border/60 hover:border-accent/40 hover:text-fg",
    outline:
      "bg-transparent text-fg-muted border-border/80 hover:border-primary/50 hover:text-fg",
    accent:
      "bg-primary/10 text-primary border-primary/25 hover:bg-primary/15",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border transition-colors select-none",
        variantStyles,
        className
      )}
      {...props}
    />
  );
}
