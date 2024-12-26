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
import { Save, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { InventoryReportDetails } from "@/types/inventoryReport.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

interface IStockInDetailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  stockItem?: InventoryReportDetails;
}
export default function StockInDetailModal({
  isOpen,
  onOpenChange,
  stockItem,
}: IStockInDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl max-h-screen flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết phiếu kiểm kho</DialogTitle>
        </DialogHeader>
        <div className="w-full mx-auto space-y-4">
          {stockItem && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Mã kiểm kho:</span>
                  <span>{stockItem.inventoryReportId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Thời gian:</span>
                  <span>
                    {stockItem.createdAt &&
                      new Date(stockItem.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ngày cân bằng:</span>
                  <span>
                    {stockItem.updatedAt &&
                      new Date(stockItem.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Trạng thái:</span>
                  <span>{stockItem.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Người tạo:</span>
                  <span>{stockItem.warehouseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Người cân bằng:</span>
                  <span>{stockItem.warehouseName}</span>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
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
                  {stockItem?.items.map((item) => (
                    <TableRow key={item.skuId}>
                      <TableCell className="text-blue-600">
                        {item.skuId}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">
                        {item.amount}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.amount - item.inventoryDif}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.inventoryDif}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.amount - item.inventoryDif}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="space-y-2 text-right">
              <div>Tổng thực tế: 0</div>
              <div>Tổng chênh lệch: 0</div>
            </div>
          </div>
        </div>
        <DialogFooter className="">
          <Button className="bg-green-500 hover:bg-green-600">
            <Save className="w-4 h-4 mr-2" />
            Lưu
          </Button>
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
