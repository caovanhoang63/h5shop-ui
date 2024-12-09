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
import { BrandCreateDTO, BrandDTO } from "@/dto/brand/BrandDTO.ts";

interface IBrandModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isAdd: boolean;
  brandUpdate?: BrandDTO;
  createBrand?: (brand: BrandCreateDTO) => void;
  updateBrand?: (brand: BrandDTO) => void;
  deleteBrand?: (brandId: string) => void;
}

export default function BrandModal({
  isOpen,
  onOpenChange,
  isAdd,
}: IBrandModalProps) {
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
            <label className={"w-4/12 font-semibold"}>Tên thương hiệu</label>
            <Input className={""} placeholder={""} />
          </div>
        </div>
        <DialogFooter className="">
          {isAdd && (
            <Button className={"bg-green-500 hover:bg-green-600"}>
              <Plus />
              Thêm mới
            </Button>
          )}
          {!isAdd && (
            <Button className={"bg-green-500 hover:bg-green-600"}>
              <FileInput />
              Lưu
            </Button>
          )}
          {!isAdd && (
            <Button className={"bg-red-500 hover:bg-red-600"}>
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
