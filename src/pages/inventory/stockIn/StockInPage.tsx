import { CalendarIcon, FileOutputIcon, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { CheckBoxWithText } from "@/components/CheckBoxWithText.tsx";
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
import { StockInTable } from "@/pages/inventory/stockIn/StockInTable.tsx";
import {
  getStockInTableApi,
  StockInFilter,
} from "@/pages/inventory/stockIn/api/stockInApi.ts";
import { StockInItemTable } from "@/types/stockIn/stockIn.ts";
import { toast } from "react-toastify";

export const StockInPage = () => {
  const [stockInReport, setStockInReport] = useState<StockInItemTable[]>([]);
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
  const handleStatusChange = (value: string, checked: boolean) => {
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
  };
  const handleSearchChange = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      lk_Id: value.trim() === "" ? null : value,
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
  const getStockInTable = async () => {
    try {
      const response = await getStockInTableApi(filters);
      console.log("api", response.data);
      setStockInReport(response.data);
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
    getStockInTable();
  }, [filters]);
  const [fields, setFields] = useState<MenuVisibilityColumnTable[]>([
    { label: "Mã nhập kho", key: "id", visible: true },
    { label: "Thời gian", key: "updatedAt", visible: true },
    { label: "Tổng số lượng", key: "totalAmount", visible: true },
    { label: "Trạng thái", key: "status", visible: true },
    /*{ label: "Action", key: "actions", visible: true },*/
  ]);
  const handleCheckField = (key: string, visible: boolean) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.key === key ? { ...field, visible } : field,
      ),
    );
  };
  console.log("fillet", filters);

  return (
    <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
      <div className={"text-2xl col-span-1 font-bold"}>
        <p>Phiếu nhập hàng</p>
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
          <Link to={"/stock-in/new"}>
            <Button className={"bg-green-500"}>
              <Plus />
              Nhập hàng
            </Button>
          </Link>
          <Button className={"bg-green-500"}>
            <FileOutputIcon />
            Xuất file
          </Button>
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
        <Card>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className={"hover:no-underline"}>
                  Trạng thái
                </AccordionTrigger>
                <AccordionContent className={"pb-2 space-y-2"}>
                  <CheckBoxWithText
                    id={"draft"}
                    onCheckChange={(value) => handleStatusChange("2", !!value)}
                  >
                    Phiếu tạm
                  </CheckBoxWithText>
                  <CheckBoxWithText
                    id={"serial"}
                    onCheckChange={(value) => handleStatusChange("1", !!value)}
                  >
                    Đã nhập hàng
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
        </Card>
        <Card>
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
        </Card>
      </div>
      <div className={"col-span-4"}>
        <StockInTable
          columnVisible={fields}
          dataStockIn={stockInReport}
        ></StockInTable>
      </div>
    </Container>
  );
};
