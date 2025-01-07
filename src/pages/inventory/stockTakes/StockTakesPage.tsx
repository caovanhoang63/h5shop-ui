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
import { InventoryItemStockTake } from "@/types/inventory/inventoryItemStockTake.ts";
import { useMemo, useState } from "react";
import { createInventoryReport } from "@/pages/inventory/api/reportApi.ts";
import { InventoryReportCreate } from "@/types/inventory/inventoryReport.ts";
import { toast } from "react-toastify";
import _ from "lodash";
import { searchSku } from "@/pages/inventory/stockIn/api/stockInApi.ts";
import { formatCurrency } from "@/utils/convert.ts";
import { useUserStore } from "@/stores/userStore.ts";

export default function InventoryCheckPage() {
  const rawData: InventoryItemStockTake[] = [];
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const userProfile = useUserStore((store) => store.user);
  const [items, setItems] = React.useState<InventoryItemStockTake[]>(
    rawData.map((item) => ({
      ...item,
      actualQuantity: 0,
      variance: 0,
      varianceValue: 0,
    })),
  );

  const [searchSkuQuery, setSearchSkuQuery] = useState("");
  const [filteredProviders, setFilteredProviders] = useState<
    {
      id: number;
      stock: number;
      name: string;
      price: number;
    }[]
  >();
  const handleSearchSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchSkuQuery(query);
    debouncedSearchSku(query);
  };

  const debouncedSearchSku = useMemo(
    () =>
      _.debounce(async (query: string) => {
        if (query.trim() === "") {
          setFilteredProviders(undefined);
        } else {
          try {
            const response = await searchSku(query);

            const searchResponse = response.data.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              stock: item.stock,
            }));
            setFilteredProviders(searchResponse);
          } catch (error) {
            console.error(error);
          }
        }
      }, 600),
    [],
  );
  const handleAddItem = (product: InventoryItemStockTake) => {
    setItems((prevItems) => {
      setSearchSkuQuery("");
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
  const handleRemoveItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  const handleActualQuantityChange = (id: number, actualQuantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && actualQuantity >= 0
          ? {
              ...item,
              actualQuantity,
              variance: actualQuantity - item.stock,
              varianceValue: (actualQuantity - item.stock) * (item.price || 0),
            }
          : item,
      ),
    );
  };
  const calculateTotalActualQuantity = () => {
    return items.reduce((total, item) => total + (item.actualQuantity || 0), 0);
  };
  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + (item.varianceValue || 0), 0);
  };
  const handleComplete = async () => {
    if (items.length === 0) {
      toast.warning("Không có sản phẩm!", {
        closeOnClick: true,
      });
      return;
    }
    const report: InventoryReportCreate = {
      warehouseMan1: 2,
      note: note,
      items: items.map((item) => ({
        skuId: item.id,
        amount: item.actualQuantity ?? 0,
        oldStock: item.stock,
        inventoryDif: item.variance ?? 0,
      })),
    };

    try {
      const response = await createInventoryReport(report);
      console.log("Báo cáo kiểm kho đã được tạo:", response);
      toast.success("Kiểm kho thành công!");
      navigate("/inventory");
    } catch (error) {
      toast.error("Kiểm kho thất bại!");
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
          <h1 className="text-xl font-semibold">Kiểm kho</h1>
          <div className="relative flex items-center gap-2 bg-white rounded-lg px-3 py-2 flex-1 w-[300px]">
            <Input
              type="search"
              placeholder="Tìm hàng hóa theo tên sản phẩm"
              className="w-full "
              value={searchSkuQuery}
              onChange={handleSearchSkuChange}
            />
            {/*
            <Plus className="h-5 w-5 text-gray-500" />
*/}
            {filteredProviders &&
              filteredProviders.length > 0 &&
              searchSkuQuery.trim() !== "" && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white border rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
                  {filteredProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleAddItem(provider);
                        setFilteredProviders(undefined);
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
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Trash2
                      className="h-4 w-4 text-gray-500 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveItem(item.id)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="text-blue-600">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-center">{item.stock}</TableCell>
                  <TableCell className="text-center items-center flex justify-center">
                    <Input
                      type="number"
                      placeholder="SL"
                      className="shadow-none w-fit p-0 text-center"
                      value={item.actualQuantity}
                      onChange={(e) =>
                        handleActualQuantityChange(
                          item.id,
                          Number(e.target.value),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell
                    className={`text-center ${item.variance && item.variance > 0 ? "text-success" : "text-red-500"}`}
                  >
                    {item.variance}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatCurrency(Number(item.varianceValue))}
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

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mã kiểm kho</span>
                <span>Mã phiếu tự động</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tổng SL thực tế</span>
                <span>{calculateTotalActualQuantity()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tổng Giá trị lệch</span>
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
