import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CirclePlus,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import CategoryModal from "@/pages/product/CategoryModal.tsx";

export interface CategoryFilter {
  id: number;
  name: string;
  children: CategoryFilter[];
  parentID: number | undefined;
  checked: boolean;
}

//Mock data
const categories: CategoryFilter[] = [
  {
    id: 1,
    name: "Laptop",
    checked: false,
    parentID: undefined,
    children: [
      {
        id: 2,
        name: "Dell",
        checked: false,
        parentID: 1,
        children: [
          {
            id: 14,
            name: "Dell Inspiron",
            checked: false,
            parentID: 2,
            children: [],
          },
          {
            id: 15,
            checked: false,
            name: "Dell Vostro",
            parentID: 2,
            children: [],
          },
        ],
      },
      {
        id: 3,
        checked: false,
        name: "HP",
        parentID: 1,
        children: [],
      },
      {
        id: 4,
        checked: false,
        name: "MSI",
        parentID: 1,
        children: [],
      },
      {
        id: 5,
        checked: false,
        name: "Lenovo",
        parentID: 1,
        children: [],
      },
      {
        id: 6,
        checked: false,
        name: "Asus",
        parentID: 1,
        children: [],
      },
      {
        id: 7,
        checked: false,
        name: "Acer",
        parentID: 1,
        children: [],
      },
    ],
  },
  {
    id: 8,
    checked: false,
    name: "Điện thoại",
    parentID: undefined,
    children: [
      {
        id: 9,
        checked: false,
        parentID: 8,
        name: "Samsung",
        children: [],
      },
      {
        id: 10,
        checked: false,
        parentID: 8,
        name: "Iphone",
        children: [],
      },
      {
        id: 11,
        checked: false,
        parentID: 8,
        name: "Xiaomi",
        children: [],
      },
      {
        id: 12,
        checked: false,
        parentID: 8,
        name: "Oppo",
        children: [],
      },
      {
        id: 13,
        checked: false,
        parentID: 8,
        name: "Vsmart",
        children: [],
      },
    ],
  },
];

export const CardCategoryFilter = () => {
  const [categoryState, setCategoryState] =
    useState<CategoryFilter[]>(categories);
  const [idCategorySelected, setIdCategorySelected] = useState<number>();
  const [searchText, setSearchText] = useState<string>("");
  const [isOpenModalAdd, setIsOpenModalAdd] = useState<boolean>(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState<boolean>(false);

  const handleClickCategory = (id: number) => {
    setCategoryState((prevState) => {
      return prevState.map((category) => {
        if (category.id === id) {
          category.checked = !category.checked;
        }
        return category;
      });
    });
    setIdCategorySelected(id);
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
    categories: CategoryFilter[],
    searchText: string,
  ): CategoryFilter[] => {
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
      .filter((category) => category !== null) as CategoryFilter[];
  };
  const filteredCategories = filterCategories(categoryState, searchText);

  const handleClickEditItem = (item: CategoryFilter) => {
    console.log(item);
    setIsOpenModalUpdate(true);
  };

  return (
    <Card>
      {/*Modal add*/}
      <CategoryModal
        isOpen={isOpenModalAdd}
        onOpenChange={setIsOpenModalAdd}
        isAdd={true}
      />
      {/*Modal update*/}
      <CategoryModal
        isOpen={isOpenModalUpdate}
        onOpenChange={setIsOpenModalUpdate}
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
                <label>Nhóm hàng</label>
                <button
                  className="flex flex-row items-center justify-center hover:bg-gray-200"
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "10px",
                    marginRight: "6px",
                  }}
                  onClick={() => setIsOpenModalAdd(true)}
                >
                  <CirclePlus className="w-5 h-5" />
                </button>
              </div>
            </AccordionTrigger>
            <AccordionContent className={"space-y-2 p-1"}>
              <div className="relative flex items-center">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  className={"pl-9"}
                  placeholder={"Theo mã, tên hàng"}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div
                className="group flex items-center justify-start hover:bg-gray-100 hover:cursor-pointer"
                style={{ height: "30px" }}
                onClick={() => {
                  setIdCategorySelected(0);
                }}
              >
                {idCategorySelected === 0 ? (
                  <label className={"font-bold text-green-500 ml-6"}>
                    Tất cả
                  </label>
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
                    idSelected={idCategorySelected}
                    onClick={handleClickCategory}
                    searchText={searchText}
                    onClickEdit={handleClickEditItem}
                  />
                ))}
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

// Item category filter
export const CardCategoryFilterItem = ({
  category,
  idSelected,
  onClick,
  searchText,
  onClickEdit,
}: {
  category: CategoryFilter;
  idSelected?: number;
  onClick?: (id: number) => void;
  searchText: string;
  onClickEdit: (item: CategoryFilter) => void;
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

        <button
          className="hidden group-hover:flex items-center justify-center rounded-md hover:bg-gray-200"
          title="Edit"
          style={{ width: "24px", height: "24px", borderRadius: "12px" }}
          onClick={(e) => {
            e.stopPropagation();
            onClickEdit(category);
          }}
        >
          ✎
        </button>
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
            onClickEdit={onClickEdit}
          />
        ))}
      </div>
    </div>
  );
};
