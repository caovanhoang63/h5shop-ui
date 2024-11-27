import Container from "@/layouts/components/Container.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  FileInput,
  FileOutputIcon,
  MenuIcon,
  Plus,
  Search,
} from "lucide-react";
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
import { DataTableDemo } from "@/pages/product/DataTable.tsx";

export default function ProductPage() {
  return (
    <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
      <div className={"text-2xl col-span-1 font-bold"}>
        <p>Hàng hóa</p>
      </div>
      <div className={"col-span-4 w-full flex  justify-between"}>
        <div className="relative flex items-center max-w-80">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input className={"pl-9"} placeholder={"Theo mã, tên hàng"} />
        </div>
        <div className={"flex space-x-2"}>
          <Button className={"bg-green-500"}>
            <Plus />
            Thêm mới
            <TriangleDown />
          </Button>
          <Button className={"bg-green-500"}>
            <FileInput />
            Import
          </Button>
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
                  Phân loại
                </AccordionTrigger>
                <AccordionContent className={"space-y-2"}>
                  <CheckBoxWithText id={"normal"}>
                    Hàng hóa thường
                  </CheckBoxWithText>
                  <CheckBoxWithText id={"serial"}>
                    Hàng hóa - Serial/IMEI
                  </CheckBoxWithText>
                  <CheckBoxWithText id={"service"}>Dịch vụ</CheckBoxWithText>
                  <CheckBoxWithText id={"combo"}>
                    Combo - Đóng gói
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
                  Phân loại
                </AccordionTrigger>
                <AccordionContent className={"pb-0"}>
                  <Input
                    className={"focus-visible:ring-0 border-0 shadow-none"}
                    placeholder={"Chọn nhà cung cấp "}
                  />
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
                  Bảo hành
                </AccordionTrigger>
                <AccordionContent className={"pb-0"}>
                  <RadioGroup defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one" className={"font-normal"}>
                        Tất cả
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two" className={"font-normal"}>
                        Có bảo hành
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three" className={"font-normal"}>
                        Không bảo hành
                      </Label>
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <div className={"col-span-4"}>
        <DataTableDemo></DataTableDemo>
      </div>
    </Container>
  );
}
