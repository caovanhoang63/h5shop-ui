import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { FileInput, Trash2Icon } from "lucide-react";
import { InputUploadImage } from "@/components/InputUploadImage.tsx";

interface Attribute {
  id: number;
  name: string;
  value: Array<string | number>; // Chấp nhận cả chuỗi và số trong mảng
}

const dataTestAttribute: Attribute[] = [
  {
    id: 1,
    name: "Color",
    value: ["Red", "Blue", "Green"], // Chuỗi
  },
  {
    id: 2,
    name: "Size",
    value: ["S", "M", "L"], // Chuỗi
  },
  {
    id: 3,
    name: "Material",
    value: [16, 32, 24], // Số
  },
];

export const ItemSku = () => {
  const [attrSelected, setAttrSelected] = useState<string[]>(
    new Array(dataTestAttribute.length).fill(""),
  );

  const handleSelectAttr = (index: number, value: string) => {
    console.log("hello");
    setAttrSelected((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  return (
    <div className={"flex flex-row space-x-10"}>
      <div>
        {/* Upload Image */}
        <InputUploadImage />
      </div>
      <div className={"flex flex-1 flex-col space-y-4"}>
        <div className={"flex flex-row space-x-20"}>
          <div className={"flex flex-col flex-1 space-y-3"}>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"} htmlFor="name">
                Mã vạch
              </Label>
              <Input id="name" className={"h-7"} />
            </div>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"} htmlFor="name">
                Tên sản phẩm
              </Label>
              <Input id="name" className={"h-7"} />
            </div>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"} htmlFor="name">
                Vị trí
              </Label>
              <Input id="name" className={"h-7"} />
            </div>
          </div>
          <div className={"flex flex-col flex-1 space-y-3"}>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"} htmlFor="name">
                Giá vốn (VND)
              </Label>
              <Input id="name" className={"h-7"} />
            </div>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"} htmlFor="name">
                Giá bán (VND)
              </Label>
              <Input id="name" className={"h-7"} />
            </div>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"} htmlFor="name">
                Tồn kho
              </Label>
              <Input id="name" className={"h-7"} />
            </div>
          </div>
        </div>
        <Card>
          <CardContent className={"pb-0"}>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className={"hover:no-underline"}>
                  <div className={"flex flex-row"}>
                    <Label htmlFor="name">Thuộc tính</Label>
                    <Label className={"ml-8"} htmlFor="name">
                      {attrSelected.filter((item) => item !== "").join(" - ")}
                    </Label>
                  </div>
                </AccordionTrigger>
                <AccordionContent className={"p-1 space-y-2 pb-4"}>
                  {dataTestAttribute.map((item, index) => (
                    <div
                      key={index}
                      className={"flex flex-row justify-start items-center"}
                    >
                      <Label className={"w-3/12"} htmlFor="name">
                        {item.name}
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectAttr(index, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={"Chọn thuộc tính"} />
                        </SelectTrigger>
                        <SelectContent>
                          {item.value.map((value, index) => (
                            <SelectItem key={index} value={value.toString()}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        {/* button */}
        <div className={"flex flex-row space-x-2 justify-end"}>
          <Button className={"bg-green-500 hover:bg-green-600"}>
            <FileInput />
            Lưu
          </Button>
          <Button className={"bg-red-500 hover:bg-red-600"}>
            <Trash2Icon />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};
