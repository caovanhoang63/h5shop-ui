import { Fragment } from "react";
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

const baocaocuoingay = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo cáo cuối ngày về bán hàng</title>
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
            <p><strong>Ngày bán:</strong> 03/01/2025</p>
            <p><strong>Ngày thanh toán:</strong> 03/01/2025</p>
            <p><strong>Chi nhánh:</strong> Chi nhánh trung tâm</p>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Mã giao dịch</th>
                    <th>Thời gian</th>
                    <th>SL</th>
                    <th>Doanh thu</th>
                    <th>Thu khác</th>
                    <th>VAT</th>
                    <th>Phí trả hàng</th>
                    <th>Thực thu</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="8" class="no-data">Báo cáo không có dữ liệu</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
`;

export const ReportPage = () => {
  const html = `<p>1232</p>`;
  const doc = new jsPDF();
  doc.html(html);
  return (
    <Fragment>
      <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
        <div className={"text-2xl col-span-1 font-bold"}>
          <p>Nhân viên</p>
        </div>
        <div className={"col-span-4 w-full flex  justify-between"}></div>
        <div className={"col-span-1 space-y-4"}>
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
                        <Label htmlFor="r1  ">Báo cáo cuối ngày</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sale" id="r2" />
                        <Label htmlFor="r2">Báo cáo bán hàng</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inventory" id="r3" />
                        <Label htmlFor="r3">Báo cáo tồn kho</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="warrenty" id="r4" />
                        <Label htmlFor="r4">Báo cáo bảo hành</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="thuchi" id="r5" />
                        <Label htmlFor="r5">Báo cáo thu chi</Label>
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
        <div className={"col-span-4"}>
          <div dangerouslySetInnerHTML={{ __html: baocaocuoingay }} />
        </div>
      </Container>
    </Fragment>
  );
};
