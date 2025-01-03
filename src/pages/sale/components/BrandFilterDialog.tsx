import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brand } from "@/types/brand/brand.ts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BrandFilterDialogProps {
  onChange: (value: number) => void;
  isOpen: boolean;
  onClose: () => void;
  list: Brand[];
  value: number;
}
export const BrandFilterDialog = ({
  onChange,
  isOpen,
  onClose,
  list,
  value,
}: BrandFilterDialogProps) => {
  const [brandSelected, setBrandSelected] = useState<number>(value);
  const [listBrandCpn, setListBrandCpn] = useState<Brand[]>([
    {
      id: 0,
      name: "Tất cả",
    },
  ]);

  const handleSelectBrand = (brandId: number) => {
    setBrandSelected(brandId);
    onChange(brandId);
    onClose();
  };

  useEffect(() => {
    setListBrandCpn([
      {
        id: 0,
        name: "Tất cả",
      },
      ...list,
    ]);
  }, [list]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chọn Thương Hiệu</DialogTitle>
        </DialogHeader>
        <div>
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
                  checked={brandSelected === brand.id}
                  onClick={() => handleSelectBrand(brand.id)}
                />
                <Label htmlFor="option-one" className={"font-normal flex-1"}>
                  {brand.name}
                </Label>
                <div style={{ width: "1x" }}></div>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
