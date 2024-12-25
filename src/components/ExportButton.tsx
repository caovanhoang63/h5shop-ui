import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button.tsx";
import { FileOutputIcon } from "lucide-react";
interface ExportButtonProps {
  data: unknown[];
}

export const ExportButton = ({ data }: ExportButtonProps) => {
  const exportToExcel = (fileName: string = "export.xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Button
      className={"bg-green-500"}
      onClick={() => exportToExcel("Providers.xlsx")}
    >
      <FileOutputIcon />
      Xuất file
    </Button>
  );
};
