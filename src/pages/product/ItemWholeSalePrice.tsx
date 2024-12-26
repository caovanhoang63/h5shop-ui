import { Input } from "@/components/ui/input.tsx";
import { Trash2Icon } from "lucide-react";
import { SkuWholesalePriceCreate } from "@/types/spu/spuUpsert.ts";

interface ItemAttrSkuProps {
  onDeleted: () => void;
  wholeSalePrice: SkuWholesalePriceCreate;
  indexWholeSalePrice: number;
  setWholeSalePrice: (
    index: number,
    wholeSalePrice: SkuWholesalePriceCreate,
  ) => void;
}

export const ItemWholeSalePrice: React.FC<ItemAttrSkuProps> = ({
  onDeleted,
  wholeSalePrice,
  indexWholeSalePrice,
  setWholeSalePrice,
}) => {
  const handleChangeMinQuantity = (value: number) => {
    if (isNaN(value)) return;

    setWholeSalePrice(indexWholeSalePrice, {
      ...wholeSalePrice,
      minQuantity: value,
    });
  };

  const handleChangePrice = (value: number) => {
    if (isNaN(value)) return;

    setWholeSalePrice(indexWholeSalePrice, {
      ...wholeSalePrice,
      price: value,
    });
  };

  return (
    <div className={"flex flex-row justify-between items-center"}>
      <Input
        placeholder={"Số lượng"}
        style={{ width: "100px" }}
        value={wholeSalePrice.minQuantity}
        onChange={(e) => handleChangeMinQuantity(Number(e.target.value))}
      />
      <Input
        placeholder={"Giá"}
        style={{ width: "200px" }}
        value={wholeSalePrice.price}
        onChange={(e) => handleChangePrice(Number(e.target.value))}
      />
      <button
        className={"flex justify-center items-center hover:bg-gray-400"}
        style={{
          height: "30px",
          width: "30px",
          borderRadius: "15px",
        }}
        onClick={() => onDeleted()}
      >
        <Trash2Icon color={"black"} style={{ width: "20px", height: "20px" }} />
      </button>
    </div>
  );
};
