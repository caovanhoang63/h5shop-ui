import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spu } from "@/types/spu.ts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import InputWithBotBorder from "@/components/InputWithBotBorder.tsx";
import { BanIcon, FileInput, Plus, Trash2Icon } from "lucide-react";
import { ItemAttrSku } from "@/pages/product/ItemAttrSku.tsx";
import { ItemSku } from "@/pages/product/ItemSku.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { CardCategorySelect } from "@/pages/product/CategorySelect.tsx";
import { InputUploadImage } from "@/components/InputUploadImage.tsx";
import { Category } from "@/types/category/category.ts";
import { Brand } from "@/types/brand/brand.ts";

interface ISpuModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  spu?: Spu;
  listCategories: Category[];
  listBrands: Brand[];
}

export default function SpuModal({
  isOpen,
  spu,
  onOpenChange,
  listCategories,
  listBrands,
}: ISpuModalProps) {
  const off: boolean = false;
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [attrs, setAttrs] = useState<string[]>([]);
  const [skus, setSkus] = useState<string[]>([""]);

  const handleAddAttr = () => {
    setAttrs((prev) => [...prev, ""]);
  };

  const handleDeleteAttr = (index: number) => {
    setAttrs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSku = () => {
    setSkus((prev) => [...prev, ""]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl min-h-[calc(100vh-30%)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="spu" className="grow">
          <TabsList className="grid w-full grid-cols-3">
            {off && <TabsTrigger value="info">Thông tin</TabsTrigger>}
            <TabsTrigger value="spu">Thông tin chung</TabsTrigger>
            <TabsTrigger value="attr">Thuộc tính</TabsTrigger>
            <TabsTrigger value="sku">Sản phẩm</TabsTrigger>
          </TabsList>
          {off && (
            <TabsContent value="info" className="space-y-2">
              <div>
                <h2 className={"text-xl text-primary"}>{spu?.name}</h2>
              </div>
              <div className={"flex space-x-5"}>
                <div className={"flex space-x-2"}>
                  <img
                    className={"size-80 border-gray-400 border-2"}
                    src={spu?.images?.[imgIndex].url || "image-placeholder.png"}
                    alt={"Hình sản phẩm "}
                  />
                  <ScrollArea className="max-h-80 pr-4">
                    <ul className={"space-y-1 "}>
                      {spu?.images?.map((image, index) => {
                        return (
                          <li
                            className={`hover:opacity-50 border-gray-400 border-2 cursor-pointer ${index == imgIndex ? "opacity-50" : ""} `}
                            onClick={() => setImgIndex(index)}
                          >
                            <img className={"size-20"} src={image.url} alt="" />
                          </li>
                        );
                      })}
                    </ul>
                  </ScrollArea>
                </div>
                <div className={"space-y-4"}>
                  <form>
                    <div>
                      <InputWithBotBorder
                        readonly={true}
                        className={"font-bold"}
                        label={"Mã:"}
                        value={spu?.id.toString() || ""}
                      />
                      <InputWithBotBorder
                        label={"Mã vạch:"}
                        value={"21232124"}
                      />
                      <InputWithBotBorder
                        label={"Loại hàng:"}
                        value={"Máy ảnh"}
                      />
                      <InputWithBotBorder
                        label={"Thương hiệu:"}
                        value={"Canon"}
                      />
                      <InputWithBotBorder
                        label={"Nhà cung cấp:"}
                        value={"Cty TNHH Một Mình Tao "}
                      />
                      <InputWithBotBorder
                        label={"Trọng lượng:"}
                        value={"1.5kg"}
                      />
                    </div>
                    <div>
                      <InputWithBotBorder
                        label={"Trọng lượng:"}
                        value={"1.5kg"}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </TabsContent>
          )}
          <TabsContent value="spu">
            <Card>
              <CardContent className="space-y-2 space-x-12 flex flex-row mt-6">
                <div>
                  <InputUploadImage height={"320px"} width={"320px"} />
                </div>
                <div className={"flex flex-row flex-1 space-x-12"}>
                  <div className={"flex flex-col flex-1 space-y-5"}>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-5/12"} htmlFor="name">
                        Mã vạch
                      </Label>
                      <Input id="name" />
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-5/12"} htmlFor="name">
                        Tên sản phẩm
                      </Label>
                      <Input id="name" />
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-5/12"} htmlFor="name">
                        Thương hiệu
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          console.log(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={"Chọn thương hiệu"} />
                        </SelectTrigger>
                        <SelectContent>
                          {listBrands.map((brand) => (
                            <SelectItem value={brand.id.toString()}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-5/12"} htmlFor="name">
                        Nhóm hàng
                      </Label>
                      <CardCategorySelect listCategories={listCategories} />
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-5/12"} htmlFor="name">
                        Vị trí
                      </Label>
                      <Input id="name" />
                    </div>
                  </div>
                  <div className={"flex flex-col flex-1 space-y-5"}>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-6/12"} htmlFor="name">
                        Giá vốn (VND)
                      </Label>
                      <Input id="name" />
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-6/12"} htmlFor="name">
                        Giá bán (VND)
                      </Label>
                      <Input id="name" />
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-6/12"} htmlFor="name">
                        Tổng mức tồn kho
                      </Label>
                      <Input id="name" />
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-6/12"} htmlFor="name">
                        Mô tả
                      </Label>
                      <Input id="name" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="attr">
            <Card>
              <CardHeader>
                <Label style={{ fontSize: "16px" }}>Danh sách thuộc tính</Label>
              </CardHeader>
              <CardContent className="space-y-4">
                {attrs.map((_, index) => (
                  <ItemAttrSku
                    key={index}
                    onDeleted={() => handleDeleteAttr(index)}
                  />
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  className={"bg-green-500 hover:bg-green-600"}
                  onClick={() => handleAddAttr()}
                >
                  <Plus />
                  Thêm thuộc tính
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="sku">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-20">
                <ScrollArea style={{ height: "360px" }}>
                  <div className={"flex flex-col p-4 space-y-20"}>
                    {skus.map((_, index) => (
                      <ItemSku key={index} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button
                  className={"bg-green-500 hover:bg-green-600"}
                  onClick={() => handleAddSku()}
                >
                  <Plus />
                  Thêm sản phẩm
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <DialogFooter className="">
          <div className={"flex flex-row space-x-2 justify-end"}>
            <Button className={"bg-green-500 hover:bg-green-600"}>
              <Plus />
              Thêm mới
            </Button>
            <Button className={"bg-green-500 hover:bg-green-600"}>
              <FileInput />
              Lưu
            </Button>
            <Button className={"bg-red-500 hover:bg-red-600"}>
              <Trash2Icon />
              Xóa
            </Button>
            <Button
              className={"bg-gray-500 hover:bg-gray-600"}
              onClick={() => onOpenChange(false)}
            >
              <BanIcon />
              Bỏ qua
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
