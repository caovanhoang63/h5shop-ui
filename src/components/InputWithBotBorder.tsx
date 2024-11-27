import { Input } from "@/components/ui/input.tsx";

interface InputWithBotBorder {
  value?: string | string[];
}

export default function InputWithBotBorder({ value }: InputWithBotBorder) {
  return <Input value={value}></Input>;
}
