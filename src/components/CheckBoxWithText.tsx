import { Checkbox } from "@/components/ui/checkbox.tsx";
import { ReactNode } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";

export function CheckBoxWithText({
  id,
  children,
  checked,
  onCheckChange,
}: {
  children?: ReactNode;
  id?: string;
  checked?: CheckedState;
  onCheckChange?: (checked: CheckedState) => void;
}): JSX.Element {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckChange}
        className={
          "border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:text-white data-[state=checked]:border-green-500"
        }
      />
      <label
        htmlFor={id}
        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {children}
      </label>
    </div>
  );
}
