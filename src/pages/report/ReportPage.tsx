import { Fragment, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import Container from "@/layouts/components/Container.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-dropdown-menu";
import { DatePickerWithRange } from "@/components/DatePickerWithRange.tsx";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { listOrderByDate } from "@/pages/report/api.ts";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas-pro";
import { formatMoney } from "@/pages/dashboard/DashBoardPage.tsx";
import { FileDown } from "lucide-react";

let baocaocuoingay = `
<html  lang="vi">
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
      </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Báo cáo cuối ngày về bán hàng</h1>
        </div>
        <div class="info">
            <p><strong>Thời gian tạo:</strong> {{created_at}}</p>
            <p><strong>Ngày bán:</strong> {{date}}</p>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Mã đơn</th>
                    <th>Thời gian</th>
                    <th>Người bán</th>
                    <th>Loại hóa đơn</th>
                    <th>Số đth khách hàng</th>
                    <th>Giá trị</th>
                    <th>Giảm</th>
                    <th>Thực thu</th>
                </tr>
            </thead>
            <tbody>
              {{body}} <!-- Dữ liệu này sẽ được điền vào động -->
            </tbody>
        </table>
        <br>
        <div>Tổng đơn: {{totalOrder}}</div>
        <div>Tổng thu: {{totalAmount}} VND </div>
    </div>
</body>
</html>

`;

export const ReportPage = () => {
  baocaocuoingay = baocaocuoingay
    .replace("{{date}}", format(new Date(), "dd/MM/yyyy", { locale: vi }))
    .replace(
      "{{created_at}}",
      format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: vi }),
    );

  const [reportTemplate, setReportTemplate] = useState<string>(baocaocuoingay);
  useEffect(() => {
    listOrderByDate(new Date(), new Date()).then((r) => {
      let totalAmount = 0;
      let totalOrder = 0;
      const body = r.data.data
        .map((d) => {
          totalAmount += parseFloat(d.finalAmount.toString());
          totalOrder++;

          return `
            <tr class="">
                <td>${d.id}</td>
                <td>${format(d.createdAt, "HH:mm:ss")}</td>
                <td>${d.sellerName}</td>
                <td>${d.saleType == "retail" ? "bán lẻ" : "bán sỉ"}</td>
                <td>${d.customerPhoneNumber ? d.customerPhoneNumber : "-"}</td>
                <td>${formatMoney(d.totalAmount)}</td>
                <td>${formatMoney(d.discountAmount)}</td>
                <td>${formatMoney(d.finalAmount)}</td>
            </tr>
        `;
        })
        .join("\n");
      setReportTemplate(
        baocaocuoingay
          .replace("{{body}}", body)
          .replace("{{totalOrder}}", totalOrder.toString())
          .replace("{{totalAmount}}", formatMoney(totalAmount).toString()),
      );
    });
  }, []);
  return (
    <Fragment>
      <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
        <div className={"text-2xl col-span-1 font-bold"}>
          <p>Nhân viên</p>
        </div>
        <div className={"col-span-4 w-full flex  justify-between"}></div>
        <div className={"col-span-1 space-y-4"}>
          <Button
            variant="secondary"
            className={"w-full"}
            onClick={async () => {
              const ele = document.getElementById("report-html");
              if (ele)
                html2canvas(ele).then(function (canvas) {
                  const imgData = canvas.toDataURL("image/png"); // Chuyển đổi HTML thành ảnh
                  const pdf = new jsPDF("p", "mm", "a4"); // Tạo một đối tượng PDF
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  // const pdfHeight = pdf.internal.pageSize.getHeight();

                  const scaleFactor = 3; // Bạn có thể điều chỉnh giá trị này để ảnh in ra lớn hơn
                  const scaledWidth = pdfWidth * scaleFactor;
                  const scaledHeight =
                    (canvas.height * scaledWidth) / canvas.width;

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
                  pdf.save(
                    "ban-hang-" + format(new Date(), "yyyy-MM-dd") + ".pdf",
                  );
                });
            }}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Tải xuống
          </Button>
          <Card>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className={"hover:no-underline"}>
                    Loại báo cáo
                  </AccordionTrigger>
                  <AccordionContent className={"pb-2 space-y-2"}>
                    <RadioGroup defaultValue="comfortable">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="endDay" id="r1" />
                        <Label>Báo cáo cuối ngày</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sale" id="r2" />
                        <Label>Báo cáo bán hàng</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inventory" id="r3" />
                        <Label>Báo cáo tồn kho</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="warrenty" id="r4" />
                        <Label>Báo cáo bảo hành</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="thuchi" id="r5" />
                        <Label>Báo cáo thu chi</Label>
                      </div>
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className={"hover:no-underline"}>
                    Thời gian
                  </AccordionTrigger>
                  <AccordionContent className={"pb-2 space-y-2"}>
                    <DatePickerWithRange></DatePickerWithRange>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
        <div className={"col-span-4 "}>
          <div
            id="report-html"
            dangerouslySetInnerHTML={{ __html: reportTemplate }}
          />
        </div>
      </Container>
    </Fragment>
  );
};
