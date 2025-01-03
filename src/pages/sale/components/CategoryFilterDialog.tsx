import { Category } from "@/types/category/category.ts";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDownIcon, ChevronUpIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

interface CategoryFilterDialogProps {
  onChange: (value: number) => void;
  isOpen: boolean;
  onClose: () => void;
  listCategories: Category[];
  value: number;
}
export const CategoryFilterDialog = ({
  onChange,
  isOpen,
  onClose,
  listCategories,
  value,
}: CategoryFilterDialogProps) => {
  const [categorySelected, setCategorySelected] = useState<number>(value);
  const [searchText, setSearchText] = useState<string>("");

  const handleClickCategory = (id: number) => {
    setCategorySelected(id);
    onChange(id);
    onClose();
  };

  const normalizeText = (text: string): string => {
    return text
      .normalize("NFD") // Tách ký tự và dấu thành dạng riêng biệt.
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu (chỉ giữ lại ký tự gốc).
      .replace(/đ/g, "d") // Thay thế 'đ' thành 'd'.
      .replace(/Đ/g, "D") // Thay thế 'Đ' thành 'D' (nếu có).
      .toLowerCase(); // Chuyển tất cả thành chữ thường.
  };

  const filterCategories = (
    categories: Category[],
    searchText: string,
  ): Category[] => {
    if (!searchText) return categories;

    const normalizedSearchText = normalizeText(searchText);

    return categories
      .map((category) => {
        const normalizedCategoryName = normalizeText(category.name);
        console.log(normalizedCategoryName);
        const filteredChildren = filterCategories(
          category.children,
          searchText,
        );

        const isMatch = normalizedCategoryName.includes(normalizedSearchText);

        if (isMatch || filteredChildren.length > 0) {
          return { ...category, children: filteredChildren };
        }

        return null;
      })
      .filter((category) => category !== null) as Category[];
  };
  const filteredCategories = filterCategories(listCategories, searchText);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chọn Nhóm Hàng</DialogTitle>
        </DialogHeader>
        <div className="relative flex items-center">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            className={"pl-9"}
            placeholder={"Theo nhóm hàng"}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div
          className="group flex items-center justify-start hover:bg-gray-100 hover:cursor-pointer"
          style={{ height: "30px" }}
          onClick={() => {
            handleClickCategory(0);
          }}
        >
          {categorySelected === 0 ? (
            <label className={"font-bold text-blue-500 ml-6"}>Tất cả</label>
          ) : (
            <label className={"ml-6"}>Tất cả</label>
          )}
        </div>
        {/*Dịch qua trái 12px*/}
        <ScrollArea
          style={{
            transform: "translateX(-16px)",
            height: "150px", // Chiều cao cố định
            maxHeight: "200px", // Chiều cao tối đa (nếu cần)
            width: "calc(100% + 16px)",
            overflow: "auto", // Tự động cuộn khi nội dung vượt quá chiều cao
          }}
        >
          {filteredCategories.map((category) => (
            <CardCategoryFilterItem
              key={category.id}
              category={category}
              idSelected={categorySelected}
              onClick={handleClickCategory}
              searchText={searchText}
            />
          ))}
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Item category filter
export const CardCategoryFilterItem = ({
  category,
  idSelected,
  onClick,
  searchText,
}: {
  category: Category;
  idSelected?: number;
  onClick?: (id: number) => void;
  searchText: string;
}) => {
  // State để quản lý việc đóng/mở item con
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (searchText.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchText]);

  return (
    <div className="space-y-2 pl-4">
      <div
        className="relative group flex items-center justify-start hover:bg-gray-100 hover:cursor-pointer"
        style={{
          height: "30px",
          padding: "0px 5px",
          backgroundColor: idSelected === category.id ? "#f0f0f0" : "",
        }}
        onClick={() => onClick && onClick(category.id)}
      >
        {/* Button toggle ở phía trước */}
        {category.children && category.children.length > 0 ? (
          <button
            className="mr-2 text-gray-500 hover:text-gray-700"
            style={{ width: "12px", height: "16px" }}
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen();
            }}
          >
            {isOpen ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div style={{ width: "20px" }}></div>
        )}
        <div className={"flex-1 ml-1"}>
          {idSelected === category.id ? (
            <label className={"font-bold text-blue-600"}>{category.name}</label>
          ) : (
            <label>{category.name}</label>
          )}
        </div>
      </div>

      {/* Hiển thị các item con nếu isOpen là true */}
      <div style={{ display: isOpen ? "block" : "none" }}>
        {category.children.map((child) => (
          <CardCategoryFilterItem
            key={child.id}
            category={child}
            idSelected={idSelected}
            onClick={onClick}
            searchText={searchText}
          />
        ))}
      </div>
    </div>
  );
};
