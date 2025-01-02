import * as Yup from "yup";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { format } from "date-fns";
import { CustomerGender } from "@/types/customer/customer.ts";
import { toast } from "react-toastify";
import {
  CustomerCreate,
  customerCreateSchema,
} from "@/types/customer/customerCreate.ts";
import { createCustomer } from "@/pages/sale/api/customerApi.ts";

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<CustomerCreate>({
    phoneNumber: "",
    address: undefined,
    firstName: "",
    lastName: "",
    dateOfBirth: undefined,
    gender: CustomerGender.Male,
  });

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      customerCreateSchema.validateSync(formData, { abortEarly: true }); // Stops at the first error
      const newCustomer: CustomerCreate = {
        ...formData,
      };

      console.log("Creating Customer: ", newCustomer);
      await fetchCreateCustomer(newCustomer);

      handleClose();
    } catch (error: unknown) {
      if (error instanceof Yup.ValidationError) {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Handle other unexpected errors
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      phoneNumber: "",
      address: "",
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      gender: CustomerGender.Other,
    });
    onClose();
  };

  const fetchCreateCustomer = async (customer: CustomerCreate) => {
    try {
      const res = await createCustomer(customer);
      toast.success("Tạo khách hàng thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return res.data;
    } catch (error: unknown) {
      // Log the error
      console.error("Create customer error:", error);

      // Check if the error is an AxiosError or has a message
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi không xác định!";

      // Show error toast
      toast.error(`Tạo khách hàng thất bại! ${errorMessage}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      throw error; // Re-throw the error for further handling
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo khách hàng mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Số điện thoại
            </Label>
            <Input
              id="phoneNumber"
              placeholder="Số điện thoại"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Họ
              </Label>
              <Input
                id="lastName"
                placeholder="Họ"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="firstName" className="text-sm font-medium">
                Tên
              </Label>
              <Input
                id="firstName"
                placeholder="Tên"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Địa chỉ
            </Label>
            <Input
              id="address"
              placeholder="Địa chỉ"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                Ngày sinh
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full text-left">
                    {formData.dateOfBirth
                      ? format(new Date(formData.dateOfBirth), "dd/MM/yyyy")
                      : "Chọn ngày sinh"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    onSelect={(date) => handleChange("dateOfBirth", date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <Label htmlFor="gender" className="text-sm font-medium">
                Giới tính
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  handleChange("gender", value as CustomerGender)
                }
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CustomerGender.Male}>Nam</SelectItem>
                  <SelectItem value={CustomerGender.Female}>Nữ</SelectItem>
                  <SelectItem value={CustomerGender.Other}>Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Lưu
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
