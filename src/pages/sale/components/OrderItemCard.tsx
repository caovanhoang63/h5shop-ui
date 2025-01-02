import { Card } from "@/components/ui/card.tsx";
import { Info, Minus, MoreVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useCallback, useRef, useState } from "react";
import { NoSpinnerNumberInput } from "@/components/NoSpinnerNumberInput.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { SkuWholesalePrice } from "@/types/sku/skuGetDetail.ts";

interface OrderItemCardProps {
  index: number;
  id: number;
  name: string;
  quantity: number;
  stock: number;
  wholeSalePrices: SkuWholesalePrice[];
  description?: string;
  originalPrice: number;
  onRemove: () => void;
  onQuantityBlur: (newQuantity: number) => Promise<boolean>;
  onDescriptionBlur: (newDescription: string) => void;
}

export function OrderItemCard({
  index,
  id,
  name,
  quantity,
  stock,
  wholeSalePrices,
  description,
  originalPrice,
  onRemove,
  onQuantityBlur,
  onDescriptionBlur,
}: OrderItemCardProps): JSX.Element {
  const [localDescription, setLocalDescription] = useState(description);
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const safeOriginalPrice = Number(originalPrice) || 0;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const previousQuantityRef = useRef(quantity);
  // Calculate the final price
  const finalPrice = safeOriginalPrice * quantity;

  const handleDescriptionBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const newDescription = e.target.value;
      onDescriptionBlur(newDescription);
    },
    [onDescriptionBlur],
  );

  const handleQuantityBlur = useCallback(
    async (e: React.FocusEvent<HTMLInputElement>) => {
      const newQuantity = parseInt(e.target.value, 10) || 0;
      const isSuccess = await onQuantityBlur(newQuantity);
      if (!isSuccess) {
        // Revert to the previous quantity if update failed
        setLocalQuantity(previousQuantityRef.current);
      } else {
        // Update the previous quantity on success
        previousQuantityRef.current = newQuantity;
      }
    },
    [onQuantityBlur],
  );

  const preventInputBlur = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent the button from triggering input blur
  };

  const focusQuantityInput = () => {
    quantityInputRef.current?.focus();
  };

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
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="p-1 h-6 w-6 bg-background text-gray-600 hover:bg-gray-200 rounded-full shadow-none"
          >
            <Info />
          </Button>
        </div>
        <Button className="p-1 ml-auto h-7 w-7 bg-background text-gray-600 hover:bg-gray-200 rounded-full shadow-none">
          <MoreVertical />
        </Button>
      </div>

      <div className="flex px-10 items-center justify-between">
        {/* Quantity */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => {
                    setLocalQuantity((prevState) => prevState - 1);
                    focusQuantityInput();
                  }}
                  onMouseDown={preventInputBlur}
                  className="p-1 h-6 w-6 bg-gray-200 hover:bg-gray-300 opacity-0 group-hover:opacity-100 rounded-full shadow-none"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </Button>
                <NoSpinnerNumberInput
                  type="number"
                  value={localQuantity}
                  onChange={(e) => setLocalQuantity(parseInt(e.target.value))}
                  ref={quantityInputRef}
                  className="w-16 text-sm text-center border-b-2 border-gray-300 focus:border-b-primary focus:outline-none shadow-none rounded-none"
                  onBlur={handleQuantityBlur}
                />

                <Button
                  onClick={() => {
                    setLocalQuantity((prevState) => prevState + 1);
                    focusQuantityInput();
                  }}
                  onMouseDown={preventInputBlur}
                  className="p-1 h-6 w-6 bg-gray-200 hover:bg-gray-300 opacity-0 group-hover:opacity-100 rounded-full shadow-none"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent className="mt-2" side="bottom">
              <span>Tồn kho: {stock}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Price and Discount */}
        <div className="flex flex-row items-center gap-20">
          <div className="flex flex-col items-end align-middle">
            <span className="w-24 text-end border-b-2 border-gray-300 text-sm text-gray-700">
              {new Intl.NumberFormat("en-US").format(originalPrice)}
            </span>
          </div>
          <span className="font-semibold text-gray-900">
            {finalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="px-10">
        <Input
          value={localDescription ? localDescription : ""}
          onChange={(e) => setLocalDescription(e.target.value)}
          className="bg-white p-2 rounded-md border-0 shadow-none"
          placeholder="Ghi chú..."
          onBlur={handleDescriptionBlur}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thông tin sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Tồn kho: {stock}</p>
            <p>Giá sỉ:</p>
            <ul className="list-disc pl-5">
              {wholeSalePrices.map((price, idx) => (
                <li key={idx}>
                  Mua từ {price.minQuantity} trở lên:{" "}
                  {price.price.toLocaleString()} đ
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
