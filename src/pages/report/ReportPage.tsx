import React, { Fragment, useEffect, useState } from "react";
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
import jsPDF from "jspdf";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import { inventoryReport, listOrderByDate } from "@/pages/report/api.ts";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas-pro";
import { formatMoney } from "@/pages/dashboard/DashBoardPage.tsx";
import { Calendar as CalendarIcon, FileDown } from "lucide-react";
import { baocaocuoingayC } from "@/pages/report/dailyEndedReport.ts";
import { inventoryReportTemplate } from "@/pages/report/inventoryReport.ts";
import { saleReportTemplate } from "@/pages/report/saleReport.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { cn } from "@/lib/utils.ts";
import { DateRange } from "react-day-picker";
import { getRevenue, getSkuOrder } from "@/pages/dashboard/api.ts";

export const ReportPage = () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const [endDateReport, setEndDateReport] = useState<string>(
    baocaocuoingayC
      .replace("{{date}}", format(new Date(), "dd/MM/yyyy", { locale: vi }))
      .replace(
        "{{created_at}}",
        format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: vi }),
      ),
  );
  const [inventoryReportT, setInventoryReportT] = useState<string>(
    inventoryReportTemplate.replace(
      "{{created_at}}",
      format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: vi }),
    ),
  );
  const [saleReport, setSaleReport] = useState<string>(
    saleReportTemplate
      .replace(
        "{{created_at}}",
        format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: vi }),
      )
      .replace(
        "{{startDate}}",
        format(date?.from || new Date(), "dd/MM/yyyy", { locale: vi }),
      )
      .replace(
        "{{endDate}}",
        format(date?.to || new Date(), "dd/MM/yyyy", { locale: vi }),
      ),
  );

  const [reportTemplate, setReportTemplate] = useState<string>(endDateReport);
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
      setEndDateReport((a) => {
        const v = a
          .replace("{{body}}", body)
          .replace("{{totalOrder}}", totalOrder.toString())
          .replace("{{totalAmount}}", formatMoney(totalAmount).toString());
        setReportTemplate(v);
        return v;
      });
    });

    inventoryReport().then((r) => {
      let totalInventory = 0;
      const body = r.data.data
        .map((d) => {
          totalInventory += d.stock;
          return `
            <tr class="">
                <td>${d.id}</td>
                <td>${d.name}</td>
                <td>${d.stock}</td>
                <td>${d.status == 1 ? "Đang bán " : "Ngừng kinh doanh"}</td>
            </tr>
        `;
        })
        .join("\n");
      setInventoryReportT((a) => {
        return a
          .replace("{{body}}", body)
          .replace("{{totalInventory}}", totalInventory.toString());
      });
    });
  }, []);

  useEffect(() => {
    getSkuOrder(
      date?.from || new Date(),
      date?.to || new Date(),
      10,
      "amount",
    ).then((r) => {
      const body = r.data.data
        .map((d, i) => {
          return `
            <tr class="">
                <td>${i + 1}</td>
                <td>${d.id}</td>
                <td>${d.name}</td>
                <td>${d.amount}</td>
                <td>${formatMoney(d.revenue)}</td>
            </tr>
          `;
        })
        .join("\n");
      setSaleReport((a) => {
        return a.replace("{{skuBody}}", body);
      });
    });
    getRevenue(date?.from || new Date(), date?.to || new Date()).then((r) => {
      let totalAmount = 0;
      let totalOrder = 0;
      const body = r.data.data
        .map((d) => {
          totalAmount += parseFloat(d.revenue.toString());
          totalOrder += d.totalOrder;
          return `
            <tr class="">
                <td>${format(d.date, "dd-MM-yyyy")}</td>
                <td>${d.totalOrder}</td>
                <td>${formatMoney(d.revenue)} </td>
            </tr>
          `;
        })
        .join("\n");
      setSaleReport((a) => {
        return a
          .replace("{{revenueBody}}", body)
          .replace("{{totalAmount}}", formatMoney(totalAmount).toString())
          .replace("{{totalOrder}}", totalOrder.toString());
      });
    });
  }, [date]);
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
                    <RadioGroup
                      defaultValue="endDay"
                      onValueChange={(v) => {
                        switch (v) {
                          case "endDay":
                            setReportTemplate(endDateReport);
                            break;
                          case "inventory":
                            setReportTemplate(inventoryReportT);
                            break;
                          case "sale":
                            setReportTemplate(saleReport);
                            break;
                        }
                      }}
                    >
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
                    <div className={cn(" grid gap-2")}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              " justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon />
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, "LLL dd, y")} -{" "}
                                  {format(date.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(date.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
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
