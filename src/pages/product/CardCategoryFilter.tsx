import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { CheckBoxWithText } from "@/components/CheckBoxWithText.tsx";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export interface CategoryFilter {
  id: number;
  name: string;
  children: CategoryFilter[];
}

//Mock data
const categories: CategoryFilter[] = [
  {
    id: 1,
    name: "Laptop",
    children: [
      {
        id: 2,
        name: "Dell",
        children: [
          {
            id: 14,
            name: "Dell Inspiron",
            children: [],
          },
          {
            id: 15,
            name: "Dell Vostro",
            children: [],
          },
        ],
      },
      {
        id: 3,
        name: "HP",
        children: [],
      },
      {
        id: 4,
        name: "MSI",
        children: [],
      },
      {
        id: 5,
        name: "Lenovo",
        children: [],
      },
      {
        id: 6,
        name: "Asus",
        children: [],
      },
      {
        id: 7,
        name: "Acer",
        children: [],
      },
    ],
  },
  {
    id: 8,
    name: "Điện thoại",
    children: [
      {
        id: 9,
        name: "Samsung",
        children: [],
      },
      {
        id: 10,
        name: "Iphone",
        children: [],
      },
      {
        id: 11,
        name: "Xiaomi",
        children: [],
      },
      {
        id: 12,
        name: "Oppo",
        children: [],
      },
      {
        id: 13,
        name: "Vsmart",
        children: [],
      },
    ],
  },
];

export const CardCategoryFilter = () => {
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
              <div style={{ transform: "translateX(-20px)" }}>
                {categories.map((category) => (
                  <CardCategoryFilterItem
                    key={category.id}
                    category={category}
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
}: {
  category: CategoryFilter;
}) => {
  // State để quản lý việc đóng/mở item con
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className="space-y-2 pl-4">
      <div
        className="relative group flex items-center justify-start"
        style={{ height: "30px" }}
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
        <div className={"flex-1"}>
          <CheckBoxWithText id={category.id.toString()}>
            {category.name}
          </CheckBoxWithText>
        </div>

        <button
          className="hidden group-hover:flex items-center justify-center rounded-md hover:bg-gray-200 "
          title="Edit"
          style={{ width: "30px", height: "30px" }}
        >
          ✎
        </button>
      </div>

      {/* Hiển thị các item con nếu isOpen là true */}
      <div style={{ display: isOpen ? "block" : "none" }}>
        {category.children.map((child) => (
          <CardCategoryFilterItem key={child.id} category={child} />
        ))}
      </div>
    </div>
  );
};
