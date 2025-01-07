import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Category } from "@/types/category/category.ts";

export interface ICardCategorySelectProps {
  listCategories: Category[];
  isAdd: boolean;
  setParentId?: (id: number | null) => void;
  parentIdSelected?: number | null;
}

export const CardCategorySelect = ({
  listCategories,
  isAdd,
  setParentId,
  parentIdSelected,
}: ICardCategorySelectProps) => {
  const [idCategorySelected, setIdCategorySelected] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [listCate, setListCate] = useState<Category[]>([
    {
      id: 0,
      name: "Không chọn cha",
      parentId: null,
      children: [],
    },
  ]);

  useEffect(() => {
    if (isAdd) {
      setListCate(listCategories);
    } else {
      setListCate((prev) => [...prev, ...listCategories]);
    }
  }, [listCategories]);

  useEffect(() => {
    setCategoryName("");
    if (parentIdSelected === null) {
      setIdCategorySelected(0);
      setCategoryName("Không chọn cha");
    } else {
      setIdCategorySelected(parentIdSelected as number);

      const category = findCategoryById(
        listCategories,
        parentIdSelected as number,
      );
      if (category) {
        setCategoryName(category.name);
      }
    }
  }, [parentIdSelected]);

  // Đệ quy tìm kiếm category bằng id
  const findCategoryById = (
    categories: Category[],
    id: number,
  ): Category | null => {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === id) {
        return categories[i];
      } else {
        const found = findCategoryById(categories[i].children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleClickCategory = (id: number, name: string) => {
    setCategoryName(name);
    setIdCategorySelected(id);
    setIsOpen(false);
    if (setParentId) {
      if (id === 0) {
        setParentId(null);
      } else {
        setParentId(id);
      }
    }
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
  const filteredCategories = filterCategories(listCate, searchText);

  return (
    <Select open={isOpen} onOpenChange={setIsOpen} value={"0"}>
      <SelectTrigger>
        <SelectValue placeholder={"--Lựa chọn--"}>
          {categoryName ? categoryName : "--Lựa chọn--"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="relative flex items-center p-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            className={"pl-7"}
            placeholder={"Theo mã, tên hàng"}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/*Dịch qua trái 12px*/}
        <ScrollArea
          style={{
            transform: "translateX(-16px)",
            height: "200px", // Chiều cao cố định
            maxHeight: "200px", // Chiều cao tối đa (nếu cần)
            width: "calc(100% + 16px)",
            overflow: "auto", // Tự động cuộn khi nội dung vượt quá chiều cao
          }}
        >
          {filteredCategories.map((category) => (
            <CardCategorySelectItem
              key={category.id}
              category={category}
              idSelected={idCategorySelected}
              onClick={handleClickCategory}
              searchText={searchText}
            />
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

// Item category filter
export const CardCategorySelectItem = ({
  category,
  idSelected,
  onClick,
  searchText,
}: {
  category: Category;
  idSelected?: number;
  onClick?: (id: number, name: string) => void;
  searchText: string;
}) => {
  // State để quản lý việc đóng/mở item con
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    setIsOpen(true);
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
        onClick={() => onClick && onClick(category.id, category.name)}
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
          <CardCategorySelectItem
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
