import * as React from "react";

import { cn } from "@/lib/utils.ts";

const NoSpinnerNumberInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      type="number"
      className={cn(
        "flex h-9 w-full rounded-md border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
NoSpinnerNumberInput.displayName = "Input";

export { NoSpinnerNumberInput };
