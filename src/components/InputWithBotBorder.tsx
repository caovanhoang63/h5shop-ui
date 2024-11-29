import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

interface InputWithBotBorder {
  value?: string | string[];
  id?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  readonly?: boolean;
}

export default function InputWithBotBorder({
  value,
  placeholder,
  id,
  label,
  className,
  readonly = false,
}: InputWithBotBorder) {
  return (
    <div className={"flex items-center border-b-[1px] border-gray-300"}>
      <Label className={"font-normal w-40 text-gray-600"} htmlFor={id}>
        {label}
      </Label>
      <Input
        readOnly={readonly}
        placeholder={placeholder}
        id={id}
        value={value}
        className={`border-0 focus-visible:ring-0  rounded-none shadow-none ${className}`}
      ></Input>
    </div>
  );
}
