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
  deleteCategory,
  updateCategory,
} from "@/pages/product/api/categoryApi.ts";
import { Fragment, useEffect, useState } from "react";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation.tsx";
import { toast } from "react-toastify";

interface ICategoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isAdd: boolean;
  listCategories: Category[];
  category?: Category;
  actionSuccess?: () => void;
}

export default function CategoryModal({
  isOpen,
  onOpenChange,
  isAdd,
  listCategories,
  category,
  actionSuccess,
}: ICategoryModalProps) {
  const [parentId, setParentId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setParentId(category.parentId);
    }
  }, [category]);

  const CallApiAddCategory = async (category: CategoryCreate) => {
    try {
      setIsLoading(true);
      await createCategory(category);
      setIsLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const CallApiUpdateCategory = async (category: Category) => {
    try {
      setIsLoading(true);
      await updateCategory(category);
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const CallApiDeleteCategory = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteCategory(id);
      toast.success("Xóa thành công");
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    } finally {
      setIsLoading(false);
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
        if (actionSuccess) actionSuccess();
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
        if (actionSuccess) actionSuccess();
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const handleClickBtnDelete = () => {
    CallApiDeleteCategory(category?.id as number)
      .then(() => {
        onOpenChange(false);
        if (actionSuccess) actionSuccess();
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        toast.error(error.response.data.message);
      });
  };

  return (
    <Fragment>
      {isLoading && <LoadingAnimation />}
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
                isAdd={false}
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
              <Button
                className={"bg-red-500 hover:bg-red-600"}
                onClick={() => handleClickBtnDelete()}
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
    </Fragment>
  );
}
