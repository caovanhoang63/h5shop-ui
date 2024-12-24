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
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
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
import { SkuAttrCreate, SkuCreate, SpuUpsert } from "@/types/spu/spuUpsert.ts";

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
  const [id, setId] = useState<number>();
  const [name, setName] = useState<string>("");
  const [brandId, setBrandId] = useState<number>();
  const [categoryId, setCategoryId] = useState<number>();
  const [description, setDescription] = useState<string>("");
  const [metadata, setMetadata] = useState({
    position: "",
  });
  const [skus, setSkus] = useState<SkuCreate[]>([]);
  const [attrs, setAttrs] = useState<SkuAttrCreate[]>([]);

  const [spuUpsert, setSpuUpsert] = useState<SpuUpsert>();

  useEffect(() => {
    if (spu) {
      setId(spu.id);
      setName(spu.name);
      setBrandId(1);
      setCategoryId(spu.categoryId);
    }
  }, [spu]);

  const handleAddAttr = () => {
    setAttrs((prev) => [
      ...prev,
      {
        dataType: "text",
        value: [""],
      } as SkuAttrCreate,
    ]);
  };

  const handleDeleteAttr = (index: number) => {
    setAttrs((prev) => prev.filter((_, i) => i !== index));
    // Xoa skuTierIdx trong skus tuong ung
    setSkus((prev) =>
      prev.map((item) => {
        return {
          ...item,
          skuTierIdx: item.skuTierIdx?.filter((_, i) => i !== index),
        };
      }),
    );
  };

  const handleAddSku = () => {
    setSkus((prev) => [
      ...prev,
      {
        costPrice: 0,
        price: 0,
        stock: 0,
      } as SkuCreate,
    ]);
  };

  const handleSetCategory = (id: number | null) => {
    if (id) {
      setCategoryId(id);
    }
  };

  const mapSpuUpsert = () => {
    const spuTest = {
      id: id,
      name: name,
      description: description,
      categoryId: categoryId,
      brandId: brandId,
      metadata: metadata,
      skus: skus,
      attrs: attrs,
    };
    console.log(spuTest);

    if (id && name && categoryId && brandId) {
      setSpuUpsert({
        id: id,
        name: name,
        description: description,
        categoryId: categoryId,
        brandId: brandId,
        metadata: metadata,
        skus: skus,
        attrs: attrs,
      });
      console.log(spuUpsert);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl min-h-[calc(100vh-30%)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="spu" className="grow">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="spu">Thông tin chung</TabsTrigger>
            <TabsTrigger value="attr">Thuộc tính</TabsTrigger>
            <TabsTrigger value="sku">Sản phẩm</TabsTrigger>
          </TabsList>

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
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-5/12"} htmlFor="name">
                        Thương hiệu
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          console.log(value);
                          setBrandId(parseInt(value));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={"Chọn thương hiệu"} />
                        </SelectTrigger>
                        <SelectContent>
                          {listBrands.map((brand) => (
                            <SelectItem
                              value={brand.id.toString()}
                              key={brand.id}
                            >
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
                      <CardCategorySelect
                        listCategories={listCategories}
                        isAdd={true}
                        setParentId={handleSetCategory}
                      />
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-5/12"}>Vị trí</Label>
                      <Input
                        value={metadata.position}
                        onChange={(e) => {
                          setMetadata({
                            ...metadata,
                            position: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className={"flex flex-col flex-1 space-y-5"}>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-6/12"} htmlFor="name">
                        Giá vốn (VND)
                      </Label>
                      <Input id="name" disabled={true} />
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-6/12"} htmlFor="name">
                        Giá bán (VND)
                      </Label>
                      <Input id="name" disabled={true} />
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-6/12"} htmlFor="name">
                        Tổng mức tồn kho
                      </Label>
                      <Input id="name" disabled={true} />
                    </div>
                    <div className={"flex flex-row items-center"}>
                      <Label className={"w-6/12"}>Mô tả</Label>
                      <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
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
                    attribute={attrs[index]}
                    indexAttr={index}
                    setAttribute={(index, attribute) => {
                      setAttrs((prev) =>
                        prev.map((item, i) => (i === index ? attribute : item)),
                      );
                    }}
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
                    {skus.map((item, index) => (
                      <ItemSku
                        key={index}
                        attribute={attrs}
                        indexSku={index}
                        sku={item}
                        setSku={(index, sku) => {
                          setSkus((prev) =>
                            prev.map((item, i) => (i === index ? sku : item)),
                          );
                        }}
                      />
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
            <Button
              className={"bg-green-500 hover:bg-green-600"}
              onClick={() => mapSpuUpsert()}
            >
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
