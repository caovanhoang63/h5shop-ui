import { Card } from "@/components/ui/card.tsx";
import { Minus, MoreVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ChangeEvent, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { NoSpinnerNumberInput } from "@/components/NoSpinnerNumberInput.tsx";

interface OrderItemCardProps {
  index: number;
  id: string;
  name: string;
  quantity: number;
  originalPrice: number;
  discount: {
    type: string;
    value: number;
  };
  onDecreament: () => void;
  onIncreament: () => void;
  onRemove: () => void;
  onOriginalPriceChange: (newPrice: number) => void;
  onDiscountChange: (newDiscount: { type: string; value: number }) => void;
}
export function OrderItemCard({
  index,
  id,
  name,
  quantity,
  originalPrice,
  discount,
  onDecreament,
  onIncreament,
  onRemove,
  onOriginalPriceChange,
  onDiscountChange,
}: OrderItemCardProps): JSX.Element {
  const [itemDescription, setItemDescription] = useState("");
  // const [openPriceMenu, setOpenPriceMenu] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(discount);
  const [currentOriginalPrice, setOriginalPrice] = useState(originalPrice);

  // Calculate final price based on discount
  const finalPrice =
    discount.type === "percent"
      ? currentOriginalPrice - (currentOriginalPrice * discount.value) / 100
      : currentOriginalPrice - discount.value;

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemDescription(e.target.value);
  };

  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentDiscount({ ...currentDiscount, value });
    onDiscountChange({ ...currentDiscount, value });
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setOriginalPrice(value);
    onOriginalPriceChange(value);
  };

  const handleToggleDiscountType = () => {
    setCurrentDiscount({
      ...currentDiscount,
      type: currentDiscount.type === "percent" ? "amount" : "percent",
    });
  };

  return (
    <Card className="flex flex-col gap-2 p-4 shadow-md rounded-lg">
      <div className="flex items-center mb-2 gap-6">
        <span className="text-sm">{index}</span>
        <Button
          className="p-1 h-6 w-6 bg-background text-gray-600 hover:bg-gray-200 rounded-full shadow-none"
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
        <span className="md:w-1/5 text-sm">ID: {id}</span>
        <span className="text-sm">{name}</span>
        <Button className="p-1 ml-auto h-7 w-7 bg-background text-gray-600 hover:bg-gray-200 rounded-full shadow-none">
          <MoreVertical />
        </Button>
      </div>

      <div className="flex px-10 items-center justify-between">
        {/* Quantity */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={onDecreament}
            className="p-1 h-6 w-6 bg-gray-200 hover:bg-gray-300 rounded-full shadow-none"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </Button>
          <NoSpinnerNumberInput
            type="number"
            value={quantity}
            className="w-16 text-sm text-center border-b-2 border-gray-300 focus:border-b-primary focus:outline-none shadow-none rounded-none"
          />

          <Button
            onClick={onIncreament}
            className="p-1 h-6 w-6 bg-gray-200 hover:bg-gray-300 rounded-full shadow-none"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        {/* Price and Discount */}
        <div className="flex flex-row items-center gap-20">
          <div className="flex flex-col items-end align-middle">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-col items-end align-middle cursor-pointer">
                  <span className="w-24 text-end border-b-2 border-gray-300 text-sm text-gray-700">
                    {currentOriginalPrice}
                  </span>
                  <span className="w-24 text-end text-sm text-red-600">
                    {currentDiscount.type === "percent"
                      ? `- ${currentDiscount.value}%`
                      : `- ${currentDiscount.value}`}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                side="bottom"
                className="bg-white shadow-md rounded-md p-4 max-w-80 border border-gray-200"
              >
                <div className="flex flex-col gap-4">
                  {/* Original Price */}
                  <div className="flex flex-row w-60 items-center gap-2">
                    <span className="text-sm min-w-16 text-gray-600">
                      Đơn giá
                    </span>
                    <NoSpinnerNumberInput
                      value={currentOriginalPrice}
                      onChange={handlePriceChange}
                      className="p-0 w-auto text-end border-b-2 border-gray-300 focus:outline-none focus:border-primary rounded-none shadow-none"
                      placeholder="Nhập đơn giá"
                    />
                  </div>

                  {/* Discount */}
                  <div className="flex flex-row w-60 items-center gap-2">
                    <span className="text-sm min-w-16 text-gray-600">
                      Giảm giá
                    </span>
                    <NoSpinnerNumberInput
                      value={currentDiscount.value}
                      onChange={handleDiscountChange}
                      className="p-0 text-end border-b-2 border-gray-300 focus:outline-none focus:border-primary rounded-none shadow-none"
                      placeholder="Nhập giảm giá"
                    />

                    {/* Discount Type Toggle */}
                    <Button
                      variant="outline"
                      onClick={handleToggleDiscountType}
                      className="w-12 text-sm text-gray-600"
                    >
                      {currentDiscount.type === "percent" ? "%" : "VND"}
                    </Button>
                  </div>

                  {/* Sale Price */}
                  <div className="flex flex-row items-center gap-2">
                    <span className="min-w-16 text-sm text-gray-600">
                      Giá bán
                    </span>
                    <span className="text-end w-full font-semibold text-gray-900">
                      {finalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <span className="font-semibold text-gray-900">{finalPrice}</span>
        </div>
      </div>

      <div className="px-10">
        <Input
          value={itemDescription}
          onChange={handleDescriptionChange}
          className="bg-white p-2 rounded-md border-0 shadow-none"
          placeholder="Ghi chú..."
        />
      </div>
    </Card>
  );
}
