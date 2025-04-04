import React from "react";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import { type ButtonProps as ShadcnButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ButtonCustomProps extends ShadcnButtonProps {
  subtle?: boolean;
  glass?: boolean;
  gradient?: boolean;
  neomorphic?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonCustomProps>(
  ({ className, variant, size, subtle, glass, gradient, neomorphic, loading, children, icon, ...props }, ref) => {
    // Determine which variant styles to apply
    let variantClass = '';
    
    if (glass) {
      variantClass = 'bg-white/80 backdrop-blur-md border border-white/20 text-gray-800 dark:bg-gray-900/80 dark:text-white dark:border-gray-700/20 hover:bg-white/90 dark:hover:bg-gray-900/90';
    } else if (gradient) {
      variantClass = 'bg-gradient-to-r from-blue-600 to-sky-400 hover:from-blue-700 hover:to-sky-500 text-white border-0 animate-pulse-glow';
    } else if (subtle) {
      variantClass = 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200';
    } else if (neomorphic) {
      variantClass = 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-[5px_5px_10px_rgba(0,0,0,0.05),-5px_-5px_10px_rgba(255,255,255,0.8)] dark:shadow-[5px_5px_10px_rgba(0,0,0,0.2),-5px_-5px_10px_rgba(255,255,255,0.05)] text-gray-700 dark:text-gray-200 hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.05),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] dark:hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.2),inset_-5px_-5px_10px_rgba(255,255,255,0.05)]';
    }

    return (
      <ShadcnButton
        ref={ref}
        className={cn(
          // Base styles
          "relative overflow-hidden transition-all duration-300 ease-out font-medium",
          // Adding polish with subtle shadow and improved hover state
          "shadow-sm hover:shadow-md active:shadow-inner",
          // Make buttons feel more responsive
          "active:scale-[0.98]",
          // If it's a custom variant, override the variant
          variantClass,
          // Pass through the original className for customization
          className
        )}
        variant={glass || gradient || subtle || neomorphic ? "outline" : variant}
        size={size}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </span>
        )}
      </ShadcnButton>
    );
  }
);

ButtonCustom.displayName = "ButtonCustom";

export { ButtonCustom };
