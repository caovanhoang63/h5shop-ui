import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { OrderGetDetail } from "@/types/order/orderGetDetail.ts";
import { Customer } from "@/types/customer/customer.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { payOrder } from "@/pages/sale/api/orderApi.ts";
import { toast } from "react-toastify";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  customer: Customer | undefined;
  orderDetails: OrderGetDetail;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  orderId,
  customer,
  orderDetails,
}) => {
  const totalAmount = useMemo(
    () =>
      orderDetails
        ? orderDetails.items.reduce(
            (sum, item) => sum + item.unitPrice * item.amount,
            0,
          )
        : 0,
    [orderDetails],
  );
  const numberOfItems = useMemo(
    () =>
      orderDetails
        ? orderDetails.items.reduce((sum, item) => sum + item.amount, 0)
        : 0,
    [orderDetails],
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [usePoints, setUsePoints] = useState(false);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    payOrder(orderId, { isUsePoint: usePoints })
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Thanh toán thất bại", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thanh toán hoá đơn</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div>
            <p>
              {customer ? (
                <span className="flex flex-col">
                  <span>
                    <strong>Khách hàng: </strong>{" "}
                    {customer.lastName + " " + customer.firstName}
                  </span>
                  <span>
                    <strong>Số điện thoại: </strong> {customer.phoneNumber}
                  </span>
                </span>
              ) : (
                <strong>Khách lẻ</strong>
              )}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3>Hoá đơn</h3>
            {orderDetails && orderDetails.items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails &&
                    orderDetails.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.skuId}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-US").format(
                            item.unitPrice,
                          )}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-US").format(
                            item.unitPrice * item.amount,
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">
                Không có sản phẩm nào trong hoá đơn.
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Tổng số lượng sản phẩm:
              </span>
              <span className="text-sm">{numberOfItems}</span>
              <span className="pl-24 pr-8 text-lg font-semibold">
                {totalAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
            <div className="flex items-center mt-2">
              <Checkbox
                id="usePoints"
                checked={usePoints}
                onCheckedChange={(checked) => setUsePoints(!!checked)}
              />
              <label htmlFor="usePoints" className="ml-2 text-sm">
                Sử dụng điểm tích luỹ
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirmPayment} disabled={isProcessing}>
            {isProcessing ? "Đang xử lý..." : "Thanh toán"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
