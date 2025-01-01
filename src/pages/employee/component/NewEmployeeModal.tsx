import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { BanIcon, FileInput } from "lucide-react";
import { useState } from "react";
import { EmployeeCreate } from "@/types/employee/employee.ts";

interface INewEmployeeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function NewEmployeeModal({
  isOpen,
  onOpenChange,
}: INewEmployeeModalProps) {
  const [createEmployee] = useState<EmployeeCreate>();
  async function onSubmit() {
    console.log(createEmployee);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl min-h-[calc(100vh-50%)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Thêm nhà nhân viên</DialogTitle>
        </DialogHeader>
        <div className="grow">
          <div className="space-y-2 space-x-12 flex flex-row mt-6">
            <div className={"flex flex-row flex-1 space-x-12"}>
              <div className={"flex flex-col flex-1 space-y-5"}>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="name">
                    Tên nhân viên
                  </Label>
                  <Input
                    id="firstName"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log(newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="brand">
                    Số điện thoại
                  </Label>
                  <Input
                    id="phoneNumber"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log(newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="brand">
                    Email
                  </Label>
                  <Input
                    id="email"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log(newValue);
                    }}
                  />
                </div>
              </div>
              <div className={"flex flex-col flex-1 space-y-5"}>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="costPrice">
                    Họ nhân viên
                  </Label>
                  <Input
                    id="lastName"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log(newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="brand">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log(newValue);
                    }}
                  />
                </div>{" "}
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="dateOfBirth">
                    Ngày sinh
                  </Label>
                  <Input
                    id="dateOfBirth"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log(newValue);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="">
          <div className={"flex flex-row space-x-2 justify-end"}>
            <Button
              className={"bg-green-500 hover:bg-green-600"}
              onClick={onSubmit}
            >
              <FileInput />
              Lưu
            </Button>
            <Button
              className={"bg-gray-500 hover:bg-gray-600"}
              onClick={() => onOpenChange(false)}
            >
              <BanIcon />
              Bỏ qua
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
