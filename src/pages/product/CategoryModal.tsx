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
import { CardCategorySelect } from "@/pages/product/CategorySelect.tsx";
import { Category } from "@/types/category/category.ts";

interface ICategoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isAdd: boolean;
  listCategories: Category[];
}

export default function CategoryModal({
  isOpen,
  onOpenChange,
  isAdd,
  listCategories,
}: ICategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col space-y-2">
        <DialogHeader>
          {isAdd ? (
            <DialogTitle>Thêm mới danh mục</DialogTitle>
          ) : (
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          )}
        </DialogHeader>
        <div className={"flex flex-col space-y-6"}>
          <div className={"flex flex-row space-x-4"}>
            <label className={"w-4/12 font-semibold"}>Tên nhóm</label>
            <Input className={""} placeholder={""} />
          </div>
          <div className={"flex flex-row space-x-4"}>
            <label className={"w-4/12 font-semibold"}>Nhóm cha</label>
            <CardCategorySelect listCategories={listCategories} />
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
