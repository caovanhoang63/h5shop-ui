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

interface InventoryItem {
  id: number;
  code: string;
  name: string;
  unit: string;
  stockQuantity: number;
  actualQuantity: number;
  variance: number;
  varianceValue: number;
}

export default function InventoryCheckPage() {
  const [items] = React.useState<InventoryItem[]>([
    {
      id: 1,
      code: "PK000014",
      name: "Chuột không dây Logitech M331",
      unit: "",
      stockQuantity: 90,
      actualQuantity: 56,
      variance: -34,
      varianceValue: 0,
    },
    {
      id: 1,
      code: "PK000014",
      name: "Chuột không dây Logitech M331",
      unit: "",
      stockQuantity: 90,
      actualQuantity: 56,
      variance: -34,
      varianceValue: 0,
    },
    {
      id: 1,
      code: "PK000014",
      name: "Chuột không dây Logitech M331",
      unit: "",
      stockQuantity: 90,
      actualQuantity: 56,
      variance: -34,
      varianceValue: 0,
    },
    {
      id: 1,
      code: "PK000014",
      name: "Chuột không dây Logitech M331",
      unit: "",
      stockQuantity: 90,
      actualQuantity: 56,
      variance: -34,
      varianceValue: 0,
    },
  ]);

  return (
    <div className=" mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/inventory" className="hover:opacity-80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-semibold">Kiểm kho</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 flex-1">
            <Input
              type="search"
              placeholder="PK000014"
              className="border-none shadow-none"
            />
            <Plus className="h-5 w-5 text-gray-500" />
          </div>
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
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[50px]">STT</TableHead>
                <TableHead>Mã hàng</TableHead>
                <TableHead>Tên hàng</TableHead>
                <TableHead>DVT</TableHead>
                <TableHead className="text-right">Tồn kho</TableHead>
                <TableHead className="text-right">Thực tế</TableHead>
                <TableHead className="text-right">SL lệch</TableHead>
                <TableHead className="text-right">Giá trị lệch</TableHead>
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
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="text-right">
                    {item.stockQuantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.actualQuantity}
                  </TableCell>
                  <TableCell className="text-right text-red-500">
                    {item.variance}
                  </TableCell>
                  <TableCell className="text-right">
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
