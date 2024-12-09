import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import BrandModal from "@/pages/product/BrandModal.tsx";
import { BrandDTO } from "@/dto/brand/BrandDTO.ts";

const brands: BrandDTO[] = [
  { id: 0, name: "Tất cả" },
  { id: 1, name: "NVIDIA" },
  { id: 2, name: "Lenovo" },
  { id: 3, name: "SamSung" },
  { id: 4, name: "Huawei" },
  { id: 5, name: "Apple" },
  { id: 6, name: "Xiaomi" },
  { id: 7, name: "Oppo" },
  { id: 8, name: "Vivo" },
  { id: 9, name: "Realme" },
  { id: 10, name: "Asus" },
];

interface ICatalogProductProps {
  onChange: (value: string) => void;
}

export const CardBrandFilter = ({ onChange }: ICatalogProductProps) => {
  const [brandSelected, setBrandSelected] = useState<string>("0");
  const [isOpenModalAdd, setIsOpenModalAdd] = useState<boolean>(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState<boolean>(false);

  const handleSelectedBrand = (brandId: string) => {
    console.log(brandId);
    setBrandSelected(brandId);
    onChange(brandId);
  };

  const handleOpenModalAdd = () => {
    setIsOpenModalAdd(true);
  };

  const handleOpenModalUpdate = () => {
    setIsOpenModalUpdate(true);
  };

  const handleCloseModal = () => {
    setIsOpenModalAdd(false);
    setIsOpenModalUpdate(false);
  };

  return (
    <Card>
      <BrandModal
        isOpen={isOpenModalAdd}
        onOpenChange={handleCloseModal}
        isAdd={true}
      />
      <BrandModal
        isOpen={isOpenModalUpdate}
        onOpenChange={handleCloseModal}
        isAdd={false}
      />
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className={"hover:no-underline"}>
              <div
                className={"flex flex-row justify-between"}
                style={{ width: "100%" }}
              >
                <label>Thương hiệu</label>
                <button
                  className="flex flex-row items-center justify-center hover:bg-gray-200"
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "10px",
                    marginRight: "6px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModalAdd();
                  }}
                >
                  <CirclePlus className="w-5 h-5" />
                </button>
              </div>
            </AccordionTrigger>
            <AccordionContent className={"space-y-2"}>
              <ScrollArea style={{ height: "200px" }}>
                <RadioGroup defaultValue="0">
                  {brands.map((brand, index) => (
                    <div
                      key={index}
                      className="group flex items-center space-x-2"
                      style={{ height: "24px" }}
                    >
                      <RadioGroupItem
                        value={brand.id.toString()}
                        id={brand.name}
                        checked={brandSelected === brand.id.toString()}
                        onClick={() => handleSelectedBrand(brand.id.toString())}
                      />
                      <Label
                        htmlFor="option-one"
                        className={"font-normal flex-1"}
                      >
                        {brand.name}
                      </Label>
                      <button
                        className="hidden group-hover:flex items-center justify-center rounded-md hover:bg-gray-200"
                        title="Edit"
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "12px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModalUpdate();
                        }}
                      >
                        ✎
                      </button>
                      <div style={{ width: "1x" }}></div>
                    </div>
                  ))}
                </RadioGroup>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
