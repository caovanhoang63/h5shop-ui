import { CalendarIcon, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import Container from "@/layouts/components/Container.tsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ButtonVisibilityColumnTable,
  MenuVisibilityColumnTable,
} from "@/components/ButtonVisibilityColumnTable.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { SelectRangeEventHandler } from "react-day-picker";
import { StockInFilter } from "@/pages/inventory/stockIn/api/stockInApi.ts";
import { toast } from "react-toastify";
import { listStockOutApi } from "@/pages/inventory/stockOut/api/stockOutApi.ts";
import { StockOutItemTable } from "@/types/stockOut/stockOut.ts";
import { StockOutTable } from "@/pages/inventory/stockOut/StockOutTable.tsx";
import { Paging } from "@/types/paging.ts";
import { ExportButton } from "@/components/ExportButton.tsx";

export const StockOutPage = () => {
  const [stockOutReport, setStockOutReport] = useState<StockOutItemTable[]>([]);
  const [filters, setFilters] = useState<StockInFilter>({
    lk_providerName: null,
    gtUpdatedAt: null,
    ltUpdatedAt: null,
    status: [],
    lk_Id: null,
  });
  const [selectedTimeOption, setSelectedTimeOption] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [search, setSearch] = useState<string>();
  /*const handleStatusChange = (value: string, checked: boolean) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setFilters((prevFilters) => {
      const updatedStatus = checked
        ? [...prevFilters.status!, value]
        : prevFilters.status!.filter((item) => item !== value);

      return {
        ...prevFilters,
        status: updatedStatus,
      };
    });
  };*/
  const handleSearchChange = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      lk_Id: value,
    }));
  };
  const handleTimeOptionChange = (value: string) => {
    setSelectedTimeOption(value);
    const newFilters = { ...filters };

    switch (value) {
      case "all":
        newFilters.gtUpdatedAt = null;
        newFilters.ltUpdatedAt = null;
        setDateRange({ from: undefined, to: undefined });
        break;
      case "this-month":
        newFilters.gtUpdatedAt = startOfMonth(new Date());
        newFilters.ltUpdatedAt = endOfMonth(new Date());
        setDateRange({
          from: newFilters.gtUpdatedAt,
          to: newFilters.ltUpdatedAt,
        });
        break;
      case "custom":
        break;
    }

    setFilters(newFilters);
  };
  const handleDateRangeChange: SelectRangeEventHandler = (range) => {
    if (range?.from) {
      setDateRange({ from: range.from, to: range.to });
      setFilters((prevFilters) => ({
        ...prevFilters,
        gtUpdatedAt: range.from,
        ltUpdatedAt: range.to || range.from,
      }));
    } else {
      setDateRange({ from: undefined, to: undefined });
      setFilters((prevFilters) => ({
        ...prevFilters,
        gtUpdatedAt: null,
        ltUpdatedAt: null,
      }));
    }
  };
  const listStockOut = async () => {
    try {
      const response = await listStockOutApi(filters);
      console.log("api", response.data);
      setStockOutReport(response.data);
      setPaging({ ...paging, total: response.paging?.total });
    } catch (error) {
      toast.error("Lỗi hệ thống!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log(error);
    }
  };
  useEffect(() => {
    listStockOut();
  }, [filters]);
  const [fields, setFields] = useState<MenuVisibilityColumnTable[]>([
    { label: "Mã xuất kho", key: "id", visible: true },
    { label: "Thời gian", key: "updatedAt", visible: true },
    { label: "Tổng số lượng", key: "totalAmount", visible: true },
    { label: "Trạng thái", key: "status", visible: true },
    { label: "Mô tả", key: "stockOutReasonDescription", visible: true },
    { label: "Loại xuất hàng", key: "stockOutReasonName", visible: true },
    /*{ label: "Action", key: "actions", visible: true },*/
  ]);
  const handleCheckField = (key: string, visible: boolean) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.key === key ? { ...field, visible } : field,
      ),
    );
  };
  const [paging, setPaging] = useState<Paging>({
    limit: 10,
    page: 1,
  });
  const handleSetPaging = (page: number) => {
    setPaging({ ...paging, page });
    setFilters({ ...filters, page });
  };
  return (
    <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
      <div className={"text-2xl col-span-1 font-bold"}>
        <p>Phiếu xuất hàng</p>
      </div>
      <div className={"col-span-4 w-full flex justify-between"}>
        <div className="relative flex items-center max-w-80">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearchChange(e.target.value);
            }}
            className={"pl-9"}
            placeholder={"Theo mã"}
          />
        </div>
        <div className={"flex space-x-2"}>
          <Link to={"/stock-out/new"}>
            <Button className={"bg-green-500"}>
              <Plus />
              Xuất hàng
            </Button>
          </Link>
          <ExportButton data={stockOutReport || []} fileName={`stockOut`} />

          <ButtonVisibilityColumnTable
            menus={fields}
            onCheckChange={handleCheckField}
          />
        </div>
      </div>
      <div className={"col-span-1 space-y-4"}>
        <Card>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className={"hover:no-underline"}>
                  Thời gian
                </AccordionTrigger>
                <AccordionContent className={"space-y-2"}>
                  <RadioGroup
                    defaultValue="all"
                    value={selectedTimeOption}
                    onValueChange={handleTimeOptionChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className={"font-normal"}>
                        Tất cả
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="this-month" id="this-month" />
                      <Label htmlFor="this-month" className={"font-normal"}>
                        Tháng này
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className={"custom"}>
                        Lựa chọn khác
                      </Label>
                    </div>
                  </RadioGroup>
                  {selectedTimeOption === "custom" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange?.from}
                          selected={dateRange}
                          onSelect={handleDateRangeChange}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        {/*<Card>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className={"hover:no-underline"}>
                  Trạng thái
                </AccordionTrigger>
                <AccordionContent className={"pb-2 space-y-2"}>
                  <CheckBoxWithText
                    id={"serial"}
                    onCheckChange={(value) => handleStatusChange("1", !!value)}
                  >
                    Đã xuất hàng
                  </CheckBoxWithText>
                  <CheckBoxWithText
                    id={"service"}
                    onCheckChange={(value) => handleStatusChange("0", !!value)}
                  >
                    Đã hủy
                  </CheckBoxWithText>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>*/}
        {/*<Card>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className={"hover:no-underline"}>
                  Người tạo
                </AccordionTrigger>
                <AccordionContent className={"pb-0"}>
                  <Input
                    className={"focus-visible:ring-0 border-0 shadow-none"}
                    placeholder={"Chọn người tạo "}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>*/}
      </div>
      <div className={"col-span-4"}>
        <StockOutTable
          columnVisible={fields}
          dataStockOut={stockOutReport}
          setPaging={handleSetPaging}
          paging={paging}
        ></StockOutTable>
      </div>
    </Container>
  );
};
