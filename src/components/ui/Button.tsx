import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[#1a1a2e] text-white hover:bg-[#2a2a4e] focus:ring-[#1a1a2e]":
              variant === "primary",
            "bg-[#c9a96e] text-white hover:bg-[#b8934e] focus:ring-[#c9a96e]":
              variant === "secondary",
            "border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white":
              variant === "outline",
            "text-[#1a1a2e] hover:bg-gray-100": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600":
              variant === "danger",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-5 text-sm": size === "md",
            "h-12 px-8 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
