import { FileOutputIcon, MenuIcon, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import TriangleDown from "@/components/icons/TriangleDown.tsx";
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

export const InventoryPage = () => {
  return (
    <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
      <div className={"text-2xl col-span-1 font-bold"}>
        <p>Phiếu kiểm kho</p>
      </div>
      <div className={"col-span-4 w-full flex justify-between"}>
        <div className="relative flex items-center max-w-80">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input className={"pl-9"} placeholder={"Theo mã, tên hàng"} />
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
          <Button className={"bg-green-500"}>
            <MenuIcon />
            <TriangleDown />
          </Button>
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
                  <CheckBoxWithText id={"normal"}>Phiếu tạm</CheckBoxWithText>
                  <CheckBoxWithText id={"serial"}>
                    Đã cân bằng kho
                  </CheckBoxWithText>
                  <CheckBoxWithText id={"service"}>Đã hủy</CheckBoxWithText>
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
        <InventoryTable></InventoryTable>
      </div>
    </Container>
  );
};
