import { Filter, List, Pen, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card.tsx";
import { OrderItemCard } from "@/pages/sale/components/OrderItemCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SkuCard } from "@/pages/sale/components/SkuCard.tsx";
import { OrderTabsList, Tab } from "@/pages/sale/components/OrderTabsList.tsx";
import { getListSku } from "@/pages/sale/api/skuApi.ts";
import { SkuGetDetail } from "@/types/sku/skuGetDetail.ts";
import { Pagination } from "@/pages/sale/components/Pagination.tsx";
import { OrderGetDetail, OrderItem } from "@/types/order/orderGetDetail.ts";
import { getListOrder, OrderStatus } from "@/pages/sale/api/orderApi.ts";

export default function SalePage() {
  // Input
  const [searchValue, setSearchValue] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");

  // Order tabs
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Sku list
  const [skuData, setSkuData] = useState<SkuGetDetail[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const skuListRef = useRef<HTMLDivElement>(null);

  // Filter states
  const brandId = 0;
  const categoryId = 0;
  // const [brandId, setBrandId] = useState(0);
  // const [categoryId, setCategoryId] = useState(0);

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
    if (!tabs[activeTab]) return;

    const activeOrderItems = tabs[activeTab].order.items || [];
    let total = 0;
    let itemCount = 0;

    activeOrderItems.forEach((item) => {
      const discountAmount = item.discount || 0;
      const finalPrice = item.unitPrice - discountAmount;
      total += finalPrice * item.amount;
      itemCount += item.amount;
    });

    setTotalPrice(total);
    setNumberOfItems(itemCount);
  }, [tabs, activeTab]);

  // Text input
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!tabs[activeTab]) return;
    setOrderDescription(e.target.value);

    const updatedTabs = [...tabs];
    updatedTabs[activeTab].order.description = e.target.value;
    setTabs(updatedTabs);
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
  const addTab = () => {
    const number = handleTabNumber();
    const order: OrderGetDetail = {
      id: 0,
      customerId: 0,
      sellerId: 0,
      status: 1,
      orderType: "retail",
      description: "",
      createAt: new Date(),
      updateAt: new Date(),
      items: [],
    };
    const newTab = { number, order };
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

    // If there are no tabs left, create a new tab
    if (updatedTabs.length === 0) {
      addTab();
      setActiveTab(0);
    }
  };
  const handleTabChange = (index: number) => {
    setActiveTab(index); // Update the active tab when a new tab is selected
  };

  // Items stuff
  const updateOrderItem = (index: number, changes: Partial<OrderItem>) => {
    if (!tabs[activeTab]?.order.items[index]) return;
    const updatedTabs = [...tabs];
    const item = updatedTabs[activeTab].order.items[index];
    updatedTabs[activeTab].order.items[index] = { ...item, ...changes };
    setTabs(updatedTabs);
    updateTotalPrice();
  };
  const handleOrderItemIncrease = (index: number) =>
    updateOrderItem(index, {
      amount: tabs[activeTab].order.items[index].amount + 1,
    });
  const handleOrderItemDecrease = (index: number) => {
    if (tabs[activeTab].order.items[index].amount > 1) {
      updateOrderItem(index, {
        amount: tabs[activeTab].order.items[index].amount - 1,
      });
    }
  };
  const handleOrderItemRemove = (index: number) => {
    const updatedTabs = [...tabs];
    updatedTabs[activeTab].order.items = updatedTabs[
      activeTab
    ].order.items.filter((_, i) => i !== index);
    setTabs(updatedTabs);
    updateTotalPrice();
  };

  const handleOrderItemDiscountChange = (
    index: number,
    newDiscount: number,
  ) => {
    const updatedTabs = [...tabs];
    updatedTabs[activeTab].order.items[index].discount = newDiscount;
    setTabs(updatedTabs);
    updateTotalPrice();
  };

  // Handle page navigation
  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const adjustLimit = () => {
    const container = skuListRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const cardWidth = 192;
      const cardHeight = 96;

      const itemsPerRow = Math.max(1, Math.floor(containerWidth / cardWidth));
      const rowsPerPage = Math.max(1, Math.floor(containerHeight / cardHeight));

      const newLimit = itemsPerRow * rowsPerPage;
      setLimit(newLimit);
    }
  };

  // Fetch
  const fetchSkus = async () => {
    // setLoading(true);
    // setError(null);
    try {
      const response = await getListSku(brandId, categoryId, page, limit);
      setSkuData(response.data); // Set the SKU data from the `data` field
      const totalPages = Math.ceil(
        response.paging.total / response.paging.limit,
      ); // Calculate total pages
      setTotalPages(totalPages);

      // console.log("Fetched SKU data:", response);
    } catch (error) {
      console.log("Fetch error:", error);
      // setError("Failed to fetch SKU data.");
    }
    // finally {
    //   setLoading(false);
    // }
  };
  const fetchOrders = async () => {
    try {
      const response = await getListOrder(OrderStatus.PENDING); // Fetch all orders
      // console.log("Fetched orders:", response);
      const transformedTabs: Tab[] = response.data.map(
        (order: OrderGetDetail) => ({
          number: order.id,
          order,
        }),
      );
      setTabs(transformedTabs);
      if (transformedTabs.length > 0) {
        setActiveTab(0); // Set the first tab as active if orders exist
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  // Set up ResizeObserver to monitor container size
  useEffect(() => {
    const container = skuListRef.current;

    if (!container) return;

    const observer = new ResizeObserver(() => {
      adjustLimit();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Fetch data on component mount and when filters or page changes
  useEffect(() => {
    fetchSkus();
  }, [brandId, categoryId, page, limit]);

  useEffect(() => {
    fetchOrders(); // Fetch orders on component mount
  }, []);

  useEffect(() => {
    if (tabs[activeTab]) {
      setOrderDescription(tabs[activeTab].order.description || "");
    }
  }, [tabs, activeTab]);

  useEffect(() => {
    if (tabs.length === 0) {
      addTab();
    }
  }, [tabs]);

  // Adjust the current page if it exceeds the new total pages
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  useEffect(() => {
    updateTotalPrice();
  }, [tabs, activeTab, updateTotalPrice]);

  // Tabs overflow
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
          <OrderTabsList
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onDeleteTab={deleteTab}
            onAddTab={addTab}
            isOverflowing={isOverflowing}
            scrollTabs={scrollTabs}
            tabListRef={tabListRef}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-grow flex-row">
        {/* Left Section */}
        <div className="p-2 w-full md:w-[55%] flex flex-col h-full">
          {/* Order items */}
          <div className="flex flex-col flex-grow p-2 space-y-2 overflow-y-auto h-[0px]">
            {tabs[activeTab]?.order.items.length === 0 && (
              <div className="text-center text-gray-500">
                No items in this order.
              </div>
            )}
            {tabs[activeTab]?.order?.items.map((item, index) => (
              <OrderItemCard
                key={item.skuId} // Ensure each card has a unique key
                index={index + 1} // Optionally use 1-based indexing
                id={item.skuId}
                name={"item name"}
                quantity={item.amount}
                originalPrice={item.unitPrice}
                discount={item.discount || 0}
                onDecreament={() => handleOrderItemDecrease(index)} // Decrease quantity for this item
                onIncreament={() => handleOrderItemIncrease(index)} // Increase quantity for this item
                onRemove={() => handleOrderItemRemove(index)} // Remove this item from the order
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
              ref={skuListRef}
              className="p-2 flex flex-wrap gap-2 items-start content-start"
              style={{
                height: "calc(100vh - 210px)", // Adjust based on your header/footer height
              }}
            >
              {skuData.map((sku) => (
                <div key={sku.id}>
                  <SkuCard {...sku} />
                </div>
              ))}
            </div>

            {/*Action*/}
            <div className="flex flex-row p-2 items-center mt-auto gap-10">
              <Pagination
                page={page}
                totalPages={totalPages}
                onNext={handleNextPage}
                onPrevious={handlePreviousPage}
              />
              <Button className="p-4 w-full h-12">THANH TOÁN</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
