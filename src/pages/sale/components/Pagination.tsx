import { Button } from "@/components/ui/button.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function Pagination({
  page,
  totalPages,
  onNext,
  onPrevious,
}: PaginationProps) {
  return (
    <div className="flex flex-row gap-2">
      <Button
        className="p-1 h-6 w-6 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full shadow-none"
        onClick={onPrevious}
        disabled={page === 1}
      >
        <ChevronLeft />
      </Button>
      <span>
        {page}/{totalPages}
      </span>
      <Button
        className="p-1 h-6 w-6 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full shadow-none"
        onClick={onNext}
        disabled={page === totalPages}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
