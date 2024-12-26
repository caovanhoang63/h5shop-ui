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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Plus, Trash2Icon } from "lucide-react";
import { InputUploadImage } from "@/components/InputUploadImage.tsx";
import { ItemWholeSalePrice } from "@/pages/product/ItemWholeSalePrice.tsx";
import {
  SkuAttrCreate,
  SkuCreate,
  SkuWholesalePriceCreate,
} from "@/types/spu/spuUpsert.ts";
import { Image } from "@/types/image.ts";

export interface ItemSkuProps {
  onDeleted: () => void;
  attribute: SkuAttrCreate[];
  sku: SkuCreate;
  indexSku: number;
  setSku: (index: number, sku: SkuCreate) => void;
}

export const ItemSku = ({
  onDeleted,
  attribute,
  sku,
  indexSku,
  setSku,
}: ItemSkuProps) => {
  const [attrSelected, setAttrSelected] = useState<string[]>(
    new Array(attribute.length).fill(""),
  );
  const [wholeSalePrice, setWholeSalePrice] = useState<
    SkuWholesalePriceCreate[]
  >([]);
  const [price, setPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [skuTierIdx, setSkuTierIdx] = useState<number[]>([]);
  const [image, setImage] = useState<Image>();

  useEffect(() => {
    setSkuTierIdx(new Array(attribute.length).fill(0));
    if (sku.skuTierIdx) {
      // gan gia tri skuTierIdx, neu length cua skuTierIdx < length cua attribute thi gan 0
      const newSkuTierIdx = new Array(attribute.length).fill(0);
      sku.skuTierIdx.map((v, i) => {
        newSkuTierIdx[i] = v;
      });
      setSkuTierIdx(newSkuTierIdx);
    }

    // Attribute selected
    const newAttrSelected = new Array(attribute.length).fill("");
    newAttrSelected.map((_, index) => {
      if (sku.skuTierIdx) {
        newAttrSelected[index] = attribute[index].value[sku.skuTierIdx[index]];
      }
    });
    setAttrSelected(newAttrSelected);

    // Price, Cost, Stock
    setPrice(sku.price);
    setCostPrice(sku.costPrice);
    setStock(sku.stock);

    // WholeSalePrice
    if (sku.wholesalePrices) {
      setWholeSalePrice(sku.wholesalePrices);
    }

    // Image
    if (sku.images) {
      setImage(sku.images[0]);
    }
  }, [sku]);

  const handleSelectAttr = (index: number, value: string) => {
    setAttrSelected((prev) => prev.map((v, i) => (i === index ? value : v)));
    // find index of skuAttrCreate
    const indexAttr = attribute[index].value.findIndex((v) => v === value);
    console.log(indexAttr);
    setSkuTierIdx((prev) => prev.map((v, i) => (i === index ? indexAttr : v)));

    const newSkuTierIdx = skuTierIdx.map((v, i) =>
      i === index ? indexAttr : v,
    );
    setSku(indexSku, { ...sku, skuTierIdx: newSkuTierIdx });
  };

  const handleAddWholeSalePrice = () => {
    setWholeSalePrice((prev) => [
      ...prev,
      {
        skuId: 0,
        minQuantity: 0,
        price: 0,
      } as SkuWholesalePriceCreate,
    ]);

    const newWholeSalePrice = [...wholeSalePrice, { minQuantity: 0, price: 0 }];
    setSku(indexSku, {
      ...sku,
      wholesalePrices: newWholeSalePrice,
    } as SkuCreate);
  };

  const handleDeleteWholeSalePrice = (index: number) => {
    setWholeSalePrice((prev) => prev.filter((_, i) => i !== index));

    const newWholeSalePrice = wholeSalePrice.filter((_, i) => i !== index);
    setSku(indexSku, {
      ...sku,
      wholesalePrices: newWholeSalePrice,
    } as SkuCreate);
  };

  const handleSetPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: number = Number(e.target.value);
    if (isNaN(newValue)) {
      return;
    }
    setPrice(newValue);
    setSku(indexSku, { ...sku, price: newValue });
  };

  const handleSetCostPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: number = Number(e.target.value);
    if (isNaN(newValue)) {
      return;
    }
    setCostPrice(newValue);
    setSku(indexSku, { ...sku, costPrice: newValue });
  };

  const handleSetStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: number = Number(e.target.value);
    if (isNaN(newValue)) {
      return;
    }
    setStock(newValue);
    setSku(indexSku, { ...sku, stock: newValue });
  };

  const handleSetImage = (image: Image) => {
    setImage(image);
    setSku(indexSku, {
      ...sku,
      images: [image],
    });
  };

  const handleSetWholeSalePrice = (
    index: number,
    wholeSalePriceParam: SkuWholesalePriceCreate,
  ) => {
    setWholeSalePrice((prev) =>
      prev.map((v, i) => (i === index ? wholeSalePriceParam : v)),
    );
    const newWholeSalePrice = wholeSalePrice.map((v, i) =>
      i === index ? wholeSalePriceParam : v,
    );
    setSku(indexSku, {
      ...sku,
      wholesalePrices: newWholeSalePrice,
    } as SkuCreate);
  };

  return (
    <div className={"flex flex-row space-x-10"}>
      <div>
        {/* Upload Image */}
        <InputUploadImage image={image} setImage={handleSetImage} />
      </div>
      <div className={"flex flex-1 flex-col space-y-4"}>
        <div className={"flex flex-row space-x-12"}>
          <div className={"flex flex-col flex-1 space-y-4"}>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"} htmlFor="name">
                Mã vạch
              </Label>
              <Input id="name" className={"h-8"} />
            </div>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"} htmlFor="name">
                Tên sản phẩm
              </Label>
              <Input
                id="name"
                className={"h-8"}
                disabled={true}
                value={attrSelected.filter((item) => item !== "").join(" - ")}
              />
            </div>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"} htmlFor="name">
                Vị trí
              </Label>
              <Input id="name" className={"h-8"} />
            </div>
            <Card>
              <CardContent className={"pb-0"}>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className={"hover:no-underline"}>
                      <div className={"flex flex-row"}>
                        <Label htmlFor="name">Thuộc tính</Label>
                        <Label className={"ml-8"} htmlFor="name">
                          {attrSelected
                            .filter((item) => item !== "")
                            .join(" - ")}
                        </Label>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className={"p-1 space-y-2 pb-4"}>
                      {attribute.map((item, index) => (
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
                            value={attrSelected[index]}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={"Chọn thuộc tính"}
                              ></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {item.value.map((value, index) => (
                                <SelectItem
                                  key={index}
                                  value={
                                    value ? value.toString() : index.toString()
                                  }
                                >
                                  {value ? value : "Chưa có giá trị"}
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
          </div>
          <div className={"flex flex-col flex-1 space-y-4"}>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"}>Giá vốn (VND)</Label>
              <Input
                id="name"
                className={"h-8"}
                value={costPrice}
                onChange={(e) => handleSetCostPrice(e)}
              />
            </div>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"} htmlFor="name">
                Giá bán (VND)
              </Label>
              <Input
                id="name"
                value={price}
                className={"h-8"}
                onChange={(e) => handleSetPrice(e)}
              />
            </div>
            <div className={"flex flex-row items-center"}>
              <Label className={"w-5/12"} htmlFor="name">
                Tồn kho
              </Label>
              <Input
                id="name"
                value={stock}
                className={"h-8"}
                onChange={(e) => handleSetStock(e)}
              />
            </div>
            <Card>
              <CardContent className={"pb-0"}>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className={"hover:no-underline"}>
                      <div className={"flex flex-row"}>
                        <Label htmlFor="name">Thiết lập giá bán sỉ</Label>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className={"p-1 space-y-2 pb-4"}>
                      <div className={"flex flex-row items-center"}>
                        <Label className={"w-4/12"} htmlFor="name">
                          Số lượng min
                        </Label>
                        <Label className={"w-3/12"} htmlFor="name">
                          Giá
                        </Label>
                      </div>
                      {wholeSalePrice.map((item, index) => (
                        <ItemWholeSalePrice
                          key={index}
                          onDeleted={() => {
                            handleDeleteWholeSalePrice(index);
                          }}
                          wholeSalePrice={item}
                          indexWholeSalePrice={index}
                          setWholeSalePrice={handleSetWholeSalePrice}
                        />
                      ))}
                      <Button
                        className={"bg-green-500 hover:bg-green-600 h-8"}
                        onClick={handleAddWholeSalePrice}
                      >
                        <Plus />
                        Thêm giá sỉ
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* button */}
        <div className={"flex flex-row space-x-2 justify-end"}>
          <Button
            className={"bg-red-500 hover:bg-red-600"}
            onClick={() => onDeleted()}
          >
            <Trash2Icon />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};
