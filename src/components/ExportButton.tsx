import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button.tsx";
import { FileOutputIcon } from "lucide-react";
interface ExportButtonProps {
  data: unknown[];
  fileName: string;
}

export const ExportButton = ({ data, fileName }: ExportButtonProps) => {
  function getCurrentTimeFormatted(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}`;
  }
  const exportToExcel = (fileName: string = "export.xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Button
      className={"bg-green-500"}
      onClick={() =>
        exportToExcel(`${fileName}-${getCurrentTimeFormatted()}.xlsx`)
      }
    >
      <FileOutputIcon />
      Xuất file
    </Button>
  );
};
