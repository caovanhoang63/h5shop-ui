import React, { useState } from "react";
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
import { getOrderById, payOrder } from "@/pages/sale/api/orderApi.ts";
import { toast } from "react-toastify";
import { payOrderReport } from "@/pages/sale/components/PayOrderReport.tsx";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | undefined;

  orderDetails: OrderGetDetail;
  onPaymentSuccess: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  customer,
  orderDetails,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [report, setReport] = useState<string>(
    payOrderReport
      .replace(
        "{{created_at}}",
        format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: vi }),
      )
      .replace(
        "{{customerName}}",
        customer ? customer.lastName + " " + customer.firstName : "Khách lẻ",
      )
      .replace("{{customerPhone}}", customer ? customer.phoneNumber : ""),
  );
  const [usePoints, setUsePoints] = useState(false);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    payOrder(orderDetails.id, { isUsePoint: usePoints })
      .then(() => {
        onPaymentSuccess();
        onClose();
        toast.success("Thanh toán thành công");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Thanh toán thất bại");
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const printReport = () => {
    getOrderById(orderDetails.id)
      .then((response) => {
        const order = response.data;

        if (order) {
          setReport(
            payOrderReport
              .replace(
                "{{created_at}}",
                format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: vi }),
              )
              .replace(
                "{{customerName}}",
                customer
                  ? customer.lastName + " " + customer.firstName
                  : "Khách lẻ",
              )
              .replace(
                "{{customerPhone}}",
                customer ? customer.phoneNumber : "",
              )
              .replace(
                "{{body}}",
                order.items
                  .map(
                    (item, index) =>
                      `<tr>
                    <td>${index + 1}</td>
                    <td>${item.skuDetail?.name}</td>
                    <td>${item.amount}</td>
                    <td>${new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.unitPrice)}</td>
                    <td>${new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.unitPrice * item.amount)}</td>
                    <td>${item.description ? item.description : ""}</td>
                  </tr>`,
                  )
                  .join("\n"),
              )
              .replace("{{description}}", orderDetails.description || "")
              .replace(
                "{{pointsUsed}}",
                orderDetails.pointUsed.toString() || "0",
              )
              .replace(
                "{{totalAmount}}",
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderDetails.totalAmount ?? 0),
              )
              .replace(
                "{{discountAmount}}",
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderDetails.discountAmount ?? 0),
              )
              .replace(
                "{{finalAmount}}",
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderDetails.finalAmount ?? 0),
              ),
          );
        }

        const ele = document.createElement("div");
        ele.style.position = "absolute";
        ele.style.left = "-9999px";
        ele.innerHTML = report;
        document.body.appendChild(ele);
        if (ele)
          html2canvas(ele).then(function (canvas) {
            const imgData = canvas.toDataURL("image/png"); // Chuyển đổi HTML thành ảnh
            const pdf = new jsPDF("p", "mm", "a5"); // Tạo một đối tượng PDF
            const pdfWidth = pdf.internal.pageSize.getWidth();
            document.body.removeChild(ele);
            const scaleFactor = 2; // Bạn có thể điều chỉnh giá trị này để ảnh in ra lớn hơn
            const scaledWidth = pdfWidth * scaleFactor;
            const scaledHeight = (canvas.height * scaledWidth) / canvas.width;

            const xOffset = (pdfWidth - scaledWidth) / 2;
            const yOffset = 0;
            pdf.addImage(
              imgData,
              "PNG",
              xOffset,
              yOffset,
              scaledWidth,
              scaledHeight,
            );
            pdf.save("ban-hang-" + format(new Date(), "yyyy-MM-dd") + ".pdf");
          });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Lỗi khi lấy dữ liệu hoá đơn");
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
                  <span>
                    <strong>Điểm tích luỹ: </strong> {customer.discountPoint}
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
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Đơn giá</TableHead>
                    <TableHead>Tổng</TableHead>
                    <TableHead>Ghi Chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails &&
                    orderDetails.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.skuDetail?.name}</TableCell>
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
                        <TableCell>
                          {item.description ? item.description : ""}
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
              <span className="text-sm">
                {orderDetails
                  ? orderDetails.items.reduce(
                      (sum, item) => sum + item.amount,
                      0,
                    )
                  : 0}
              </span>
              <span className="pl-24 pr-8 text-lg font-semibold">
                {(orderDetails
                  ? orderDetails.items.reduce(
                      (sum, item) => sum + item.unitPrice * item.amount,
                      0,
                    )
                  : 0
                ).toLocaleString("vi-VN", {
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
          <Dialog open={isPrint} onOpenChange={() => setIsPrint(false)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hoá đơn</DialogTitle>
              </DialogHeader>
              <DialogContent>
                <div
                  className="text-left"
                  dangerouslySetInnerHTML={{ __html: report }}
                ></div>
              </DialogContent>
            </DialogContent>
          </Dialog>
        </div>
        <DialogFooter>
          <Button onClick={() => printReport()}>Print</Button>
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
