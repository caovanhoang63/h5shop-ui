import Container from "@/layouts/components/Container.tsx";
import {
  FileInput,
  FileOutputIcon,
  MenuIcon,
  Plus,
  Search,
} from "lucide-react";
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
import { DataTableDemo } from "@/pages/product/DataTable.tsx";
import { DatePickerWithRange } from "@/components/DatePickerWithRange.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { TimeDropdown } from "@/pages/partner/components/TimeDropdown.tsx";
import { useState } from "react";
import PartnerDataTable from "@/pages/partner/components/PartnerDataTable.tsx";

export default function PartnerPage() {
  const [selectedTime, setSelectedTime] = useState("Toàn thời gian");

  const handleTimeSelect = (value: string) => {
    setSelectedTime(value);
  };

  return (
    <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
      <div className={"text-2xl col-span-1 font-bold"}>
        <p>Nhà cung cấp</p>
      </div>
      <div className={"col-span-4 w-full flex  justify-between"}>
        <div className="relative flex items-center max-w-80">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input className={"pl-9"} placeholder={"Theo mã, tên, điện thoại"} />
        </div>
        <div className={"flex space-x-2"}>
          <Button className={"bg-green-500"}>
            <Plus />
            Nhà cung cấp
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
                  Nhóm NCC
                </AccordionTrigger>
                <AccordionContent className={"pb-0"}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full font-normal flex justify-start "
                      >
                        Chọn nhóm
                      </Button>
                    </PopoverTrigger>
                  </Popover>
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
                  Tổng mua
                </AccordionTrigger>
                <AccordionContent className={"py-1 px-1 flex flex-col gap-2"}>
                  <div className={"space-y-1"}>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="maxWidth">Từ</Label>
                      <Input
                        id="from"
                        placeholder="Giá trị"
                        className="col-span-3 bg-background"
                      />{" "}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="maxWidth">Đến</Label>
                      <Input
                        id="from"
                        placeholder="Giá trị"
                        className="col-span-3 bg-background"
                      />{" "}
                    </div>
                  </div>
                  <RadioGroup defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full font-normal flex justify-start "
                          >
                            {selectedTime}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[600px] p-0" align="start">
                          <TimeDropdown
                            selectedValue={selectedTime}
                            onSelect={handleTimeSelect}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <DatePickerWithRange
                        className={"w-full"}
                      ></DatePickerWithRange>
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
                  Nợ hiện tại
                </AccordionTrigger>
                <AccordionContent className={"py-1 px-1 flex flex-col gap-2"}>
                  <div className={"space-y-1"}>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="maxWidth">Từ</Label>
                      <Input
                        id="from"
                        placeholder="Giá trị"
                        className="col-span-3 bg-background"
                      />{" "}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="maxWidth">Đến</Label>
                      <Input
                        id="from"
                        placeholder="Giá trị"
                        className="col-span-3 bg-background"
                      />{" "}
                    </div>
                  </div>
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
                        Đang hoạt động
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three" className={"font-normal"}>
                        Ngừng hoạt động
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
        <PartnerDataTable></PartnerDataTable>
      </div>
    </Container>
  );
}
