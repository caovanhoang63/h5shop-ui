import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Brand } from "@/types/brand/brand.ts";

interface ICatalogProductProps {
  onChange: (value: string) => void;
  listBrands: Brand[];
  onClickEdit?: (item: Brand) => void;
  onClickAdd?: () => void;
}

export const CardBrandFilter = ({
  onChange,
  listBrands,
  onClickEdit,
  onClickAdd,
}: ICatalogProductProps) => {
  const [brandSelected, setBrandSelected] = useState<string>("0");
  const [listBrandCpn, setListBrandCpn] = useState<Brand[]>([
    {
      id: 0,
      name: "Tất cả",
    },
  ]);

  useEffect(() => {
    setListBrandCpn([
      {
        id: 0,
        name: "Tất cả",
      },
      ...listBrands,
    ]);
  }, [listBrands]);

  // fetch brand from API

  const handleSelectedBrand = (brandId: string) => {
    console.log(brandId);
    setBrandSelected(brandId);
    onChange(brandId);
  };

  return (
    <Card>
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
                    if (onClickAdd) {
                      onClickAdd();
                    }
                  }}
                >
                  <CirclePlus className="w-5 h-5" />
                </button>
              </div>
            </AccordionTrigger>
            <AccordionContent className={"space-y-2"}>
              <ScrollArea style={{ height: "200px" }}>
                <RadioGroup defaultValue="0">
                  {listBrandCpn.map((brand, index) => (
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
                          if (onClickEdit) onClickEdit(brand);
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
