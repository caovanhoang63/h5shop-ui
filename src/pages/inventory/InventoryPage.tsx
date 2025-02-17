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
import { InventoryTable } from "./InventoryTable.tsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { InventoryReport } from "@/types/inventory/inventoryReport.ts";
import {
  getInventoryReports,
  InventoryReportFilter,
} from "@/pages/inventory/api/reportApi.ts";
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
import { ExportButton } from "@/components/ExportButton.tsx";
import { Paging } from "@/types/paging.ts";

export const InventoryPage = () => {
  const [inventoryReports, setInventoryReports] = useState<InventoryReport[]>(
    [],
  );
  const [filters, setFilters] = useState<InventoryReportFilter>({
    lk_warehouseMan1: null,
    gtUpdatedAt: null,
    ltUpdatedAt: null,
    status: [],
    lk_Id: null,
    page: null,
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
  const getInventoryReportTable = async () => {
    try {
      const response = await getInventoryReports(filters);
      console.log("api", response.data);
      setInventoryReports(response.data);
      setPaging({ ...paging, total: response.paging?.total });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getInventoryReportTable();
  }, [filters]);
  const [fields, setFields] = useState<MenuVisibilityColumnTable[]>([
    { label: "Mã kiểm kho", key: "id", visible: true },
    { label: "Thời gian cân bằng", key: "updatedAt", visible: true },
    { label: "SL thực tế", key: "amount", visible: true },
    { label: "Tổng chênh lệch", key: "inventoryDif", visible: true },
    { label: "Ghi chú", key: "note", visible: true },
    { label: "Trạng thái", key: "status", visible: true },
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
        <p>Phiếu kiểm kho</p>
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
          <Link to={"/stock-takes"}>
            <Button className={"bg-green-500"}>
              <Plus />
              Kiểm kho
            </Button>
          </Link>
          <ExportButton data={inventoryReports || []} fileName={`Inventory`} />

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
      </div>
      <div className={"col-span-4"}>
        <InventoryTable
          columnVisible={fields}
          dataInventory={inventoryReports}
          setPaging={handleSetPaging}
          paging={paging}
        ></InventoryTable>
      </div>
    </Container>
  );
};
