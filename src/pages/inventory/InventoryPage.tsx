import { FileOutputIcon, Plus, Search } from "lucide-react";
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
import { InventoryTable } from "./InventoryTable.tsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { InventoryReport } from "@/types/inventoryReport.ts";
import {
  getInventoryReports,
  InventoryReportFilter,
} from "@/pages/inventory/api/reportApi.ts";
import {
  ButtonVisibilityColumnTable,
  MenuVisibilityColumnTable,
} from "@/components/ButtonVisibilityColumnTable.tsx";

export const InventoryPage = () => {
  const [inventoryReports, setInventoryReports] = useState<InventoryReport[]>(
    [],
  );
  const [filters, setFilters] = useState<InventoryReportFilter>({
    lk_warehouseMan1: null,
    time: null,
    status: [],
  });
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
  /*const handleFilterChange = (key: string, value: never) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };*/
  const getInventoryReportTable = async () => {
    try {
      const response = await getInventoryReports(filters);
      console.log("api", response.data);
      setInventoryReports(response.data);
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
        <p>Phiếu kiểm kho</p>
      </div>
      <div className={"col-span-4 w-full flex justify-between"}>
        <div className="relative flex items-center max-w-80">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            className={"pl-9"}
            placeholder={"Theo mã, thời gian cân bằng"}
          />
        </div>
        <div className={"flex space-x-2"}>
          <Link to={"/stock-takes"}>
            <Button className={"bg-green-500"}>
              <Plus />
              Kiểm kho
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
                  <RadioGroup defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one" className={"font-normal"}>
                        Tháng này
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two" className={"font-normal"}>
                        Lựa chọn khác
                      </Label>
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
                    Đã cân bằng kho
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
        <InventoryTable
          columnVisible={fields}
          dataInventory={inventoryReports}
        ></InventoryTable>
      </div>
    </Container>
  );
};
