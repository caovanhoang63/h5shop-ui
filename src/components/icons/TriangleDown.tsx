import { Triangle } from "lucide-react";

export default function TriangleDown() {
  return (
    <Triangle
      style={{ transform: "rotate(180deg)" }}
      className={`!size-2`}
      fill={"white"}
    ></Triangle>
  );
}
