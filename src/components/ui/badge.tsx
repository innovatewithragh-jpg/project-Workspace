import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        outline: "text-foreground border-border bg-background/50",
        planning: "border-transparent bg-status-planning/15 text-status-planning font-semibold",
        active: "border-transparent bg-status-active/15 text-status-active font-semibold",
        paused: "border-transparent bg-status-paused/15 text-status-paused font-semibold",
        done: "border-transparent bg-status-done/15 text-status-done font-semibold",
        success: "border-transparent bg-success/15 text-success font-semibold",
        warning: "border-transparent bg-warning/15 text-warning font-semibold",
        info: "border-transparent bg-info/15 text-info font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
