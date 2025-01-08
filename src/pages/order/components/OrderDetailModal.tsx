import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Save, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { OrderGetDetail } from "@/types/order/orderGetDetail.ts";
import { Link } from "react-router-dom";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.tsx";
import { deleteOrderApi } from "@/pages/order/api/orderApi.ts";
import { toast } from "react-toastify";
import { useState } from "react";
interface IOrderDetailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  order?: OrderGetDetail;
  onOrderDelete: () => void;
}

const formatWarrantyType = (typeTimeWarranty: string) => {
  switch (typeTimeWarranty.toLowerCase()) {
    case "day":
      return "ngày";
    case "month":
      return "tháng";
    case "year":
      return "năm";
    case "week":
      return "tuần";
    default:
      return typeTimeWarranty; // Optional: Handle unexpected values
  }
};

export default function OrderDetailModal({
  isOpen,
  onOpenChange,
  order,
  onOrderDelete,
}: IOrderDetailModalProps) {
  interface IStatusMap {
    [key: number | string]: string;
  }
  const statusMap: IStatusMap = {
    2: "Đã hoàn thành",
    0: "Đã hủy",
    1: "Đang bán",
  };
  const orderTypeMap: IStatusMap = {
    retail: "Bán lẻ",
    wholesale: "Bán sỉ",
  };
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const formatCurrency = (amount: number) => {
    const numberPrice = Number(amount);
    return numberPrice.toLocaleString("en-US");
  };

  const totalAmount = () => {
    if (order)
      return order.items.reduce((total, item) => total + item.amount, 0);
    return 0;
  };

  const totalPrice = () => {
    if (order)
      return order.items.reduce(
        (total, item) => total + item.unitPrice * item.amount,
        0,
      );
    return 0;
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl max-h-screen flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết hoá đơn</DialogTitle>
        </DialogHeader>
        <div className="w-full mx-auto space-y-4">
          {order && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Mã hoá đơn:</span>
                  <span>{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Cập nhập lần cuối:</span>
                  <span>
                    {order.updatedAt &&
                      new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tên khách hàng</span>
                  <span>{order.customerName || "Khách lẻ"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Số điện thoại khách hàng</span>
                  <span>{order.customerPhone || ""}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Trạng thái:</span>
                  <span>{statusMap[order.status]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Loại hoá đơn</span>
                  <span>{orderTypeMap[order.orderType]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Người tạo:</span>
                  <span>{order.sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Số điểm sử dụng:</span>
                  <span>{order.pointUsed}</span>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <ScrollArea className={"max-h-[200px] px-2"}>
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead>Mã hàng</TableHead>
                    <TableHead>Tên hàng</TableHead>
                    <TableHead className="text-right">Số lượng</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">Tổng</TableHead>
                    <TableHead className="text-right">Ghi chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order?.items.map((item) => (
                    <TableRow key={item.skuId}>
                      <TableCell className="text-blue-600">
                        {item.skuId}
                      </TableCell>
                      <TableCell>{item.skuDetail?.name}</TableCell>
                      <TableCell className="text-right">
                        {item.amount}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.unitPrice}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.amount * item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.description || ""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <h3 className="mt-4 text-lg font-medium">
              Thông tin Bảo hành & Đổi trả
            </h3>
            <ScrollArea className={"max-h-[150px] px-2"}>
              <Table>
                <TableHeader className="bg-green-50">
                  <TableRow>
                    <TableHead>Mã hàng</TableHead>
                    <TableHead>Tên hàng</TableHead>
                    <TableHead className="text-right">Bảo hành</TableHead>
                    <TableHead className="text-right">Đổi trả</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order?.items.map((item) => (
                    <TableRow key={item.skuId}>
                      <TableCell className="text-blue-600">
                        {item.skuId}
                      </TableCell>
                      <TableCell>{item.skuDetail?.name}</TableCell>
                      <TableCell className="text-right">
                        {item.skuDetail?.timeWarranty
                          ? `${item.skuDetail.timeWarranty} ${formatWarrantyType(
                              item.skuDetail.typeTimeWarranty,
                            )}`
                          : "Không bảo hành"}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.skuDetail?.timeReturn
                          ? `${item.skuDetail.timeReturn} ${formatWarrantyType(
                              item.skuDetail.typeTimeReturn,
                            )}`
                          : "Không đổi trả"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <div className="flex flex-row">
              <div className="space-y-2 text-left">
                <div>Tổng số lượng: {formatCurrency(totalAmount())}</div>
                <div>Tổng giá trị: {formatCurrency(totalPrice())}</div>
              </div>
              {order && order.status === 2 && (
                <div className="ml-auto space-y-2 text-right">
                  <div>
                    Tổng tiền hoá đơn: {formatCurrency(order.totalAmount)}
                  </div>
                  <div>
                    Tổng giảm giá: {formatCurrency(order.discountAmount)}
                  </div>
                  <div>Tổng cộng: {formatCurrency(order.finalAmount)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="">
          {order && order.status === 1 && (
            <Link to={"/sale"}>
              <Button className="bg-green-500 hover:bg-green-600">
                <Save className="w-4 h-4 mr-2" />
                Cập nhập
              </Button>
            </Link>
          )}
          {order && order.status !== 0 && (
            <Button
              variant="destructive"
              onClick={() => {
                setIsDeleteDialogOpen(true);
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Xoá
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <ConfirmDeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={() => {
              if (!order) return;
              deleteOrderApi(order.id)
                .then(() => {
                  toast.success("Xoá hoá đơn thành công");
                  onOrderDelete();
                })
                .catch(() => {
                  toast.error("Xoá hoá đơn thất bại");
                })
                .finally(() => {
                  setIsDeleteDialogOpen(false);
                  onOpenChange(false);
                });
            }}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
