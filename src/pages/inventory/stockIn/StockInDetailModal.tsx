import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileDown, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { StockInDetails } from "@/types/stockIn/stockIn.ts";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
interface IStockInDetailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  stockItem?: StockInDetails;
}
export default function StockInDetailModal({
  isOpen,
  onOpenChange,
  stockItem,
}: IStockInDetailModalProps) {
  const generateBarcode = (text: string): string => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, text, { format: "CODE128" });
    return canvas.toDataURL("image/png");
  };

  const handlePrint = () => {
    if (!stockItem) return;

    const doc = new jsPDF();
    let yOffset = 10;

    stockItem.items.forEach((item, index) => {
      const barcode = generateBarcode(`${stockItem.id}-${item.skuId}`);
      doc.text(`Lô hàng: ${stockItem.id}`, 10, yOffset);
      doc.text(`Mã hàng: ${item.skuId}`, 10, yOffset + 10);
      doc.text(`Tên hàng: ${item.name}`, 10, yOffset + 20);
      doc.addImage(barcode, "PNG", 10, yOffset + 30, 100, 20);
      yOffset += 60;
      if ((index + 1) % 4 === 0) {
        doc.addPage();
        yOffset = 10;
      }
    });

    doc.save(`StockIn_${stockItem.id}.pdf`);
  };

  interface IStatusMap {
    [key: number]: string;
  }
  const statusMap: IStatusMap = {
    1: "Đã nhập hàng",
    0: "Đã hủy",
    2: "Phiếu tạm",
  };
  const formatCurrency = (amount: number) => {
    const numberPrice = Number(amount);
    return numberPrice.toLocaleString("en-US");
  };

  const totalStock = () => {
    if (stockItem)
      return stockItem.items.reduce((total, item) => total + item.amount, 0);
    return 0;
  };

  const totalPrice = () => {
    if (stockItem)
      return stockItem.items.reduce(
        (total, item) => total + item.price * item.amount,
        0,
      );
    return 0;
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl max-h-screen flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết phiếu nhập hàng</DialogTitle>
        </DialogHeader>
        <div className="w-full mx-auto space-y-4">
          {stockItem && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Mã kiểm kho:</span>
                  <span>{stockItem.id}</span>
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
                  <span>{statusMap[stockItem.status]}</span>
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
            {/*<div className="flex gap-4 mb-4">
              <Input placeholder="Tìm tên hàng" className="max-w-[200px]" />
            </div>*/}
            <ScrollArea className={"h-[300px] px-2"}>
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead>Mã hàng</TableHead>
                    <TableHead>Tên hàng</TableHead>
                    <TableHead className="text-right">Số lượng</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
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
                        {formatCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="space-y-2 text-right">
              <div>Tổng số lượng: {formatCurrency(totalStock())}</div>
              <div>Tổng giá trị: {formatCurrency(totalPrice())}</div>
            </div>
          </div>
        </div>
        <DialogFooter className="">
          {/*<Button className="bg-green-500 hover:bg-green-600">
            <Save className="w-4 h-4 mr-2" />
            Lưu
          </Button>*/}
          <Button
            className={"bg-green-500 hover:bg-green-600 text-white"}
            onClick={handlePrint}
          >
            <FileDown className="w-4 h-4 mr-2" />
            In tem mã
          </Button>
          <Button variant="destructive" onClick={() => onOpenChange(false)}>
            <XCircle className="w-4 h-4 mr-2" />
            Thoát
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
