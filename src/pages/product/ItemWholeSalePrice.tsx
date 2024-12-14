import { Input } from "@/components/ui/input.tsx";
import { Trash2Icon } from "lucide-react";
import { ItemWholeSalePriceProps } from "@/pages/product/ItemSku.tsx";

interface ItemAttrSkuProps {
  onDeleted: () => void;
  wholeSalePrice: ItemWholeSalePriceProps;
}

export const ItemWholeSalePrice: React.FC<ItemAttrSkuProps> = ({
  onDeleted,
  wholeSalePrice,
}) => {
  return (
    <div className={"flex flex-row justify-between items-center"}>
      <Input
        placeholder={"Số lượng"}
        style={{ width: "100px" }}
        value={wholeSalePrice.min}
      />
      <Input
        placeholder={"Giá"}
        style={{ width: "200px" }}
        value={wholeSalePrice.value}
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
