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
import { payOrder } from "@/pages/sale/api/orderApi.ts";
import { toast } from "react-toastify";
import { format } from "date-fns";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { vi } from "date-fns/locale";

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
  const [usePoints, setUsePoints] = useState(false);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    payOrder(orderDetails.id, { isUsePoint: usePoints })
      .then((res) => {
        onPaymentSuccess();
        onClose();
        setUsePoints(false);
        toast.success("Thanh toán thành công");
        printReport(res.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Thanh toán thất bại");
      })
      .finally(() => {
        setIsProcessing(false);
      });
    return orderDetails.id;
  };

  const printReport = (order: OrderGetDetail) => {
    try {
      console.log("Print:", order);
      if (order) {
        const payOrderReport = `<html  lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo cáo bán hàng cuối ngày</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
  
          .container {
              margin: 20px auto;
              padding: 20px;
              max-width: 800px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
  
          .header {
              text-align: center;
              margin-bottom: 20px;
          }
  
          .header h1 {
              margin: 0;
              font-size: 24px;
              color: #333333;
          }
  
          .info {
              margin-bottom: 20px;
          }
  
          .info p {
              margin: 5px 0;
              font-size: 14px;
              color: #666666;
          }
  
          table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
          }
  
          table th, table td {
              border: 1px solid #dddddd;
              padding: 8px;
              text-align: center;
          }
  
          table th {
              background-color: #f4f4f4;
              color: #333333;
              font-weight: bold;
          }
  
          .no-data {
              text-align: center;
              font-size: 14px;
              color: #999999;
              padding: 20px;
              background-color: #fefefe;
          }
          
          .summary {
            margin-top: 20px;
            padding: 15px;
          }

          .summary div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            font-size: 14px;
            color: #333333;
          }
  
          .summary .large-text {
            font-size: 18px;
            font-weight: bold;
            color: #000000;
          }
  
          .summary strong {
              color: #000000;
          }
      </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Hoá đơn</h1>
        </div>
        <div class="info">
            <p><strong>Thời gian tạo:</strong> ${
              order.updatedAt
                ? format(new Date(order.updatedAt), "dd/MM/yyyy HH:mm:ss", {
                    locale: vi,
                  })
                : ""
            }</p>
        </div>
        <div>Khách hàng: ${order.customerName || "Khách lẻ"}</div>
        <div>Số điện thoại: ${order.customerPhone || ""}</div>
        <table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Tổng</th>
                    <th>Ghi chú</th>
                </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.skuDetail?.name || ""}</td>
            <td>${item.amount}</td>
            <td>${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(item.unitPrice || 0)}</td>
            <td>${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format((item.unitPrice || 0) * (item.amount || 0))}</td>
            <td>${item.description || ""}</td>
          </tr>
        `,
                )
                .join("")}
            </tbody>
        </table>
        <br>

        <div class="summary">
            <div><span><strong>Ghi chú:</strong></span><span>${order.description || ""}</span></div>
            <div><span><strong>Điểm đã sử dụng:</strong></span><span>${order.pointUsed}</span></div>
            <div>
              <span><strong>Tổng tiền:</strong></span>
              <span class="large-text">
                ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount)}
              </span>
            </div>
            <div>
              <span><strong>Giảm giá:</strong></span>
              <span class="large-text">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.discountAmount)}</span></div>
            <div>
              <span><strong>Thành tiền:</strong></span>
              <span class="large-text">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.finalAmount)}</span>
            </div>
        </div>
    </div>
</body>
</html>`;
        const ele = document.createElement("div");
        ele.style.position = "absolute";
        ele.style.left = "-9999px";
        ele.innerHTML = payOrderReport;
        document.body.appendChild(ele);
        if (ele)
          html2canvas(ele).then(function (canvas) {
            const imgData = canvas.toDataURL("image/png"); // Chuyển đổi HTML thành ảnh
            const pdf = new jsPDF("p", "mm", "a6"); // Tạo một đối tượng PDF
            const pdfWidth = pdf.internal.pageSize.getWidth();
            document.body.removeChild(ele);
            const scaleFactor = 1; // Bạn có thể điều chỉnh giá trị này để ảnh in ra lớn hơn
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
            pdf.save("hoa-don-" + format(new Date(), "yyyy-MM-dd") + ".pdf");
          });
      }
    } catch (e) {
      console.error(e);
      toast.error("Không thể in");
    }
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
                disabled={!customer}
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
          {/*<Button onClick={() => printReport()}>Print</Button>*/}
          <Button
            onClick={() => {
              handleConfirmPayment();
            }}
            disabled={isProcessing}
          >
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
