import { Input } from "@/components/ui/input.tsx";
import { Plus, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { SkuAttrCreate } from "@/types/spu/spuUpsert.ts";

interface ItemAttrSkuProps {
  onDeleted: () => void;
  attribute: SkuAttrCreate;
  indexAttr: number;
  setAttribute: (index: number, attribute: SkuAttrCreate) => void;
}

export const ItemAttrSku: React.FC<ItemAttrSkuProps> = ({
  onDeleted,
  attribute,
  indexAttr,
  setAttribute,
}) => {
  const [values, setValues] = useState<string[]>([]);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (attribute) {
      setValues(attribute.value?.map((v) => v.toString()) || []);
      setName(attribute.name);
    }
  }, [attribute]);

  const handleChangeItemInValue = (index: number, value: string) => {
    //setValues((prev) => prev.map((v, i) => (i === index ? value : v)));
    const newValue = values.map((v, i) => (i === index ? value : v));
    setAttribute(indexAttr, { ...attribute, value: newValue });
  };

  const handleAddItemInValue = () => {
    //setValues((prev) => [...prev, ""]);
    setAttribute(indexAttr, { ...attribute, value: [...values, ""] });
  };

  const handleChangeName = (value: string) => {
    setName(value);
    setAttribute(indexAttr, { ...attribute, name: value });
  };

  return (
    <div className={"flex flex-row justify-between items-center"}>
      <Input
        placeholder={"Nhập tên thuộc tính"}
        style={{ width: "200px" }}
        value={name}
        onChange={(e) => handleChangeName(e.target.value)}
      />
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
        {values.map((item, index) => (
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
