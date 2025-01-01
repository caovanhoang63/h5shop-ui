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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEmployee } from "@/pages/employee/api/employeeApi.ts";
import { toast } from "react-toastify";

interface INewEmployeeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function NewEmployeeModal({
  isOpen,
  onOpenChange,
}: INewEmployeeModalProps) {
  const [createEmployeeRequest, setcreateEmployeeRequest] =
    useState<EmployeeCreate>();

  async function onSubmit() {
    try {
      const response = await createEmployee(
        createEmployeeRequest as EmployeeCreate,
      );
      console.log(response.data);
      toast.success("Tạo nhân viên thành công!", {
        position: "top-right",
        autoClose: 3000, // Tự động đóng sau 3 giây
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onOpenChange(false);
      window.location.reload();
    } catch (e) {
      console.log(e);
      toast.error("Tạo nhân viên thất bại!", {
        position: "top-right",
        autoClose: 3000, // Tự động đóng sau 3 giây
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl min-h-[calc(100vh-50%)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Thêm nhân viên mới</DialogTitle>
        </DialogHeader>
        <div className="grow">
          <div className="space-y-2 space-x-12 flex flex-row mt-6">
            <div className={"flex flex-row flex-1 space-x-12"}>
              <div className={"flex flex-col flex-1 space-y-5"}>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="firstName">
                    Tên nhân viên
                  </Label>
                  <Input
                    id="firstName"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      setcreateEmployeeRequest((prev) => ({
                        ...prev,
                        firstName: newValue,
                      }));
                      console.log(newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="phoneNumber">
                    Số điện thoại
                  </Label>
                  <Input
                    id="phoneNumber"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      setcreateEmployeeRequest((prev) => ({
                        ...prev,
                        phoneNumber: newValue,
                      }));
                      console.log(newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      setcreateEmployeeRequest((prev) => ({
                        ...prev,
                        email: newValue,
                      }));
                      console.log(newValue);
                    }}
                  />
                </div>
                <div className="flex flex-row items-center">
                  <Label className="w-5/12" htmlFor="gender">
                    Giới tính
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      setcreateEmployeeRequest((prev) => ({
                        ...prev,
                        gender: value,
                      }));
                      console.log(value);
                    }}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className={"flex flex-col flex-1 space-y-5"}>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="lastName">
                    Họ nhân viên
                  </Label>
                  <Input
                    id="lastName"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      setcreateEmployeeRequest((prev) => ({
                        ...prev,
                        lastName: newValue,
                      }));
                      console.log(newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="address">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      setcreateEmployeeRequest((prev) => ({
                        ...prev,
                        address: newValue,
                      }));
                      console.log(newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="dateOfBirth">
                    Ngày sinh
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      setcreateEmployeeRequest((prev) => ({
                        ...prev,
                        dateOfBirth: newValue,
                      }));
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
