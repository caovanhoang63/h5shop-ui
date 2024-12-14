import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { MenuIcon } from "lucide-react";
import TriangleDown from "@/components/icons/TriangleDown.tsx";
import { CheckBoxWithText } from "@/components/CheckBoxWithText.tsx";

export interface MenuVisibilityColumnTable {
  label: string;
  key: string;
  visible: boolean;
}

interface ButtonVisibilityColumnTableProps {
  menus: MenuVisibilityColumnTable[];
  onCheckChange: (key: string, visible: boolean) => void;
}

export const ButtonVisibilityColumnTable: React.FC<
  ButtonVisibilityColumnTableProps
> = ({ menus, onCheckChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={"bg-green-500"}>
          <MenuIcon />
          <TriangleDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={"bottom"} align={"end"}>
        <div
          style={{
            width: "400px",
            padding: "10px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {menus.map((field, index) => (
            <label
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                width: "48%", // Chiếm 50% chiều ngang trừ khoảng cách
                margin: "5px 0",
              }}
            >
              <CheckBoxWithText
                checked={field.visible}
                onCheckChange={(check) =>
                  onCheckChange(field.key, check === true)
                }
              >
                {field.label}
              </CheckBoxWithText>
            </label>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
