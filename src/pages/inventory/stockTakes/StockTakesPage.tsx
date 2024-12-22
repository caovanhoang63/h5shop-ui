import * as React from "react";
import {
  ArrowLeft,
  Plus,
  Printer,
  Eye,
  AlertCircle,
  Trash2,
  Pencil,
} from "lucide-react";
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
import { Link } from "react-router-dom";
import { InventoryItemStockTake } from "@/types/inventoryItemStockTake.ts";
import { useState } from "react";

export default function InventoryCheckPage() {
  const rawData = [
    {
      id: 1,
      code: "PK000014",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 90,
      variance: -34,
      varianceValue: 0,
    },
    {
      id: 2,
      code: "PK000014",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 90,
      variance: -34,
      varianceValue: 0,
    },
    {
      id: 3,
      code: "PK000084",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 90,
      variance: -34,
      varianceValue: 0,
    },
    {
      id: 4,
      code: "PK000019",
      name: "Chuột không dây Logitech M331",
      stockQuantity: 90,
      variance: -34,
      varianceValue: 0,
    },
  ];
  const searchData = [
    {
      id: 5,
      code: "PK000016",
      name: "Tai nghe Bluetooth Sony",
      stockQuantity: 100,
    },
    {
      id: 6,
      code: "PK000017",
      name: "Cáp sạc Lightning Apple",
      stockQuantity: 200,
    },
  ];
  const [items, setItems] = React.useState<InventoryItemStockTake[]>(
    rawData.map((item) => ({
      ...item,
      actualQuantity: 0,
      variance: 0,
      varianceValue: 0,
    })),
  );
  const [searchQuery, setSearchQuery] = useState(""); // Quản lý đầu vào tìm kiếm
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
  const handleAddItem = (product: InventoryItemStockTake) => {
    setItems((prevItems) => {
      setSearchQuery("");
      const exists = prevItems.some((item) => item.id === product.id);

      if (exists) return prevItems;

      return [
        ...prevItems,
        {
          ...product,
          actualQuantity: 0,
          variance: 0,
          varianceValue: 0,
        },
      ];
    });
  };
  const handleActualQuantityChange = (id: number, actualQuantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              actualQuantity,
              variance: actualQuantity - item.stockQuantity, // Tính lại SL lệch
              varianceValue: (actualQuantity - item.stockQuantity) * 10, // Ví dụ: tính giá trị lệch là 10
            }
          : item,
      ),
    );
  };
  return (
    <div className=" mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/inventory" className="hover:opacity-80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-semibold">Kiểm kho</h1>
          <div className="relative flex items-center gap-2 bg-white rounded-lg px-3 py-2 flex-1">
            <Input
              type="search"
              placeholder="Thêm sản phẩm"
              className=""
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Plus className="h-5 w-5 text-gray-500" />
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <AlertCircle className="h-4 w-4" />
          </Button>
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
                <TableHead className="text-center">Tồn kho</TableHead>
                <TableHead className="text-center">Thực tế</TableHead>
                <TableHead className="text-center">SL lệch</TableHead>
                <TableHead className="text-center">Giá trị lệch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Trash2 className="h-4 w-4 text-gray-500 cursor-pointer hover:text-red-500" />
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="text-blue-600">{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-center">
                    {item.stockQuantity}
                  </TableCell>
                  <TableCell className="text-center items-center flex justify-center">
                    <Input
                      type="number"
                      placeholder="SL"
                      className="shadow-none w-[60px] text-center"
                      value={item.actualQuantity}
                      onChange={(e) =>
                        handleActualQuantityChange(
                          item.id,
                          Number(e.target.value),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center text-red-500">
                    {item.variance}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.varianceValue}
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
                <span>56</span>
              </div>
            </div>

            <div className="pt-4">
              <Input placeholder="Ghi chú" />
            </div>

            <Button className="w-full bg-green-500 hover:bg-green-600">
              Hoàn thành
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
