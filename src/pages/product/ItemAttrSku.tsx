import { Input } from "@/components/ui/input.tsx";
import { Plus, Trash2Icon } from "lucide-react";
import { useState } from "react";

interface ItemAttrSkuProps {
  onDeleted: () => void;
}

export const ItemAttrSku: React.FC<ItemAttrSkuProps> = ({ onDeleted }) => {
  const [value, setValue] = useState<string[]>([]);

  const handleChangeItemInValue = (index: number, value: string) => {
    setValue((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const handleAddItemInValue = () => {
    setValue((prev) => [...prev, ""]);
  };

  return (
    <div className={"flex flex-row justify-between items-center"}>
      <Input placeholder={"Nhập tên thuộc tính"} style={{ width: "200px" }} />
      <button
        className={
          "bg-green-500 hover:bg-green-600 ml-20 flex justify-center items-center"
        }
        style={{
          height: "24px",
          width: "24px",
          borderRadius: "12px",
        }}
        onClick={handleAddItemInValue}
      >
        <Plus color={"white"} style={{ width: "16px", height: "16px" }} />
      </button>
      <div className={"flex flex-1 flex-wrap gap-2 ml-2"}>
        {value.map((item, index) => (
          <Input
            key={index}
            value={item}
            style={{ width: "80px" }}
            onChange={(e) => {
              handleChangeItemInValue(index, e.target.value);
            }}
          />
        ))}
      </div>
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
