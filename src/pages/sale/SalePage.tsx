import { Filter, List, Pen, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Card } from "@/components/ui/card.tsx";
import { OrderItemCard } from "@/pages/sale/components/OrderItemCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SkuCard } from "@/pages/sale/components/SkuCard.tsx";
import { OrderTabsList, Tab } from "@/pages/sale/components/OrderTabsList.tsx";
import { getListSku } from "@/pages/sale/api/skuApi.ts";
import { SkuGetDetail } from "@/types/sku/skuGetDetail.ts";
import { Pagination } from "@/pages/sale/components/Pagination.tsx";
import { OrderGetDetail } from "@/types/order/orderGetDetail.ts";
import {
  addOrderItem,
  createOrder,
  deleteOrder,
  deleteOrderItem,
  getListOrder,
  OrderStatus,
  updateOrderItemApi,
} from "@/pages/sale/api/orderApi.ts";
import { OrderType } from "@/types/order/order.ts";
import { OrderItem } from "@/types/orderItem/orderItem.ts";
import { OrderCreate } from "@/types/order/orderCreate.ts";
import { OrderItemCreate } from "@/types/orderItem/orderItemCreate.ts";
import { OrderItemUpdate } from "@/types/orderItem/orderItemUpdate.ts";
import PaymentDialog from "@/pages/sale/components/PaymentDialog.tsx";
import { CreateCustomerModal } from "@/pages/sale/components/CustomerModal.tsx";
import { toast } from "react-toastify";
import { listCustomer } from "@/pages/sale/api/customerApi.ts";
import { CustomerListFilter } from "@/types/customer/customerListFilter.ts";
import _ from "lodash";

export default function SalePage() {
  // Input
  const [searchValue, setSearchValue] = useState("");
  const [orderDescription, setOrderDescription] = useState("");

  // Customer
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchCustomerResult, setSearchCustomerResult] = useState<
    [
      {
        id: number;
        name: string;
        phoneNumber: string;
      },
    ]
  >();
  const [selectedCustomer, setSelectedCustomer] = useState<
    | {
        id: number;
        name: string;
        phoneNumber: string;
      }
    | undefined
  >();
  const debounceSearchCustomer = useMemo(
    () =>
      _.debounce(async (query: string) => {
        if (query.trim() === "") {
          setSearchCustomerResult(undefined);
        } else {
          try {
            const response = await fetchSearchCustomer(query);
            console.log(response);
            const searchResponse = response.map((item) => ({
              id: item.id,
              name: item.lastName + " " + item.firstName,
              phoneNumber: item.phoneNumber,
            }));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setSearchCustomerResult(searchResponse);
          } catch (error) {
            console.error(error);
          }
        }
      }, 1000),
    [],
  );

  // Order tabs
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const isAddingTab = useRef(false);
  const isInitalized = useRef(false);

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

  // Dialog
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isCustomerCreateOpen, setIsCustomerCreateOpen] = useState(false);

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
      const finalPrice = item.unitPrice;
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
  const handleSearchCustomer = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchCustomer(query);

    debounceSearchCustomer(query);
  };

  // const handleTabNumber = (): number => {
  //   let num = 1;
  //   const existingTabNumbers = tabs.map((tab) => tab.number);
  //
  //   // Find the next available tab number
  //   while (existingTabNumbers.includes(num)) {
  //     num += 1;
  //   }
  //
  //   return num;
  // };

  // Tabs stuff
  const addTab = async () => {
    if (isAddingTab.current) return;
    isAddingTab.current = true;
    console.log(selectedCustomer);
    try {
      const newOrder = await fetchCreateOrder({
        customerId: 0, // Replace with actual customer ID if available
        sellerId: 0, // Replace with actual seller ID
        orderType: OrderType.Retail,
      });

      // Add the new order as a tab
      const newTab: Tab = {
        number: newOrder.id,
        order: {
          ...newOrder,
          items: [], // No items yet
        },
      };

      setTabs((prevTabs) => {
        const updatedTabs = [...prevTabs, newTab];
        if (updatedTabs.length === 1) {
          setActiveTab(0);
        } else setActiveTab(tabs.length);
        return updatedTabs;
      });

      // Scroll to the new tab
      if (tabListRef.current) {
        const { scrollWidth, offsetWidth } = tabListRef.current;
        tabListRef.current.scrollTo({
          left: scrollWidth + offsetWidth,
          behavior: "smooth",
        });
      }

      isAddingTab.current = false;
    } catch (error) {
      console.error("Error creating a new order:", error);
      toast.error("Tạo đơn hàng thất bại, thử lại", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const deleteTab = (index: number) => {
    fetchDeleteOrder(tabs[index].order.id);

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
    }
  };

  // Items stuff
  const updateOrderItem = (index: number, changes: OrderItem) => {
    if (!tabs[activeTab]?.order.items[index]) return;
    const updatedTabs = [...tabs];
    const item = updatedTabs[activeTab].order.items[index];
    updatedTabs[activeTab].order.items[index] = { ...item, ...changes };
    setTabs(updatedTabs);
    updateTotalPrice();
  };
  const handleOrderItemIncrease = async (index: number) => {
    const orderItem = await fetchUpdateOrderItem(
      tabs[activeTab].order.id,
      tabs[activeTab].order.items[index].skuId,
      {
        amount: tabs[activeTab].order.items[index].amount + 1,
      },
    );
    updateOrderItem(index, orderItem);
  };
  const handleOrderItemDecrease = async (index: number) => {
    if (tabs[activeTab].order.items[index].amount > 1) {
      const orderItem = await fetchUpdateOrderItem(
        tabs[activeTab].order.id,
        tabs[activeTab].order.items[index].skuId,
        {
          amount: tabs[activeTab].order.items[index].amount - 1,
        },
      );
      updateOrderItem(index, orderItem);
    }
  };
  const handleOrderItemRemove = (index: number) => {
    fetchDeleteOrderItem(
      tabs[activeTab].order.id,
      tabs[activeTab].order.items[index].skuId,
    );
    const updatedTabs = [...tabs];
    updatedTabs[activeTab].order.items = updatedTabs[
      activeTab
    ].order.items.filter((_, i) => i !== index);
    setTabs(updatedTabs);
    updateTotalPrice();
  };

  const handleSkuClick = async (sku: SkuGetDetail) => {
    try {
      const activeOrder = tabs[activeTab]?.order;

      if (!activeOrder) {
        toast.error("Xin hãy tạo đơn hàng trước khi thêm sản phẩm", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Add the clicked SKU to the existing order
      const orderItem = await fetchAddOrderItem({
        orderId: activeOrder.id,
        skuId: sku.id,
        amount: 1,
      });

      // Update the active tab with the new item
      const updatedTabs = [...tabs];
      updatedTabs[activeTab].order.items.push(orderItem);
      setTabs(updatedTabs);

      updateTotalPrice(); // Update total price and item count
    } catch (error) {
      console.error("Error handling SKU click:", error);
      toast.error("Thêm sản phẩm thất bại, thử lại", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
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
    isInitalized.current = true;
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
      isInitalized.current = false;
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  const fetchCreateOrder = async (orderCreate: OrderCreate) => {
    try {
      const response = await createOrder(orderCreate);
      return response.data;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  };

  const fetchAddOrderItem = async (orderItem: OrderItemCreate) => {
    try {
      const response = await addOrderItem(orderItem);
      return response.data;
    } catch (error) {
      console.error("Add order item error:", error);
      throw error;
    }
  };

  const fetchDeleteOrder = async (orderId: number) => {
    try {
      await deleteOrder(orderId);
    } catch (error) {
      console.error("Delete order error:", error);
      throw error;
    }
  };

  const fetchDeleteOrderItem = async (orderId: number, skuId: number) => {
    try {
      await deleteOrderItem(orderId, skuId);
    } catch (error) {
      console.error("Delete order item error:", error);
      throw error;
    }
  };

  const fetchUpdateOrderItem = async (
    orderId: number,
    skuId: number,
    orderItem: OrderItemUpdate,
  ) => {
    try {
      const response = await updateOrderItemApi(orderId, skuId, orderItem);
      return response.data;
    } catch (error) {
      console.error("Update order item error:", error);
      throw error;
    }
  };

  const fetchSearchCustomer = async (value: string) => {
    try {
      const filter: CustomerListFilter = {
        lkPhoneNumber: value,
        status: [1],
      };
      const response = await listCustomer(filter);
      return response.data;
    } catch (error) {
      console.error("Search customer error:", error);
      throw error;
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
    if (tabs.length === 0 && !isInitalized.current) {
      (async () => {
        try {
          await addTab();
        } catch (error) {
          console.error("Error adding tab on initial load:", error);
        }
      })();
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
            onTabChange={(index) => {
              setActiveTab(index);
            }}
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
                Chưa có sản phầm nào trong đơn hàng
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
                onDecreament={() => handleOrderItemDecrease(index)} // Decrease quantity for this item
                onIncreament={() => handleOrderItemIncrease(index)} // Increase quantity for this item
                onRemove={() => handleOrderItemRemove(index)} // Remove this item from the order
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
              <div className="relative w-3/4 p-2 flex items-center">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform bg-background" />
                <Input
                  value={searchCustomer}
                  onChange={handleSearchCustomer}
                  className="pl-9 bg-background flex-grow"
                  placeholder="Tìm khách hàng"
                />
                {searchCustomerResult &&
                  searchCustomerResult.length > 0 &&
                  searchCustomer.trim() !== "" && (
                    <div className="absolute top-full mt-2 left-0 w-full bg-white border rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
                      {searchCustomerResult.map((provider) => (
                        <div
                          key={provider.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSearchCustomer(
                              provider.phoneNumber + " - " + provider.name,
                            );
                            setSearchCustomerResult(undefined);
                            setSelectedCustomer(provider);
                          }}
                        >
                          <span className="text-gray-500">
                            {provider.phoneNumber}
                          </span>
                          {" - "}
                          <span className="font-medium">{provider.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                <Button
                  className="absolute right-3 p-1 h-7 w-7 bg-background text-gray-600 hover:bg-gray-200 rounded-full shadow-none"
                  onClick={() => setIsCustomerCreateOpen(true)}
                >
                  <Plus />
                </Button>
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
                <div key={sku.id} onClick={() => handleSkuClick(sku)}>
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
              <Button
                className="p-4 w-full h-12"
                onClick={() => setIsPaymentDialogOpen(true)}
              >
                THANH TOÁN
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        customerName={"Mai Hoàng Hưng"}
        customerPhone={"0123456789"}
        orderDetails={tabs[activeTab]?.order}
      />
      <CreateCustomerModal
        isOpen={isCustomerCreateOpen}
        onClose={() => setIsCustomerCreateOpen(false)}
      />
    </div>
  );
}
