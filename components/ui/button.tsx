import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover-glow-primary shadow-premium",
                secondary:
                    "bg-secondary text-secondary-foreground hover-glow-secondary shadow-premium",
                accent:
                    "bg-accent text-accent-foreground hover-glow-accent shadow-premium",
                outline:
                    "border-2 border-primary text-primary hover:bg-primary/10 hover-glow-primary",
                ghost:
                    "hover:bg-white/5 hover:text-primary",
                gradient:
                    "bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-premium-lg animate-gradient",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-premium",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 px-4 text-xs",
                lg: "h-14 px-8 text-base",
                xl: "h-16 px-10 text-lg",
                icon: "h-11 w-11",
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
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
