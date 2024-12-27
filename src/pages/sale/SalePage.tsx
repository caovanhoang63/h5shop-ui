import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Filter,
  List,
  Pen,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card.tsx";
import { OrderItemCard } from "@/pages/sale/components/OrderItemCard.tsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { SpuCard } from "@/pages/sale/components/SpuCard.tsx";

export default function SalePage() {
  const [searchValue, setSearchValue] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");

  const [tabs, setTabs] = useState([
    {
      number: 1,
      orderItems: [
        {
          id: "DT000020",
          name: "Xiaomi Redmi Note 13 Pro 128GB",
          quantity: 2,
          originalPrice: 200000,
          discount: {
            type: "percent",
            value: 10,
          },
        },
        {
          id: "DT000020",
          name: "Xiaomi Redmi Note 13 Pro 128GB",
          quantity: 2,
          originalPrice: 200000,
          discount: {
            type: "percent",
            value: 10,
          },
        },
        {
          id: "DT000020",
          name: "Xiaomi Redmi Note 13 Pro 128GB",
          quantity: 2,
          originalPrice: 200000,
          discount: {
            type: "percent",
            value: 10,
          },
        },
        {
          id: "DT000020",
          name: "Xiaomi Redmi Note 13 Pro 128GB",
          quantity: 2,
          originalPrice: 200000,
          discount: {
            type: "percent",
            value: 10,
          },
        },
        {
          id: "DT000020",
          name: "Xiaomi Redmi Note 13 Pro 128GB",
          quantity: 2,
          originalPrice: 200000,
          discount: {
            type: "percent",
            value: 10,
          },
        },
        {
          id: "DT000020",
          name: "Xiaomi Redmi Note 13 Pro 128GB",
          quantity: 2,
          originalPrice: 200000,
          discount: {
            type: "percent",
            value: 10,
          },
        },
      ],
    },
    {
      number: 2,
      orderItems: [
        {
          id: "DT000020",
          name: "Xiaomi Redmi Note 13 Pro 128GB",
          quantity: 2,
          originalPrice: 200000,
          discount: {
            type: "percent",
            value: 10,
          },
        },
      ],
    },
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const spus = [
    { id: "1", name: "Xiaomi Redmi Note 13 Pro 128GB", price: 100000 },
    { id: "2", name: "Product 2", price: 150000 },
    { id: "3", name: "Product 3", price: 200000 },
    { id: "4", name: "Xiaomi Redmi Note 13 Pro 128GB", price: 100000 },
    { id: "5", name: "Product 2", price: 150000 },
    { id: "6", name: "Product 3", price: 200000 },
    { id: "7", name: "Xiaomi Redmi Note 13 Pro 128GB", price: 100000 },
    { id: "8", name: "Product 2", price: 150000 },
    { id: "9", name: "Product 3", price: 200000 },
    { id: "10", name: "Xiaomi Redmi Note 13 Pro 128GB", price: 100000 },
    { id: "11", name: "Product 2", price: 150000 },
    { id: "12", name: "Product 3", price: 200000 },
    { id: "13", name: "Xiaomi Redmi Note 13 Pro 128GB", price: 100000 },
    { id: "14", name: "Product 2", price: 150000 },
    { id: "15", name: "Product 3", price: 200000 },
    { id: "16", name: "Xiaomi Redmi Note 13 Pro 128GB", price: 100000 },
    { id: "17", name: "Product 2", price: 150000 },
    { id: "18", name: "Product 3", price: 200000 },
  ];

  // Check if the tabs list is overflowing
  const checkOverflow = () => {
    if (tabListRef.current) {
      const isOverflowing =
        tabListRef.current.scrollWidth > tabListRef.current.offsetWidth;
      setIsOverflowing(isOverflowing);
    }
  };
  const scrollTabs = (direction: "left" | "right") => {
    if (tabListRef.current) {
      const { scrollLeft, scrollWidth, offsetWidth } = tabListRef.current;
      const scrollAmount = 200; // Scroll amount in pixels

      if (direction === "left") {
        const newScrollPosition = Math.max(scrollLeft - scrollAmount, 0);
        tabListRef.current.scrollTo({
          left: newScrollPosition,
          behavior: "smooth",
        });
      } else {
        const maxScrollPosition = scrollWidth - offsetWidth;
        const newScrollPosition = Math.min(
          scrollLeft + scrollAmount,
          maxScrollPosition,
        );
        tabListRef.current.scrollTo({
          left: newScrollPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const updateTotalPrice = useCallback(() => {
    const activeOrderItems = tabs[activeTab].orderItems;
    let total = 0;
    let itemCount = 0;

    activeOrderItems.forEach((item) => {
      const discountAmount =
        item.discount.type === "percent"
          ? (item.originalPrice * item.discount.value) / 100
          : item.discount.value;
      const finalPrice = item.originalPrice - discountAmount;
      total += finalPrice * item.quantity;
      itemCount += item.quantity;
    });

    setTotalPrice(total);
    setNumberOfItems(itemCount);
  }, [tabs, activeTab]);

  // Text input
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrderDescription(e.target.value);
  };
  const handleSearchCustomer = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchCustomer(e.target.value);
  };

  const handleTabNumber = (): number => {
    let num = 1;
    const existingTabNumbers = tabs.map((tab) => tab.number);

    // Find the next available tab number
    while (existingTabNumbers.includes(num)) {
      num += 1;
    }

    return num;
  };

  // Tabs stuff
  const addTab = (type: string) => {
    const number = handleTabNumber();
    const newTab = { type, number, orderItems: [] };
    setTabs((prevTabs) => [...prevTabs, newTab]);

    setActiveTab(tabs.length);
    if (tabListRef.current) {
      const { scrollWidth, offsetWidth } = tabListRef.current;
      tabListRef.current.scrollTo({
        left: scrollWidth + offsetWidth,
        behavior: "smooth",
      });
    }
  };
  const deleteTab = (index: number) => {
    const updatedTabs = tabs.filter((_, i) => i !== index);
    setTabs(updatedTabs);

    // Adjust the active tab if the current active tab is deleted
    if (index === activeTab) {
      // If the deleted tab was the active tab, set the active tab to the previous one (if it exists)
      setActiveTab((prevActiveTab) =>
        prevActiveTab > 0 ? prevActiveTab - 1 : 0,
      );
    } else if (index < activeTab) {
      // If the deleted tab was before the active tab, the active tab index should shift down by 1
      setActiveTab((prevActiveTab) => prevActiveTab - 1);
    }

    // If there are no tabs left, create a new tab (sale type by default)
    if (updatedTabs.length === 0) {
      addTab("sale");
      setActiveTab(0);
    }
  };
  const handleTabChange = (index: number) => {
    setActiveTab(index); // Update the active tab when a new tab is selected
  };

  // Items stuff
  const handleOrderItemIncrease = (index: number) => {
    const updatedTabs = [...tabs];
    updatedTabs[activeTab].orderItems[index].quantity += 1;
    setTabs(updatedTabs);
    updateTotalPrice();
  };
  const handleOrderItemDecrease = (index: number) => {
    const updatedTabs = [...tabs];
    if (updatedTabs[activeTab].orderItems[index].quantity > 1) {
      updatedTabs[activeTab].orderItems[index].quantity -= 1;
      setTabs(updatedTabs);
      updateTotalPrice();
    }
  };
  const handleOrderItemRemove = (index: number) => {
    const updatedTabs = [...tabs];
    updatedTabs[activeTab].orderItems = updatedTabs[
      activeTab
    ].orderItems.filter((_, i) => i !== index);
    setTabs(updatedTabs);
    updateTotalPrice();
  };
  const handleOrderItemOriginalPriceChange = (
    index: number,
    newPrice: number,
  ) => {
    const updatedTabs = [...tabs];
    updatedTabs[activeTab].orderItems[index].originalPrice = newPrice;
    setTabs(updatedTabs);
    updateTotalPrice();
  };
  const handleOrderItemDiscountChange = (
    index: number,
    newDiscount: { type: string; value: number },
  ) => {
    const updatedTabs = [...tabs];
    updatedTabs[activeTab].orderItems[index].discount = newDiscount;
    setTabs(updatedTabs);
    updateTotalPrice();
  };

  useEffect(() => {
    updateTotalPrice();
  }, [tabs, activeTab, updateTotalPrice]);

  useEffect(() => {
    checkOverflow(); // Initial check for overflow

    const handleResize = () => checkOverflow();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [tabs]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex flex-row bg-primary w-full p-0">
        <div className="relative w-1/3 p-2">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform bg-background" />
          <Input
            value={searchValue}
            onChange={handleSearchInput}
            className="pl-9 bg-background "
            placeholder="Tìm hàng hoá"
          />
        </div>

        {/* Tabs list */}
        <div className="flex flex-row ml-4 items-end w-auto">
          <div className="flex items-center">
            {/* Left scroll button */}
            {isOverflowing && (
              <Button
                onClick={() => scrollTabs("left")}
                className="bg-transparent text-white p-1 hover:bg-blue-800"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            <Tabs
              value={`tab-${activeTab}`}
              onValueChange={(value) =>
                handleTabChange(parseInt(value.split("-")[1]))
              }
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
                    onClick={(e) => e.stopPropagation()} // Prevent tab selection when clicking on buttons
                    style={{ minWidth: "fit-content" }}
                  >
                    {/* Tab trigger */}
                    <TabsTrigger
                      value={`tab-${index}`}
                      className="p-1 flex rounded-none rounded-t-lg text-background data-[state=active]:shadow-none transition-transform"
                    >
                      <span>Hoá đơn {tab.number.toString()}</span>
                    </TabsTrigger>

                    {/* Delete button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent tab selection when deleting tab
                        deleteTab(index);
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
          </div>

          {/* Plus button to add new tab */}
          <div className="flex p-2">
            <Button
              onClick={() => addTab("sale")}
              className="p-1 h-7 w-7 bg-primary text-white rounded-full shadow-none hover:bg-blue-800"
            >
              <CirclePlus />
            </Button>
            {/* Dropdown to choose tab type */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="p-1 h-7 w-7 bg-primary text-white rounded-full shadow-none hover:bg-blue-800">
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white shadow-md rounded-md p-2">
                <DropdownMenuItem onClick={() => addTab("sale")}>
                  Thêm hoá đơn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addTab("order")}>
                  Thêm đặt hàng
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-grow flex-row">
        {/* Left Section */}
        <div className="p-2 w-full md:w-[55%] flex flex-col h-full">
          {/* Order items */}
          <div className="flex flex-col flex-grow p-2 space-y-2 overflow-y-auto h-[0px]">
            {tabs[activeTab].orderItems.map((item, index) => (
              <OrderItemCard
                key={item.id} // Ensure each card has a unique key
                index={index + 1} // Optionally use 1-based indexing
                id={item.id}
                name={item.name}
                quantity={item.quantity}
                originalPrice={item.originalPrice}
                discount={item.discount}
                onDecreament={() => handleOrderItemDecrease(index)} // Decrease quantity for this item
                onIncreament={() => handleOrderItemIncrease(index)} // Increase quantity for this item
                onRemove={() => handleOrderItemRemove(index)} // Remove this item from the order
                onOriginalPriceChange={(newPrice) =>
                  handleOrderItemOriginalPriceChange(index, newPrice)
                } // Change item's original price
                onDiscountChange={(newDiscount) =>
                  handleOrderItemDiscountChange(index, newDiscount)
                } // Change item's discount
              />
            ))}
          </div>

          {/* Footer Card */}
          <Card className="mx-2 mt-auto p-2 shadow-md">
            <div className="flex flex-row items-center gap-2">
              {/* Order Description Input */}
              <div className="flex-grow relative">
                <Input
                  value={orderDescription}
                  onChange={handleDescriptionChange}
                  className="bg-white p-2 rounded-md border-0 shadow-none pl-10"
                  placeholder="Ghi chú đơn hàng"
                />
                <Pen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              </div>

              {/* Total Price */}
              <div className="flex items-center justify-between">
                <span className="px-5 text-sm text-gray-600">
                  Tổng tiền hàng
                </span>
                <span className="text-sm">{numberOfItems}</span>
                <span className="pl-24 pr-8 text-lg font-semibold">
                  {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Section */}
        <div className="p-2 w-full md:w-[45%]">
          <Card className="p-2 flex flex-col h-full">
            {/*Filter*/}
            <div className="flex flex-row">
              <div className="relative w-2/3 p-2">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform bg-background" />
                <Input
                  value={searchCustomer}
                  onChange={handleSearchCustomer}
                  className="pl-9 bg-background "
                  placeholder="Tìm khách hàng"
                />
              </div>
              <div className="flex flex-row flex-grow px-2 w-auto items-center justify-end gap-2">
                <Button className="p-1 h-7 w-7 bg-transparent text-black rounded-full shadow-none hover:bg-blue-200 hover:text-blue-800">
                  <List />
                </Button>
                <Button className="p-1 h-7 w-7 bg-transparent text-black rounded-full shadow-none hover:bg-blue-200 hover:text-blue-800">
                  <Filter />
                </Button>
              </div>
            </div>

            {/*SPU list*/}
            <div
              className="p-0 flex flex-wrap gap-2 overflow-y-auto items-start content-start"
              style={{
                maxHeight: "calc(100vh - 210px)", // Adjust based on your header/footer height
              }}
            >
              {spus.map((spu) => (
                <div key={spu.id}>
                  <SpuCard name={spu.name} price={spu.price} />
                </div>
              ))}
            </div>

            {/*Action*/}
            <div className="flex flex-row p-2 items-center mt-auto gap-10">
              <div className="flex flex-row gap-2">
                <Button className="p-1 h-6 w-6 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full shadow-none">
                  <ChevronLeft />
                </Button>
                <span>
                  {1}/{2}
                </span>
                <Button className="p-1 h-6 w-6 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full shadow-none">
                  <ChevronRight />
                </Button>
              </div>
              <Button className="p-4 w-full h-12">THANH TOÁN</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
