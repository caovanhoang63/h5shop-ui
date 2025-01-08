import React from "react";
import { cn } from "@/lib/utils.ts";

const NoSpinnerFloatInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, onChange, ...props }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent invalid keys: '-' and 'e'
    if (e.key === "-" || e.key === "e") {
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow valid float input, including partial inputs like "." or "0."
    if (/^\d*\.?\d*$/.test(value)) {
      if (onChange) {
        onChange(e); // Call the original onChange handler if provided
      }
    }
  };

  return (
    <input
      type="text"
      className={cn(
        "flex h-9 w-full rounded-md border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        className,
      )}
      ref={ref}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      {...props}
    />
  );
});

NoSpinnerFloatInput.displayName = "NoSpinnerFloatInput";

export { NoSpinnerFloatInput };
