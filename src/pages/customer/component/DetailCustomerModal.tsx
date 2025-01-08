import * as Yup from "yup";
import React, { useEffect, useState } from "react";
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
import { Customer, CustomerGender } from "@/types/customer/customer.ts";
import { toast } from "react-toastify";
import { updateCustomer } from "@/pages/sale/api/customerApi.ts";
import { Save, XCircle } from "lucide-react";
import { CustomerUpdate } from "@/types/customer/customerUpdate.ts";
import { NoBorderInput } from "@/components/NoBorderInput.tsx";

interface DetailCustomerModalProps {
  customer?: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const DetailCustomerModal: React.FC<DetailCustomerModalProps> = ({
  customer,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CustomerUpdate>({
    address: customer?.address || "",
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    dateOfBirth: customer?.dateOfBirth || undefined,
    gender: customer?.gender || CustomerGender.Other,
  });

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // customerUpdateSchema.validateSync(formData, { abortEarly: true }); // Stops at the first error
      const newCustomer: CustomerUpdate = {
        ...formData,
      };

      console.log("Update Customer: ", newCustomer);
      await fetchUpdateCustomer(newCustomer);
      onSave();
      handleClose();
    } catch (error: unknown) {
      if (error instanceof Yup.ValidationError) {
        toast.error(error.message);
      } else {
        // Handle other unexpected errors
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      address: "",
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      gender: CustomerGender.Other,
    });
    onClose();
  };

  const fetchUpdateCustomer = async (c: CustomerUpdate) => {
    if (!customer) {
      console.log("Customer is not found!");
      return;
    }
    updateCustomer(customer.id, c)
      .then(() => {
        toast.success("Cập nhập khách hàng thành công!");
      })
      .catch((error) => {
        console.error("Update customer error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi không xác định!";

        // Show error toast
        toast.error(`Cập nhập khách hàng thất bại! ${errorMessage}`);

        throw error; // Re-throw the error for further handling
      });
  };

  useEffect(() => {
    setFormData({
      address: customer?.address || "",
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      dateOfBirth: customer?.dateOfBirth || undefined,
    });
  }, [customer]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết khách hàng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Số điện thoại
            </Label>
            <NoBorderInput
              id="phoneNumber"
              value={customer?.phoneNumber}
              disabled
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
                      : "dd/mm/yyyy"}
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
          <Button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu
          </Button>
          <Button variant="destructive" onClick={handleClose}>
            <XCircle className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
