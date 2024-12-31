import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  X,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefObject } from "react";
import { OrderGetDetail } from "@/types/order/orderGetDetail.ts";

export interface Tab {
  number: number;
  order: OrderGetDetail;
}

interface OrderTabsListProps {
  tabs: Tab[];
  activeTab: number;
  onTabChange: (index: number) => void;
  onDeleteTab: (index: number) => void;
  onAddTab: (type: string) => void;
  isOverflowing: boolean;
  scrollTabs: (direction: "left" | "right") => void;
  tabListRef: RefObject<HTMLDivElement>;
}

export const OrderTabsList = ({
  tabs,
  activeTab,
  onTabChange,
  onDeleteTab,
  onAddTab,
  isOverflowing,
  scrollTabs,
  tabListRef,
}: OrderTabsListProps) => {
  return (
    <div className="flex items-end">
      {/* Left Scroll Button */}
      {isOverflowing && (
        <Button
          onClick={() => scrollTabs("left")}
          className="bg-transparent text-white p-1 hover:bg-blue-800"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}

      {/* Tabs */}
      <Tabs
        value={`tab-${activeTab}`}
        onValueChange={(value) => onTabChange(parseInt(value.split("-")[1]))}
      >
        <TabsList
          ref={tabListRef}
          className="flex p-0 bg-primary justify-start overflow-x-auto max-w-[35vw] rounded-none rounded-t-lg"
          style={{
            scrollbarWidth: "none", // Firefox
            minHeight: "fit-content",
          }}
        >
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`flex items-center cursor-pointer px-1 py-2 rounded-none rounded-t-lg 
                ${activeTab === index ? "bg-white text-white" : "bg-transparent text-white hover:bg-blue-700"}`}
              style={{ minWidth: "fit-content" }}
            >
              {/* Tab Trigger */}
              <TabsTrigger
                value={`tab-${index}`}
                className="p-1 flex rounded-none rounded-t-lg text-background data-[state=active]:shadow-none transition-transform"
              >
                <span>Hoá đơn {tab.number}</span>
              </TabsTrigger>

              {/* Delete Button */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTab(index);
                }}
                className={`p-1 h-6 w-6 bg-transparent ${activeTab === index ? "text-black hover:bg-gray-300" : "text-white hover:bg-blue-800"} rounded-full shadow-none`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </TabsList>
      </Tabs>

      {/* Right Scroll Button */}
      {isOverflowing && (
        <Button
          onClick={() => scrollTabs("right")}
          className="bg-transparent text-white p-1 hover:bg-blue-800"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}

      {/* Add New Tab */}
      <div className="flex p-2">
        <Button
          onClick={() => onAddTab("sale")}
          className="p-1 h-7 w-7 bg-primary text-white rounded-full shadow-none hover:bg-blue-800"
        >
          <CirclePlus />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="p-1 h-7 w-7 bg-primary text-white rounded-full shadow-none hover:bg-blue-800">
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-md rounded-md p-2">
            <DropdownMenuItem onClick={() => onAddTab("sale")}>
              Thêm hoá đơn
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddTab("order")}>
              Thêm đặt hàng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
