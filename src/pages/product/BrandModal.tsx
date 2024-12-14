import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { BanIcon, FileInput, Plus, Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { BrandDTO } from "@/dto/brand/BrandDTO.ts";
import { useEffect, useState } from "react";

interface IBrandModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isAdd: boolean;
  brandUpdate?: BrandDTO;
}

export default function BrandModal({
  isOpen,
  onOpenChange,
  isAdd,
  brandUpdate,
}: IBrandModalProps) {
  const [brand, setBrand] = useState<BrandDTO>(new BrandDTO(0, ""));
  useEffect(() => {
    if (brandUpdate) {
      setBrand(brandUpdate);
    }
  }, [brandUpdate]);

  const handleSetNameBrand = (name: string) => {
    setBrand((prev) => ({ ...prev, name }));
  };

  const handleCreateBrand = () => {
    alert(`Create brand: ${brand.name}`);
  };

  const handleUpdateBrand = () => {
    alert(`Update brand: ${brand.name}`);
  };

  const handleDeleteBrand = () => {
    alert(`Delete brand: ${brand.name}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col space-y-2">
        <DialogHeader>
          {isAdd ? (
            <DialogTitle>Thêm mới thương hiệu</DialogTitle>
          ) : (
            <DialogTitle>Chỉnh sửa thương hiệu</DialogTitle>
          )}
        </DialogHeader>
        <div className={"flex flex-col space-y-6"}>
          <div className={"flex flex-row space-x-4"}>
            <label className={"w-5/12 font-semibold"}>Tên thương hiệu</label>
            <Input
              className={""}
              placeholder={""}
              value={brand.name}
              onChange={(e) => {
                handleSetNameBrand(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter className="">
          {isAdd && (
            <Button
              className={"bg-green-500 hover:bg-green-600"}
              onClick={() => handleCreateBrand()}
            >
              <Plus />
              Thêm mới
            </Button>
          )}
          {!isAdd && (
            <Button
              className={"bg-green-500 hover:bg-green-600"}
              onClick={() => handleUpdateBrand()}
            >
              <FileInput />
              Lưu
            </Button>
          )}
          {!isAdd && (
            <Button
              className={"bg-red-500 hover:bg-red-600"}
              onClick={() => handleDeleteBrand()}
            >
              <Trash2Icon />
              Xóa
            </Button>
          )}
          <Button
            className={"bg-gray-500 hover:bg-gray-600"}
            onClick={() => onOpenChange(false)}
          >
            <BanIcon />
            Bỏ qua
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
