import { Fragment, useEffect, useState } from "react";
import {
  ButtonVisibilityColumnTable,
  MenuVisibilityColumnTable,
} from "@/components/ButtonVisibilityColumnTable.tsx";
import { PagingSpu } from "@/types/spu/PagingSpu.ts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation.tsx";
import Container from "@/layouts/components/Container.tsx";
import { CalendarIcon, FileOutputIcon, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import TriangleDown from "@/components/icons/TriangleDown.tsx";
import { Label } from "@/components/ui/label.tsx";

import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { DataTableWarranty } from "@/pages/warranty/component/DataTableWarranty.tsx";
import WarrantyModal from "@/pages/warranty/api/WarrantyModal.tsx";
import { getListWarrantyForm } from "@/pages/warranty/api/warrantyApi.ts";
import { Warranty, WarrantyFilter } from "@/types/warranty/warranty.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

export default function WarrantyPage() {
  const [fields, setFields] = useState<MenuVisibilityColumnTable[]>([
    { label: "Mã", key: "id", visible: true },
    { label: "Loại bảo hành", key: "warrantyType", visible: true },
    { label: "Id khách hàng", key: "customerId", visible: true },
    { label: "Sdt khách hàng", key: "customerPhoneNumber", visible: true },
    { label: "Số luợng", key: "amount", visible: true },
    { label: "Id stock in", key: "stockInId", visible: false },
    { label: "Id sku", key: "skuId", visible: false },
    { label: "Id order", key: "orderId", visible: false },
    { label: "Ngày trả hàng", key: "returnDate", visible: false },
    { label: "Note", key: "note", visible: true },
    { label: "Trạng thái", key: "status", visible: true },
    { label: "Ngày tạo", key: "createdAt", visible: false },
    { label: "Ngày cập nhật", key: "updatedAt", visible: false },
  ]);

  const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [warrantyList, setWarrantyList] = useState<Warranty[]>([]);
  const [selectedTimeOption, setSelectedTimeOption] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [paging, setPaging] = useState<PagingSpu>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [warrantyFilter, setWarrantyFilter] = useState<WarrantyFilter>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setIsLoading(true);
    getListWarrantyForm(warrantyFilter)
      .then((response) => {
        console.log(response.data);
        setWarrantyList(response.data);
        setPaging({ ...response.paging, total: response.data.length });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log(warrantyFilter);
    setIsLoading(true);
    getListWarrantyForm(warrantyFilter)
      .then((response) => {
        console.log(response.data);
        setWarrantyList(response.data);
        setPaging({ ...response.paging, total: response.data.length });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [warrantyFilter]);

  useEffect(() => {
    if ((dateRange.from as Date) && (dateRange.to as Date)) {
      setWarrantyFilter({
        ...warrantyFilter,
        ltUpdatedAt: dateRange.to,
        gtUpdatedAt: dateRange.from,
        page: 1,
      });
    }
  }, [dateRange]);

  const handleCheckField = (key: string, visible: boolean) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.key === key ? { ...field, visible } : field,
      ),
    );
  };

  const handleTimeOptionChange = (value: string) => {
    setSelectedTimeOption(value);
  };

  const handleDateRangeChange: SelectRangeEventHandler = (
    range: DateRange | undefined,
  ) => {
    if (range) {
      setDateRange({
        from: range.from,
        to: range.to,
      });
    }
  };

  const handleSelectItemTable = (spuId: number) => {
    console.log(spuId);
  };

  const handleSetPaging = (page: number) => {
    setPaging({ ...paging, page });
    setWarrantyFilter({ ...warrantyFilter, page });
  };

  return (
    <Fragment>
      {isLoading && <LoadingAnimation></LoadingAnimation>}
      <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
        <div className={"text-2xl col-span-1 font-bold"}>
          <p>Hàng hóa</p>
        </div>
        <div className={"col-span-4 w-full flex  justify-between"}>
          <div className="relative flex items-center max-w-80">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              className={"pl-9"}
              placeholder={"Theo số điện thoại"}
              value={warrantyFilter.id}
              onChange={(e) =>
                setWarrantyFilter({
                  ...warrantyFilter,
                  lkCustomerPhoneNumber: e.target.value,
                  page: 1,
                })
              }
            />
          </div>
          <div className={"flex space-x-2"}>
            <Button
              className={"bg-green-500"}
              onClick={() => {
                setIsOpenedModal(true);
              }}
            >
              <Plus />
              Thêm mới
              <TriangleDown />
            </Button>
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
                            numberOfMonths={2}
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
          <DataTableWarranty
            columnVisible={fields}
            warrantyList={warrantyList}
            onSelectedRow={handleSelectItemTable}
            paging={paging}
            setPaging={handleSetPaging}
          ></DataTableWarranty>
        </div>
      </Container>

      <WarrantyModal
        isOpen={isOpenedModal}
        onOpenChange={setIsOpenedModal}
        isAdd={true}
      />
    </Fragment>
  );
}
