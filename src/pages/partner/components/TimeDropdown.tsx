import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeOption {
  label: string;
}

interface TimeColumn {
  title: string;
  options: TimeOption[];
}

const timeColumns: TimeColumn[] = [
  {
    title: "Theo ngày",
    options: [{ label: "Hôm nay" }, { label: "Hôm qua" }],
  },
  {
    title: "Theo tuần",
    options: [
      { label: "Tuần này" },
      { label: "Tuần trước" },
      { label: "7 ngày qua" },
    ],
  },
  {
    title: "Theo tháng",
    options: [
      { label: "Tháng này" },
      { label: "Tháng trước" },
      { label: "Tháng này (âm lịch)" },
      { label: "Tháng trước (âm lịch)" },
      { label: "30 ngày qua" },
    ],
  },
  {
    title: "Theo quý",
    options: [{ label: "Quý này" }, { label: "Quý trước" }],
  },
  {
    title: "Theo năm",
    options: [
      { label: "Năm nay" },
      { label: "Năm trước" },
      { label: "Năm nay (âm lịch)" },
      { label: "Năm trước (âm lịch)" },
      { label: "Toàn thời gian" },
    ],
  },
];

interface TimeDropdownProps {
  selectedValue: string;
  onSelect: (value: string) => void;
}

export function TimeDropdown({ selectedValue, onSelect }: TimeDropdownProps) {
  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {timeColumns.map((column, index) => (
        <div key={index} className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">
            {column.title}
          </h3>
          <div className="space-y-1">
            {column.options.map((option) => (
              <button
                key={option.label}
                onClick={() => onSelect(option.label)}
                className={cn(
                  "flex items-center w-full px-2 py-1 text-sm rounded hover:bg-accent hover:text-accent-foreground",
                  selectedValue === option.label &&
                    "bg-accent text-accent-foreground",
                )}
              >
                <span className="flex-1 text-left">{option.label}</span>
                {selectedValue === option.label && (
                  <Check className="h-4 w-4 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
