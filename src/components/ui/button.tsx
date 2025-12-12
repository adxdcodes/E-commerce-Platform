import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 glow-subtle hover:shadow-[0_0_25px_hsl(var(--glow-blue)/0.5)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent hover:bg-muted hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          "bg-[hsl(var(--glass-bg)/0.6)] backdrop-blur-xl border border-[hsl(var(--glass-border)/0.3)] hover:bg-[hsl(var(--glass-bg)/0.8)] hover:border-primary/50",
        glow:
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_0_20px_hsl(var(--glow-blue)/0.4)] hover:shadow-[0_0_30px_hsl(var(--glow-blue)/0.6),0_0_50px_hsl(var(--glow-blue)/0.3)] hover:opacity-90",
        hero:
          "bg-primary text-primary-foreground font-semibold tracking-wide shadow-[0_0_20px_hsl(var(--glow-blue)/0.4)] hover:shadow-[0_0_30px_hsl(var(--glow-purple)/0.5)] transition-all duration-500",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
