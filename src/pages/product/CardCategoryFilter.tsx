import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

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

  return (
    <Card>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className={"hover:no-underline"}>
              Nhóm hàng
            </AccordionTrigger>
            <AccordionContent className={"space-y-2"}>
              {/*Dịch qua trái 12px*/}
              <div
                style={{
                  transform: "translateX(-20px)",
                  width: "250px",
                }}
              >
                {categoryState.map((category) => (
                  <CardCategoryFilterItem
                    key={category.id}
                    category={category}
                    idSelected={idCategorySelected}
                    onClick={handleClickCategory}
                  />
                ))}
              </div>
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
}: {
  category: CategoryFilter;
  idSelected?: number;
  onClick?: (id: number) => void;
}) => {
  // State để quản lý việc đóng/mở item con
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className="space-y-2 pl-4">
      <div
        className="relative group flex items-center justify-start hover:bg-gray-100 hover:cursor-pointer"
        style={{ height: "30px", padding: "0px 5px" }}
        onClick={() => onClick && onClick(category.id)}
      >
        {/* Button toggle ở phía trước */}
        {category.children && category.children.length > 0 ? (
          <button
            onClick={toggleOpen}
            className="mr-2 text-gray-500 hover:text-gray-700"
            style={{ width: "12px", height: "16px" }}
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
            <label className={"font-bold text-green-500"}>
              {category.name}
            </label>
          ) : (
            <label>{category.name}</label>
          )}
        </div>

        <button
          className="hidden group-hover:flex items-center justify-center rounded-md hover:bg-gray-200"
          title="Edit"
          style={{ width: "30px", height: "30px", borderRadius: "15px" }}
          onClick={(e) => {
            e.stopPropagation();
            alert("Edit");
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
          />
        ))}
      </div>
    </div>
  );
};
