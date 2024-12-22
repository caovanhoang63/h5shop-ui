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
import { Category, CategoryCreate } from "@/types/category/category.ts";
import {
  createCategory,
  updateCategory,
} from "@/pages/product/api/categoryApi.ts";
import { useEffect, useState } from "react";

interface ICategoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isAdd: boolean;
  listCategories: Category[];
  category?: Category;
}

export default function CategoryModal({
  isOpen,
  onOpenChange,
  isAdd,
  listCategories,
  category,
}: ICategoryModalProps) {
  const [parentId, setParentId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setParentId(category.parentId);
    }
  }, [category]);

  const CallApiAddCategory = async (category: CategoryCreate) => {
    try {
      await createCategory(category);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const CallApiUpdateCategory = async (category: Category) => {
    try {
      await updateCategory(category);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleChooseParent = (id: number | null) => {
    setParentId(id);
  };

  const handleClickBtnAdd = () => {
    CallApiAddCategory({
      name: name,
      parentId: parentId,
    } as CategoryCreate)
      .then(() => {
        onOpenChange(false);
        alert("Thêm mới thành công");
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const handleClickBtnUpdate = () => {
    CallApiUpdateCategory({
      id: category?.id,
      name: name,
      parentId: parentId,
    } as Category)
      .then(() => {
        onOpenChange(false);
        alert("Chỉnh sửa thành công");
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

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
            <Input
              className={""}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={""}
            />
          </div>
          <div className={"flex flex-row space-x-4"}>
            <label className={"w-4/12 font-semibold"}>Nhóm cha</label>
            <CardCategorySelect
              listCategories={listCategories}
              setParentId={handleChooseParent}
              parentIdSelected={parentId}
            />
          </div>
        </div>
        <DialogFooter className="">
          {isAdd && (
            <Button
              className={"bg-green-500 hover:bg-green-600"}
              onClick={() => handleClickBtnAdd()}
            >
              <Plus />
              Thêm mới
            </Button>
          )}
          {!isAdd && (
            <Button
              className={"bg-green-500 hover:bg-green-600"}
              onClick={() => handleClickBtnUpdate()}
            >
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
