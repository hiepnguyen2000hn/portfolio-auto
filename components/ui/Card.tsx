import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl glass p-6 transition-all duration-300",
          interactive &&
            "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 cursor-pointer active:translate-y-0",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
