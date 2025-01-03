import { Filter, List, Pen, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
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
  removeCustomer,
  updateOrder,
} from "@/pages/sale/api/orderApi.ts";
import { OrderType } from "@/types/order/order.ts";
import { OrderItem } from "@/types/orderItem/orderItem.ts";
import PaymentDialog from "@/pages/sale/components/PaymentDialog.tsx";
import { toast } from "react-toastify";
import { Customer } from "@/types/customer/customer.ts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation.tsx";
import { CustomerSearch } from "@/pages/sale/components/CustomerSearch.tsx";
import { getCustomerById } from "@/pages/sale/api/customerApi.ts";
import { Brand } from "@/types/brand/brand.ts";
import { Category } from "@/types/category/category.ts";
import { SkuFilter } from "@/types/sku/skuFilter";
import { BrandFilterDialog } from "@/pages/sale/components/BrandFilterDialog.tsx";
import { getBrands } from "@/pages/product/api/brandApi.ts";
import { getCategories } from "@/pages/product/api/categoryApi.ts";
import { CategoryFilterDialog } from "@/pages/sale/components/CategoryFilterDialog.tsx";

export default function SalePage() {
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [isLoadingSku, setIsLoadingSku] = useState<boolean>(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState<boolean>(false);
  // Input
  const [searchValue, setSearchValue] = useState("");

  // Customer
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(undefined);

  // Order tabs
  const [orderDescription, setOrderDescription] = useState("");
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const isAddingTab = useRef(false);
  const isInitialized = useRef(false);

  // Sku list
  const [skuData, setSkuData] = useState<SkuGetDetail[]>([]);

  // Pagination
  // const [page, setPage] = useState(1);
  // const limit = 12;
  const [totalPages, setTotalPages] = useState(1);
  const skuListRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [skuFilter, setSkuFilter] = useState<SkuFilter>({
    brandId: undefined,
    categoryId: undefined,
    page: 1,
    limit: 12,
  });
  const [brandSelected, setBrandSelected] = useState<number>();
  const [listBrands, setListBrands] = useState<Brand[]>([]);
  const [isBrandFilterDialogOpen, setIsBrandFilterDialogOpen] = useState(false);
  const [categorySelected, setCategorySelected] = useState<number>();
  const [listCategories, setListCategories] = useState<Category[]>([]);
  const [isCategoryFilterDialogOpen, setIsCategoryFilterDialogOpen] =
    useState(false);

  // Dialog
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

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
  const handleDescriptionBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newDescription = e.target.value;
      if (!tabs[activeTab]) return;
      updateOrder(tabs[activeTab].order.id, {
        description: newDescription,
      }).catch((error) => {
        console.error("Error updating order description:", error);
        toast.error("Cập nhập ghi chú đơn hàng thất bại", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
    },
    [activeTab, tabs],
  );
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!tabs[activeTab]) return;
    setOrderDescription(e.target.value);

    const updatedTabs = [...tabs];
    updatedTabs[activeTab].order.description = e.target.value;
    setTabs(updatedTabs);
  };

  // Tabs stuff
  const addTab = useCallback(async () => {
    if (isAddingTab.current) return;
    isAddingTab.current = true;
    console.log(selectedCustomer);

    createOrder({
      orderType: OrderType.Retail,
    })
      .then((response) => {
        const newTab: Tab = {
          number: response.data.id,
          order: {
            ...response.data,
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
      })
      .catch((error) => {
        console.error("Error creating a new order:", error);
        toast.error("Tạo đơn hàng thất bại, thử lại", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }, [tabs, selectedCustomer]);
  const deleteTab = (index: number) => {
    deleteOrder(tabs[index].order.id)
      .then(() => {
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
        const updatedTabs = tabs.filter((_, i) => i !== index);
        if (updatedTabs.length === 0) {
          addTab().catch((error) => {
            console.log("Error adding tab after deleting:", error);
          });
        }
        setTabs(updatedTabs);
      })
      .catch((error) => {
        console.log("Error deleting order:", error);
        toast.error("Xóa đơn hàng thất bại, thử lại", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
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
  const handleOrderItemQuantityChange = async (
    index: number,
    value: number,
  ) => {
    if (tabs[activeTab].order.items[index].amount === value) return true;

    return addOrderItem({
      orderId: tabs[activeTab].order.id,
      skuId: tabs[activeTab].order.items[index].skuId,
      amount: value,
      unitPrice: 1,
    })
      .then((response) => {
        updateOrderItem(index, response.data);
        return true;
      })
      .catch((error) => {
        console.log("Error update order item quantity:", error);
        toast.error("Cập nhập số lượng sản phẩm thất bại", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return false;
      });
  };

  const handleOrderItemDescriptionChange = async (
    index: number,
    value: string,
  ) => {
    addOrderItem({
      orderId: tabs[activeTab].order.id,
      skuId: tabs[activeTab].order.items[index].skuId,
      amount: tabs[activeTab].order.items[index].amount,
      description: value ? value : undefined,
      unitPrice: 1,
    })
      .then((response) => {
        updateOrderItem(index, response.data);
      })
      .catch((error) => {
        console.log("Error update order item description:", error);
        toast.error("Cập nhập ghi chú sản phẩm thất bại", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  const handleOrderItemRemove = (index: number) => {
    deleteOrderItem(
      tabs[activeTab].order.id,
      tabs[activeTab].order.items[index].skuId,
    )
      .then(() => {
        const updatedTabs = [...tabs];
        updatedTabs[activeTab].order.items = updatedTabs[
          activeTab
        ].order.items.filter((_, i) => i !== index);
        setTabs(updatedTabs);
        updateTotalPrice();
      })
      .catch((error) => {
        console.log("Error deleting order item:", error);
        toast.error("Xóa sản phẩm thất bại, thử lại", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  const handleSkuClick = async (sku: SkuGetDetail) => {
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
    addOrderItem({
      orderId: activeOrder.id,
      skuId: sku.id,
      amount: 1,
      unitPrice: 1,
    })
      .then((response) => {
        // Update the active tab with the new item
        const updatedTabs = [...tabs];
        response.data.skuDetail = sku;
        updatedTabs[activeTab].order.items.push(response.data);
        setTabs(updatedTabs);

        updateTotalPrice(); // Update total price and item count
      })
      .catch((error) => {
        console.error("Error handling SKU click:", error);
        toast.error("Thêm sản phẩm thất bại, thử lại", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  // Filter
  const handleChangedBrand = (brandId: number) => {
    console.log(brandSelected);
    console.log(brandId);
    setBrandSelected(brandId);
    setSkuFilter({ ...skuFilter, brandId: Number(brandId), page: 1 });
  };
  const handleChangedCategory = (categoryId: number) => {
    console.log(categorySelected);
    console.log(categoryId);
    setCategorySelected(categoryId);
    setSkuFilter({ ...skuFilter, categoryId: Number(categoryId), page: 1 });
  };

  const fetchBrands = async () => {
    try {
      const response = await getBrands();
      setListBrands(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log(response);
      setListCategories(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchSku = async () => {
    setIsLoadingSku(true);

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000),
    );

    Promise.race([
      getListSku(
        skuFilter.brandId,
        skuFilter.categoryId,
        skuFilter.page,
        skuFilter.limit,
      ),
      timeout,
    ])
      .then((response: any) => {
        setSkuData(response.data); // Set the SKU data from the `data` field
        const totalPages = Math.ceil(
          response.paging.total / response.paging.limit,
        ); // Calculate total pages
        setTotalPages(totalPages);
      })
      .catch((error: any) => {
        console.error("Fetch error:", error);
        toast.error(error.message || "Đã xảy ra lỗi khi tải dữ liệu", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .finally(() => {
        setIsLoadingSku(false);
      });
  };

  // Fetch data on component mount and when filters or page changes
  useEffect(() => {
    setIsLoadingSku(true);

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000),
    );

    Promise.race([
      getListSku(
        skuFilter.brandId,
        skuFilter.categoryId,
        skuFilter.page,
        skuFilter.limit,
      ),
      timeout,
    ])
      .then((response: any) => {
        setSkuData(response.data); // Set the SKU data from the `data` field
        const totalPages = Math.ceil(
          response.paging.total / response.paging.limit,
        ); // Calculate total pages
        setTotalPages(totalPages);
      })
      .catch((error: any) => {
        console.error("Fetch error:", error);
        toast.error(error.message || "Đã xảy ra lỗi khi tải dữ liệu", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .finally(() => {
        setIsLoadingSku(false);
      });
  }, [skuFilter]);

  useEffect(() => {
    setIsLoadingPage(true);
    isInitialized.current = true;

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000),
    );

    Promise.race([getListOrder(OrderStatus.PENDING), timeout])
      .then((response: any) => {
        const transformedTabs: Tab[] = response.data.map(
          (order: OrderGetDetail) => ({
            number: order.id,
            order,
          }),
        );
        setTabs(transformedTabs);
        if (transformedTabs.length > 0) {
          setActiveTab(0);
          if (!transformedTabs[0].order.customerId) {
            setSelectedCustomer(undefined);
            return;
          }
          getCustomerById(transformedTabs[0].order.customerId)
            .then((response) => {
              console.log(response.data.data);
              setSelectedCustomer(response.data.data);
            })
            .catch((error) => {
              console.error("Error fetching customer:", error);
              toast.error("Lấy thông tin khách hàng thất bại");
            });
        }
        // console.log("Orders loaded:", response.data.map((o: OrderGetDetail) => o));
        isInitialized.current = false;
      })
      .catch((error: any) => {
        console.error("Fetch error:", error);
        toast.error(error.message || "Đã xảy ra lỗi khi tải đơn hàng", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .finally(() => {
        setIsLoadingPage(false);
      });
  }, []);

  useEffect(() => {
    if (tabs[activeTab]) {
      setOrderDescription(tabs[activeTab].order.description || "");
    }
  }, [tabs, activeTab]);

  useEffect(() => {
    if (tabs.length === 0 && !isInitialized.current) {
      (async () => {
        await addTab().catch((error) => {
          console.error("Error adding tab on initial load:", error);
        });
      })();
    }
  }, [addTab, tabs]);

  // Adjust the current page if it exceeds the new total pages
  useEffect(() => {
    if (!skuFilter.page) return;
    if (skuFilter.page > totalPages) {
      setSkuFilter({ ...skuFilter, page: totalPages });
    }
  }, [totalPages, skuFilter]);

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

  useEffect(() => {
    // Fetch data
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchCustomerOnTab = async (index: number) => {
    setIsLoadingCustomer(true);
    if (!tabs[index].order.customerId) {
      setSelectedCustomer(undefined);
      setIsLoadingCustomer(false);
      return;
    }
    getCustomerById(tabs[index].order.customerId)
      .then((response) => {
        // console.log(response.data.data);
        setSelectedCustomer(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching customer:", error);
        toast.error("Lấy thông tin khách hàng thất bại");
      })
      .finally(() => {
        setIsLoadingCustomer(false);
      });
  };

  return (
    <Fragment>
      {isLoadingPage && <LoadingAnimation />}
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
              onTabChange={async (index) => {
                fetchCustomerOnTab(index).then(() => {
                  setActiveTab(index);
                  console.log(tabs[index].order.id);
                });
              }}
              onDeleteTab={(index: number) => {
                deleteTab(index);
              }}
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
          <div className="p-2 flex flex-col flex-grow h-full">
            {/* Order items */}
            <div className="flex flex-col flex-grow p-2 space-y-2 overflow-y-auto h-[0px]">
              {tabs[activeTab]?.order.items.length === 0 && (
                <div className="text-center text-gray-500">
                  Chưa có sản phầm nào trong đơn hàng
                </div>
              )}
              {tabs[activeTab]?.order?.items.map((item, index) => (
                <OrderItemCard
                  key={item.orderId + "" + item.skuId} // Ensure each card has a unique key
                  index={index + 1} // Optionally use 1-based indexing
                  item={item}
                  quantity={item.amount}
                  onRemove={() => handleOrderItemRemove(index)} // Remove this item from the order
                  onQuantityBlur={async (value) => {
                    return await handleOrderItemQuantityChange(index, value);
                  }}
                  onDescriptionBlur={(value) =>
                    handleOrderItemDescriptionChange(index, value)
                  }
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
                    onBlur={handleDescriptionBlur}
                    disabled={!tabs[activeTab]}
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
          <div className="p-2 w-[650px]">
            <Card className="p-2 flex flex-col h-full">
              {/*Filter*/}
              <div className="flex flex-row">
                <div className="relative w-3/4 flex items-center">
                  {isLoadingCustomer ? (
                    <div>Loading...</div>
                  ) : (
                    <CustomerSearch
                      customerValue={selectedCustomer}
                      onCustomerChange={(customer) => {
                        setSelectedCustomer(customer);
                        if (customer) {
                          // Update order with customer ID
                          updateOrder(tabs[activeTab]?.order.id, {
                            customerId: customer.id,
                          }).catch((error) => {
                            console.error(
                              "Error updating order with customer:",
                              error,
                            );
                            toast.error(
                              "Failed to update order with customer.",
                            );
                          });
                        } else {
                          // Remove customer from order
                          removeCustomer(tabs[activeTab]?.order.id).catch(
                            (error) => {
                              console.error(
                                "Error removing customer from order:",
                                error,
                              );
                              toast.error(
                                "Failed to remove customer from order.",
                              );
                            },
                          );
                        }
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-row flex-grow px-2 w-auto items-center justify-end gap-2">
                  <Button
                    onClick={() => setIsBrandFilterDialogOpen(true)}
                    className="p-1 h-7 w-7 bg-transparent text-black rounded-full shadow-none hover:bg-blue-200 hover:text-blue-800"
                  >
                    <List />
                  </Button>
                  <Button
                    onClick={() => setIsCategoryFilterDialogOpen(true)}
                    className="p-1 h-7 w-7 bg-transparent text-black rounded-full shadow-none hover:bg-blue-200 hover:text-blue-800"
                  >
                    <Filter />
                  </Button>
                </div>
              </div>

              {/*SPU list*/}
              <div
                ref={skuListRef}
                className="p-2 flex flex-wrap gap-2 items-start content-start"
                style={{
                  height: "calc(100vh - 210px)",
                  // width: "650px",
                }}
              >
                {isLoadingSku && <LoadingAnimation />}
                {skuData.map((sku) => (
                  <div key={sku.id} onClick={() => handleSkuClick(sku)}>
                    <SkuCard {...sku} />
                  </div>
                ))}
              </div>

              {/*Action*/}
              <div className="flex flex-row p-2 items-center mt-auto gap-10">
                <Pagination
                  page={skuFilter.page ? skuFilter.page : 1}
                  totalPages={totalPages}
                  onNext={() =>
                    setSkuFilter((prev) => ({
                      ...prev,
                      page: Math.min(prev.page ? prev.page + 1 : 1, totalPages),
                    }))
                  }
                  onPrevious={() =>
                    setSkuFilter((prev) => ({
                      ...prev,
                      page: Math.max(prev.page ? prev.page - 1 : 1, 1),
                    }))
                  }
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
          customer={selectedCustomer}
          orderDetails={tabs[activeTab]?.order}
          onPaymentSuccess={() => {
            const updatedTabs = tabs.filter((_, i) => i !== activeTab);
            setTabs(updatedTabs);

            setActiveTab((prevActiveTab) =>
              prevActiveTab > 0 ? prevActiveTab - 1 : 0,
            );

            // If there are no tabs left, create a new tab
            if (updatedTabs.length === 0) {
              addTab().catch((error) => {
                console.log("Error adding tab after deleting:", error);
              });
            }

            // Update sku list
            fetchSku();
          }}
        />
        <BrandFilterDialog
          onChange={handleChangedBrand}
          isOpen={isBrandFilterDialogOpen}
          onClose={() => setIsBrandFilterDialogOpen(false)}
          list={listBrands}
          value={brandSelected ? brandSelected : 0}
        />
        <CategoryFilterDialog
          onChange={handleChangedCategory}
          isOpen={isCategoryFilterDialogOpen}
          onClose={() => setIsCategoryFilterDialogOpen(false)}
          listCategories={listCategories}
          value={categorySelected ? categorySelected : 0}
        />
      </div>
    </Fragment>
  );
}
