import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, FileDown, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { InventoryReportDetails } from "@/types/inventoryReport.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

interface InventoryItem {
  id: string;
  name: string;
  stockQuantity: number;
  actualQuantity: number;
  variance: number;
  varianceValue: number;
}
interface IInventoryReportDetailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  inventoryItem?: InventoryReportDetails;
}
export default function InventoryReportDetailModal({
  isOpen,
  onOpenChange,
  inventoryItem,
}: IInventoryReportDetailModalProps) {
  const [items] = React.useState<InventoryItem[]>([
    {
      id: "PK000014",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 92,
      actualQuantity: 90,
      variance: -2,
      varianceValue: 0,
    },
    {
      id: "PK000015",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 92,
      actualQuantity: 90,
      variance: -2,
      varianceValue: 0,
    },
    {
      id: "PK000017",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 92,
      actualQuantity: 90,
      variance: -2,
      varianceValue: 0,
    },
    {
      id: "PK0000156",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 92,
      actualQuantity: 90,
      variance: -2,
      varianceValue: 0,
    },
    {
      id: "PK0000164",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 92,
      actualQuantity: 90,
      variance: -2,
      varianceValue: 0,
    },
    {
      id: "PK0000144",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 92,
      actualQuantity: 90,
      variance: -2,
      varianceValue: 0,
    },
    {
      id: "PK00001344",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 92,
      actualQuantity: 90,
      variance: -2,
      varianceValue: 0,
    },
    {
      id: "PK0000134",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 92,
      actualQuantity: 90,
      variance: -2,
      varianceValue: 0,
    },
    {
      id: "PK00001434",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 92,
      actualQuantity: 90,
      variance: -2,
      varianceValue: 0,
    },
    {
      id: "PK000013464",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 92,
      actualQuantity: 90,
      variance: -2,
      varianceValue: 0,
    },
  ]);
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl min-h-[calc(100vh-10%)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết phiếu kiểm kho</DialogTitle>
        </DialogHeader>
        <div className="w-full mx-auto space-y-4">
          {inventoryItem && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Mã kiểm kho:</span>
                  <span>{inventoryItem.inventoryReportId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Thời gian:</span>
                  <span>{inventoryItem.createdAt?.toString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ngày cân bằng:</span>
                  <span>{inventoryItem.updatedAt?.toString()}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Trạng thái:</span>
                  <span>{inventoryItem.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Người tạo:</span>
                  <span>{inventoryItem.warehouseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Người cân bằng:</span>
                  <span>{inventoryItem.warehouseName}</span>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              <Input placeholder="Tìm mã hàng" className="max-w-[200px]" />
              <Input placeholder="Tìm tên hàng" className="max-w-[200px]" />
            </div>
            <ScrollArea className={"h-[300px] px-2"}>
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead>Mã hàng</TableHead>
                    <TableHead>Tên hàng</TableHead>
                    <TableHead className="text-right">Tồn kho</TableHead>
                    <TableHead className="text-right">Thực tế</TableHead>
                    <TableHead className="text-right">SL lệch</TableHead>
                    <TableHead className="text-right">Giá trị lệch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-blue-600">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">
                        {item.stockQuantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.actualQuantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.variance}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.varianceValue}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="space-y-2 text-right">
              <div>Tổng thực tế (90): 0</div>
              <div>Tổng lệch tăng (0): 0</div>
              <div>Tổng lệch giảm (-2): 0</div>
              <div>Tổng chênh lệch (-2): 0</div>
            </div>
          </div>
        </div>
        <DialogFooter className="">
          <Button className="bg-green-500 hover:bg-green-600">
            <Save className="w-4 h-4 mr-2" />
            Lưu
          </Button>
          <Button variant="secondary">
            <FileDown className="w-4 h-4 mr-2" />
            Xuất file
          </Button>
          <Button variant="destructive">
            <XCircle className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
