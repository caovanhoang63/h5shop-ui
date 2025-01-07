import * as React from "react";
import { ArrowLeft, Trash2, Pencil, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  StockInCreate,
  StockInItemAdd,
  StockInItemSearch,
} from "@/types/stockIn/stockIn.ts";
import {
  createStockInReport,
  searchProvider,
  searchSku,
} from "@/pages/inventory/stockIn/api/stockInApi.ts";
import { formatCurrency } from "@/utils/convert.ts";
import _ from "lodash";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/userStore.ts";
import NewPartnerModalStockIn from "@/pages/inventory/stockIn/NewPartnerModalStockIn.tsx";
import SpuModal from "@/pages/product/SpuModal.tsx";
import { Category } from "@/types/category/category.ts";
import { Brand } from "@/types/brand/brand.ts";
import { getBrands } from "@/pages/product/api/brandApi.ts";
import { getCategories } from "@/pages/product/api/categoryApi.ts";

export default function StockInAddPage() {
  const rawData: StockInItemAdd[] = [];
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const userProfile = useUserStore((store) => store.user);
  const [items, setItems] = React.useState<StockInItemAdd[]>(
    rawData.map((item) => ({
      ...item,
      price: 0,
      amount: 0,
    })),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProviderQuery, setSearchProviderQuery] = useState("");
  const [filteredProviders, setFilteredProviders] = useState<
    [
      {
        id: number;
        phoneNumber: string;
        name: string;
      },
    ]
  >();
  const [filteredProducts, setFilteredProducts] = useState<
    [
      {
        id: number;
        name: string;
        amount: number;
        price: number;
        url: string;
      },
    ]
  >();
  const [selectedProvider, setSelectedProvider] = useState<number>(-1);
  const debouncedSearch = useMemo(
    () =>
      _.debounce(async (query: string) => {
        if (query.trim() === "") {
          setFilteredProducts(undefined);
        } else {
          try {
            const response = await searchSku(query);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const searchResponse = response.data.map((item) => ({
              id: item.id,
              name: item.name,
              code: item.code,
              amount: item.amount,
              price: item.price,
            }));
            setFilteredProducts(searchResponse);
          } catch (error) {
            console.error(error);
          }
        }
      }, 300),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleAddItem = (product: StockInItemSearch) => {
    setItems((prevItems) => {
      setSearchQuery("");
      const exists = prevItems.some((item) => item.id === product.id);

      if (exists) return prevItems;

      return [
        ...prevItems,
        {
          ...product,
          amount: 0,
          costPrice: 0,
          totalPrice: 0,
        },
      ];
    });
  };

  const handleSearchProviderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const query = e.target.value;
    if (query.trim() === "") setSelectedProvider(-1);
    setSearchProviderQuery(query);
    debouncedSearchProvider(query);
  };

  const debouncedSearchProvider = useMemo(
    () =>
      _.debounce(async (query: string) => {
        if (query.trim() === "") {
          setFilteredProviders(undefined);
        } else {
          try {
            const response = await searchProvider(query);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const searchResponse = response.data.map((item) => ({
              id: item.id,
              name: item.name,
              phoneNumber: item.phoneNumber,
            }));
            setFilteredProviders(searchResponse);
          } catch (error) {
            console.error(error);
          }
        }
      }, 300),
    [],
  );

  const handleRemoveItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  const calculateTotalActualQuantity = () => {
    return items.reduce((total, item) => total + item.amount, 0);
  };
  const calculateTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.costPrice * item.amount,
      0,
    );
  };
  const handleAmountChange = (id: number, amount: number) => {
    if (amount > 99999) amount = 99999;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && amount >= 0 && amount <= 99999
          ? {
              ...item,
              amount: amount,
            }
          : item,
      ),
    );
  };

  const handlePriceChange = (id: number, price: string) => {
    let priceValue = Number(price);
    if (priceValue > 999999999) priceValue = 999999999;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && priceValue >= 0 && priceValue <= 999999999
          ? {
              ...item,
              costPrice: priceValue,
            }
          : item,
      ),
    );
  };

  const handleComplete = async () => {
    if (items.length === 0) {
      toast.warning("Không có sản phẩm nào  !", {
        closeOnClick: true,
      });
      return;
    }

    if (items.some((item) => item.amount === 0)) {
      toast.warning("Vui lòng nhập số lượng  !", {
        closeOnClick: true,
      });
      return;
    }
    console.log("nha cung cap", selectedProvider);
    if (selectedProvider === -1) {
      toast.warning("Vui lòng chọn nhà cung cấp  !", {
        closeOnClick: true,
      });
      return;
    }
    const report: StockInCreate = {
      warehouseMen: userProfile?.id || 1,
      providerId: selectedProvider || 1,
      totalPrice: calculateTotalPrice() || 0,
      items: items.map((item) => ({
        skuId: item.id,
        amount: item.amount,
        costPrice: item.costPrice,
        totalPrice: item.totalPrice,
      })),
    };
    try {
      const response = await createStockInReport(report);
      toast.success("Nhập hàng thành công!", {
        closeOnClick: true,
      });
      console.log("Báo cáo nhập kho đã được tạo:", response);
      navigate("/stock-in");
    } catch (error) {
      toast.error("Nhập hàng thất bại!");
      console.error("Lỗi khi tạo báo cáo kiểm kho:", error);
    }
  };
  const [isOpenNewPartnerModal, setIsOpenNewPartnerModal] = useState(false);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [isOpenModalSpu, setIsOpenModalSpu] = useState<boolean>(false);
  const handleCloseModalSpu = () => {
    setIsOpenModalSpu(false);
  };
  const [listCategories, setListCategories] = useState<Category[]>([]);
  const [listBrands, setListBrands] = useState<Brand[]>([]);
  const handleActionSuccessSpuModal = () => {
    setIsOpenModalSpu(false);
  };
  const fetchBrands = async () => {
    try {
      const response = await getBrands();
      setListBrands(response.data);
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
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);
  return (
    <div className=" mx-auto p-4">
      <NewPartnerModalStockIn
        isOpen={isOpenNewPartnerModal}
        onOpenChange={setIsOpenNewPartnerModal}
      />
      <SpuModal
        isAdd={isAdd}
        isOpen={isOpenModalSpu}
        onOpenChange={handleCloseModalSpu}
        listCategories={listCategories}
        listBrands={listBrands}
        actionSuccess={handleActionSuccessSpuModal}
      />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 ">
          <Link to="/stock-in" className="hover:opacity-80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-semibold">Nhập hàng</h1>
          <div className="relative flex items-center gap-2 bg-white rounded-lg px-3 py-2 flex-1 w-[400px]">
            <Input
              type="search"
              placeholder="Tìm hàng hóa theo tên sản phẩm"
              className="w-full "
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button
              variant={"ghost"}
              onClick={() => {
                setIsOpenModalSpu(true);
                setIsAdd(true);
              }}
            >
              <PlusCircle className="h-6 w-6" />
            </Button>

            {/*
            <Plus className="h-5 w-5 text-gray-500" />
*/}
            {filteredProducts &&
              filteredProducts.length > 0 &&
              searchQuery.trim() !== "" && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white border rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleAddItem(product)}
                    >
                      <span className="text-gray-500">{product.id}</span>
                      {" - "}
                      <span className="font-medium">{product.name}</span>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="flex gap-6 h-full">
        {/* Main Content */}
        <div className="flex-1 h-full">
          <Table className={"h-full"}>
            <TableHeader>
              <TableRow className={"gap-3"}>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[50px]">STT</TableHead>
                <TableHead>Mã hàng</TableHead>
                <TableHead>Tên hàng</TableHead>
                <TableHead className="text-center">Số lượng</TableHead>
                <TableHead className="text-center">Đơn giá</TableHead>
                <TableHead className="text-center">Tổng giá trị</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Trash2
                      className="h-4 w-4 text-gray-500 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveItem(item.id)}
                    />
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="text-blue-600">{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>

                  <TableCell className="text-center items-center flex justify-center">
                    <Input
                      type="number"
                      placeholder="SL"
                      className="shadow-none w-fit text-center"
                      value={item.amount}
                      onChange={(e) =>
                        handleAmountChange(item.id, Number(e.target.value))
                      }
                    />
                  </TableCell>

                  <TableCell className="">
                    <Input
                      type="text"
                      placeholder="Đơn giá"
                      className="shadow-none w-fit text-center"
                      value={Intl.NumberFormat("en-US").format(item.costPrice)}
                      onChange={(e) =>
                        handlePriceChange(
                          item.id,
                          e.target.value.replace(/,/g, ""),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {formatCurrency(
                      (item.totalPrice = item.costPrice * item.amount),
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Sidebar */}
        <Card className="w-[300px]">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>
                {userProfile?.firstName + " " + userProfile?.lastName}
              </span>
              <Pencil className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center justify-between text-sm relative">
              <Input
                placeholder="Tìm nhà cung cấp"
                value={searchProviderQuery}
                onChange={handleSearchProviderChange}
              />
              <Button
                variant={"ghost"}
                onClick={() => {
                  setIsOpenNewPartnerModal(true);
                }}
                className={"rounded-full "}
              >
                <PlusCircle
                  className={
                    "h-4 w-4 text-gray-500 cursor-pointer hover:text-red-500"
                  }
                />
              </Button>
              {filteredProviders &&
                filteredProviders.length > 0 &&
                searchProviderQuery.trim() !== "" && (
                  <div className="absolute top-full mt-2 left-0 w-full bg-white border rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
                    {filteredProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSearchProviderQuery(provider.name);
                          setFilteredProviders(undefined);
                          setSelectedProvider(provider.id);
                        }}
                      >
                        <span className="text-gray-500">{provider.id}</span>
                        {" - "}
                        <span className="font-medium">{provider.name}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mã kiểm kho</span>
                <span>Mã phiếu tự động</span>
              </div>
              {/*<div className="flex justify-between text-sm">
                <span className="text-gray-500">Trạng thái</span>
                <span>Phiếu tạm</span>
              </div>*/}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tổng SL thực tế</span>
                <span>{calculateTotalActualQuantity()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tổng tiền hàng</span>
                <span>{formatCurrency(calculateTotalPrice())}</span>
              </div>
            </div>

            <div className="pt-4">
              <Input
                placeholder="Ghi chú"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <Button
              onClick={handleComplete}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Hoàn thành
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
