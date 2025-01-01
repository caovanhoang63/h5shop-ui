import * as React from "react";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
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
import { useState } from "react";
import {
  StockInCreate,
  StockInItemAdd,
  StockInItemSearch,
} from "@/types/stockIn/stockIn.ts";
import { createStockInReport } from "@/pages/inventory/stockIn/api/stockInApi.ts";

export default function StockInAddPage() {
  const rawData: StockInItemAdd[] = [];
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const searchData = [
    {
      id: 5,
      code: "PK000016",
      name: "Tai nghe Bluetooth Sony",
      amount: 100,
      price: 1200000,
    },
    {
      id: 6,
      code: "PK000017",
      name: "Cáp sạc Lightning Apple",
      amount: 200,
      price: 1200000,
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredProducts(searchData);
    } else {
      const filtered = searchData.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
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
          price: product.price || 0,
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
  const handleAmountChange = (id: number, amount: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              amount,
            }
          : item,
      ),
    );
  };
  const handleComplete = async () => {
    if (items.length === 0) {
      return;
    }
    const report: StockInCreate = {
      warehouseMen: 8,
      providerId: 1,
      items: items.map((item) => ({
        skuId: item.id,
        amount: item.amount,
        totalPrice: item.totalPrice,
      })),
    };

    try {
      const response = await createStockInReport(report);
      console.log("Báo cáo nhập kho đã được tạo:", response);
      navigate("/stock-in");
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo kiểm kho:", error);
    }
  };
  return (
    <div className=" mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 ">
          <Link to="/inventory" className="hover:opacity-80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-semibold">Nhập hàng</h1>
          <div className="relative flex items-center gap-2 bg-white rounded-lg px-3 py-2 flex-1 w-[300px]">
            <Input
              type="search"
              placeholder="Tìm hàng hóa theo tên sản phẩm"
              className="w-full "
              value={searchQuery}
              onChange={handleSearchChange}
            />
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
                    <span className="font-medium">{product.name}</span> -{" "}
                    <span className="text-gray-500">{product.code}</span>
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
                      value={item.price}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {(item.totalPrice = item.price * item.amount)}
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
              <Pencil className="h-4 w-4 text-gray-500" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mã kiểm kho</span>
                <span>Mã phiếu tự động</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Trạng thái</span>
                <span>Phiếu tạm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tổng SL thực tế</span>
                <span>{calculateTotalActualQuantity()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tổng tiền hàng</span>
                <span>{calculateTotalActualQuantity()}</span>
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
