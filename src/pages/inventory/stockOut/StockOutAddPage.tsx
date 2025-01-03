import * as React from "react";
import { ArrowLeft, Trash2, PlusCircle } from "lucide-react";
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
import { StockInItemAdd, StockInItemSearch } from "@/types/stockIn/stockIn.ts";
import {
  listReason,
  searchSku,
} from "@/pages/inventory/stockOut/api/stockOutApi.ts";
import { formatCurrency } from "@/utils/convert.ts";
import _ from "lodash";
import { toast } from "react-toastify";
import {
  StockOutCreate,
  StockOutItemAdd,
  StockOutReason,
} from "@/types/stockOut/stockOut.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { createStockOutReport } from "@/pages/inventory/stockOut/api/stockOutApi.ts";

export default function StockOutAddPage() {
  const rawData: StockOutItemAdd[] = [];
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const searchData = [
    {
      id: 0,
      code: "",
      name: "",
      amount: 0,
      price: 0,
      url: "",
    },
  ];
  const [items, setItems] = React.useState<StockInItemAdd[]>(
    rawData.map((item) => ({
      ...item,
      price: 0,
      amount: 0,
    })),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(searchData);
  const debouncedSearch = useMemo(
    () =>
      _.debounce(async (query: string) => {
        if (query.trim() === "") {
          setFilteredProducts(searchData);
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
      }, 700),
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
          costPrice: product.price || 0,
          totalPrice: 0,
        },
      ];
    });
  };

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
    if (amount <= 0) amount = 0;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              amount: amount,
            }
          : item,
      ),
    );
  };

  const handleComplete = async () => {
    if (items.length === 0) {
      toast.warning("Không có sản phẩm nào!");
      return;
    }
    if (selectedReason === "") {
      toast.warning("Chưa chọn lý do xuất hàng!");
      return;
    }
    const report: StockOutCreate = {
      warehouseMen: 1,
      stockOutReasonId: Number(selectedReason),
      items: items.map((item) => ({
        skuId: item.id,
        amount: item.amount,
        costPrice: item.costPrice,
        totalPrice: item.totalPrice,
      })),
    };
    try {
      const response = await createStockOutReport(report);
      toast.success("Nhập hàng thành công!");
      console.log("Báo cáo nhập kho đã được tạo:", response);
      navigate("/stock-in");
    } catch (error) {
      toast.error("Nhập hàng thất bại!");
      console.error("Lỗi khi tạo báo cáo kiểm kho:", error);
    }
  };
  const [stockOutReason, setStockOutReason] = useState<StockOutReason[]>([]);
  const [selectedReason, setSelectedReason] = useState("");
  const getListReason = async () => {
    try {
      const response = await listReason();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setStockOutReason(response.data);
    } catch (error) {
      toast.error("Lỗi hệ thống!");
      console.log(error);
    }
  };
  useEffect(() => {
    getListReason();
  }, []);
  return (
    <div className=" mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 ">
          <Link to="/stock-out" className="hover:opacity-80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-semibold"> Xuất hàng</h1>
          <div className="relative flex items-center gap-2 bg-white rounded-lg px-3 py-2 flex-1 w-[400px]">
            <Input
              type="search"
              placeholder="Tìm hàng hóa theo tên sản phẩm"
              className="w-full "
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button variant={"ghost"}>
              <PlusCircle className="h-6 w-6" />
            </Button>

            {/*
            <Plus className="h-5 w-5 text-gray-500" />
*/}
            {filteredProducts.length > 0 && searchQuery.trim() !== "" && (
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

                  <TableCell className="text-center">
                    {formatCurrency(item.costPrice)}
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
              <span>Nguyễn Huỳnh Duy Hiếu</span>
            </div>
            <div className="flex items-center justify-between text-sm relative">
              <Select onValueChange={(value) => setSelectedReason(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lý do xuất hàng" />
                </SelectTrigger>
                <SelectContent>
                  {stockOutReason.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
