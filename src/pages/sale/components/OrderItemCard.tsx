import { Card } from "@/components/ui/card.tsx";
import { Info, Minus, MoreVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ChangeEvent, useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { NoSpinnerNumberInput } from "@/components/NoSpinnerNumberInput.tsx";
import { NoSpinnerFloatInput } from "@/components/NoSpinnerFloatInput.tsx";

interface OrderItemCardProps {
  index: number;
  id: number;
  name: string;
  quantity: number;
  originalPrice: number;
  discount: number;
  onDecreament: () => void;
  onIncreament: () => void;
  onRemove: () => void;
  onDiscountChange: (newDiscount: number) => void;
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
  onDiscountChange,
}: OrderItemCardProps): JSX.Element {
  const [itemDescription, setItemDescription] = useState("");
  const [currentDiscountType, setCurrentDiscountType] = useState<
    "percent" | "amount"
  >(discount > 0 && discount <= 100 ? "percent" : "amount");
  const [currentDiscountValue, setCurrentDiscountValue] = useState<number>(
    currentDiscountType === "percent"
      ? (discount / originalPrice) * 100
      : discount,
  );

  const safeOriginalPrice = Number(originalPrice) || 0;
  // Calculate the displayed discount in amount format
  const computedDiscount =
    currentDiscountType === "percent"
      ? (safeOriginalPrice * currentDiscountValue) / 100
      : currentDiscountValue;

  // Calculate the final price
  const finalPrice = safeOriginalPrice - computedDiscount;

  const handleDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setItemDescription(e.target.value);
    },
    [],
  );

  const handleDiscountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let value = parseFloat(e.target.value) || 0;

      if (currentDiscountType === "percent") {
        value = Math.min(Math.max(value, 0), 100); // Clamp percent between 0 and 100
      } else {
        value = Math.min(Math.max(value, 0), safeOriginalPrice); // Clamp amount to original price
      }

      setCurrentDiscountValue(value);

      const computedValue =
        currentDiscountType === "percent"
          ? (safeOriginalPrice * value) / 100
          : value;
      onDiscountChange(computedValue); // Always return the discount as amount
    },
    [currentDiscountType, safeOriginalPrice, onDiscountChange],
  );

  const handleToggleDiscountType = useCallback(() => {
    const newType = currentDiscountType === "percent" ? "amount" : "percent";

    const newValue =
      newType === "percent"
        ? (currentDiscountValue / safeOriginalPrice) * 100
        : (safeOriginalPrice * currentDiscountValue) / 100;

    setCurrentDiscountType(newType);
    setCurrentDiscountValue(newValue);
  }, [currentDiscountType, currentDiscountValue, safeOriginalPrice]);

  return (
    <Card className="flex flex-col gap-2 p-4 shadow-md rounded-lg hover:border-primary group">
      <div className="flex items-center mb-2 gap-6">
        <span className="text-sm">{index}</span>
        <Button
          className="p-1 h-6 w-6 bg-background text-gray-600 hover:bg-gray-200 rounded-full shadow-none"
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
        <span className="md:w-1/5 text-sm">ID: {id}</span>
        <div>
          <span className="text-sm">{name}</span>
          <Button className="p-1 h-6 w-6 bg-background text-gray-600 hover:bg-gray-200 rounded-full shadow-none">
            <Info />
          </Button>
        </div>
        <Button className="p-1 ml-auto h-7 w-7 bg-background text-gray-600 hover:bg-gray-200 rounded-full shadow-none">
          <MoreVertical />
        </Button>
      </div>

      <div className="flex px-10 items-center justify-between">
        {/* Quantity */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={onDecreament}
            className="p-1 h-6 w-6 bg-gray-200 hover:bg-gray-300 opacity-0 group-hover:opacity-100 rounded-full shadow-none"
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
            className="p-1 h-6 w-6 bg-gray-200 hover:bg-gray-300 opacity-0 group-hover:opacity-100 rounded-full shadow-none"
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
                    {new Intl.NumberFormat("en-US").format(originalPrice)}
                  </span>
                  {computedDiscount > 0 && (
                    <span className="w-24 text-end text-sm text-red-600">
                      {currentDiscountType === "percent"
                        ? `- ${new Intl.NumberFormat("en-US").format(currentDiscountValue)}%`
                        : `- ${new Intl.NumberFormat("en-US").format(computedDiscount)}`}
                    </span>
                  )}
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
                    <span className="text-end w-full">
                      {new Intl.NumberFormat("en-US").format(originalPrice)}
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="flex flex-row w-60 items-center gap-2">
                    <span className="text-sm min-w-16 text-gray-600">
                      Giảm giá
                    </span>
                    <NoSpinnerFloatInput
                      value={currentDiscountValue}
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
                      {currentDiscountType === "percent" ? "%" : "VND"}
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
          <span className="font-semibold text-gray-900">
            {finalPrice.toLocaleString()}
          </span>
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
