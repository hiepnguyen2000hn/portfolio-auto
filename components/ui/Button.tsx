import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const variantStyles = {
      primary:
        "bg-primary text-primary-fg hover:brightness-110 hover:shadow-[0_0_20px_var(--glow)] active:scale-[0.98]",
      secondary:
        "bg-bg-elevated text-fg border border-border hover:border-primary/50 hover:shadow-[0_0_15px_var(--glow)] active:scale-[0.98]",
      ghost:
        "text-fg hover:bg-bg-elevated hover:text-primary active:scale-[0.98]",
      outline:
        "border border-border text-fg hover:border-primary hover:text-primary hover:shadow-[0_0_15px_var(--glow)] active:scale-[0.98]",
    }[variant];

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
      md: "h-10 px-4 text-sm gap-2 rounded-lg",
      lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
    }[size];

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg select-none",
          variantStyles,
          sizeStyles,
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
