import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { InventoryReportDetails } from "@/types/inventory/inventoryReport.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { formatCurrency } from "@/utils/convert.ts";

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
  interface IStatusMap {
    [key: number]: string;
  }

  const statusMap: IStatusMap = {
    1: "Đã cân bằng kho",
    0: "Đã hủy",
    2: "Chưa cân băng kho",
  };
  const totalStock = () => {
    if (inventoryItem)
      return inventoryItem.items.reduce(
        (total, item) => total + item.amount,
        0,
      );
    return 0;
  };

  const totalPrice = () => {
    if (inventoryItem)
      return inventoryItem.items.reduce(
        (total, item) => total + (item.price || 0) * item.inventoryDif,
        0,
      );
    return 0;
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl max-h-screen flex flex-col">
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
                  <span>
                    {inventoryItem.createdAt &&
                      new Date(inventoryItem.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ngày cân bằng:</span>
                  <span>
                    {inventoryItem.updatedAt &&
                      new Date(inventoryItem.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Trạng thái:</span>
                  <span>{statusMap[inventoryItem.status]}</span>
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
                  {inventoryItem?.items.map((item) => (
                    <TableRow key={item.skuId}>
                      <TableCell className="text-blue-600">
                        {item.skuId}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">
                        {item.oldStock}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.amount}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.inventoryDif}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.price &&
                          formatCurrency(item.inventoryDif * item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="space-y-2 text-right">
              <div>Tổng thực tế: {totalStock()}</div>
              <div>Tổng chênh lệch: {formatCurrency(totalPrice())}</div>
            </div>
          </div>
        </div>
        <DialogFooter className="">
          {/*<Button className="bg-green-500 hover:bg-green-600">
            <Save className="w-4 h-4 mr-2" />
            Lưu
          </Button>*/}
          {/*<Button variant="secondary">
            <FileDown className="w-4 h-4 mr-2" />
            Xuất file
          </Button>*/}
          <Button variant="destructive" onClick={() => onOpenChange(false)}>
            <XCircle className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
