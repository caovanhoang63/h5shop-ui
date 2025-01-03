import { Fragment, useEffect, useState } from "react";

import { LoadingAnimation } from "@/components/ui/LoadingAnimation.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { BanIcon, FileInput, Plus, Trash2Icon } from "lucide-react";
import { Warranty } from "@/types/warranty/warranty.ts";
import { WarrantyType } from "@/types/enumTime.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import { createWarrantyForm } from "@/pages/warranty/api/warrantyApi.ts";

interface IWarrantyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isAdd: boolean;
  warrantyUpdate?: Warranty;
  actionSuccess?: () => void;
}

export default function WarrantyModal({
  isOpen,
  onOpenChange,
  isAdd,
  warrantyUpdate,
  actionSuccess,
}: IWarrantyModalProps) {
  const [warranty, setWarranty] = useState<Warranty>({
    id: 0,
    warrantyType: "",
    customerId: 0,
    customerPhoneNumber: "",
    stockInId: 0,
    skuId: 0,
    orderId: 0,
    amount: 0,
    returnDate: new Date(),
    note: "",
    status: 0,
    createdAt: "",
    updatedAt: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (warrantyUpdate) {
      setWarranty(warrantyUpdate);
    } else {
      setDefaultWarranty();
    }
  }, [warrantyUpdate]);

  const setDefaultWarranty = () => {
    setWarranty({
      id: 0,
      warrantyType: "",
      customerId: 0,
      customerPhoneNumber: "",
      stockInId: 0,
      skuId: 0,
      orderId: 0,
      amount: 0,
      returnDate: new Date(),
      note: "",
      status: 0,
      createdAt: "",
      updatedAt: "",
    });
  };

  const setWarrantyByField = (
    nameField: string,
    value: number | string | Date,
  ) => {
    console.log(nameField, value);
    setWarranty({ ...warranty, [nameField]: value });
  };

  const handleClickBtnAdd = async () => {
    try {
      setIsLoading(true);
      await createWarrantyForm(warranty);
      if (actionSuccess) actionSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickBtnUpdate = () => {};

  const handleClickBtnDelete = () => {};

  return (
    <Fragment>
      {isLoading && <LoadingAnimation />}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col" style={{ minWidth: "1000px" }}>
          <DialogHeader>
            {isAdd ? (
              <DialogTitle style={{ fontSize: "20px", fontWeight: "bold" }}>
                Thêm phiếu tiếp nhận bảo hành
              </DialogTitle>
            ) : (
              <DialogTitle style={{ fontSize: "20px", fontWeight: "bold" }}>
                Chỉnh sủa phiếu tiếp nhận bảo hành
              </DialogTitle>
            )}
          </DialogHeader>
          <div
            className={"flex flex-row justify-between h-100 space-x-12 mt-3"}
          >
            <div className={"flex flex-col flex-1 space-y-6"}>
              <div className={"flex flex-row space-x-4"}>
                <label className={"w-6/12 font-semibold"}>Loại bảo hành</label>
                <Select
                  defaultValue={WarrantyType.FIX}
                  value={warranty.warrantyType}
                  onValueChange={(value) =>
                    setWarrantyByField("warrantyType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={"Chọn loại bảo hành"}
                    ></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={WarrantyType.FIX}>Sửa chữa</SelectItem>
                    <SelectItem value={WarrantyType.NEW}>Đổi mới</SelectItem>
                    <SelectItem value={WarrantyType.PART}>Thay thế</SelectItem>
                    <SelectItem value={WarrantyType.MF_FIX}>
                      Gửi nhà sản xuất
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={"flex flex-row space-x-4"}>
                <label className={"w-6/12 font-semibold"}>Sdt khách hàng</label>
                <Input
                  className={""}
                  placeholder={""}
                  value={warranty.customerPhoneNumber}
                  onChange={(e) =>
                    setWarrantyByField("customerPhoneNumber", e.target.value)
                  }
                />
              </div>
              <div className={"flex flex-row space-x-4"}>
                <label className={"w-6/12 font-semibold"}>Mã khách hàng</label>
                <Input
                  className={""}
                  placeholder={""}
                  type={"number"}
                  value={warranty.customerId}
                  onChange={(e) =>
                    setWarrantyByField("customerId", e.target.value)
                  }
                />
              </div>
              <div className={"flex flex-row space-x-4"}>
                <label className={"w-6/12 font-semibold"}>Mã Sku</label>
                <Input
                  className={""}
                  type={"number"}
                  placeholder={""}
                  value={warranty.skuId}
                  onChange={(e) => setWarrantyByField("skuId", e.target.value)}
                />
              </div>
              <div className={"flex flex-row space-x-4"}>
                <label className={"w-6/12 font-semibold"}>Số lượng</label>
                <Input
                  className={""}
                  placeholder={""}
                  value={warranty.amount}
                  onChange={(e) => setWarrantyByField("amount", e.target.value)}
                />
              </div>
            </div>
            {/*Right*/}
            <div className={"flex flex-col flex-1 space-y-6"}>
              <div className={"flex flex-row space-x-4"}>
                <label className={"w-6/12 font-semibold"}>Mã đơn hàng</label>
                <Input
                  className={""}
                  placeholder={""}
                  value={warranty.orderId}
                  onChange={(e) =>
                    setWarrantyByField("orderId", e.target.value)
                  }
                />
              </div>
              <div className={"flex flex-row space-x-4"}>
                <label className={"w-6/12 font-semibold"}>Mã nhập hàng</label>
                <Input
                  className={""}
                  placeholder={""}
                  value={warranty.stockInId}
                  onChange={(e) =>
                    setWarrantyByField("stockInId", e.target.value)
                  }
                />
              </div>
              <div className={"flex flex-row space-x-4"}>
                <label className={"w-6/12 font-semibold"}>Ghi chú</label>
                <Input
                  className={""}
                  placeholder={""}
                  value={warranty.note}
                  onChange={(e) => setWarrantyByField("note", e.target.value)}
                />
              </div>
              <div className={"flex flex-row space-x-4"}>
                <label className={"w-6/12 font-semibold"}>Ngày trả hàng</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {warranty.returnDate
                        ? format(new Date(warranty.returnDate), "dd/MM/yyyy")
                        : "dd/mm/yyyy"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="">
                    <Calendar
                      mode="single"
                      selected={warranty.returnDate}
                      onSelect={(date) =>
                        setWarrantyByField("returnDate", date ?? new Date())
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter className="">
            {isAdd && (
              <Button
                className={"bg-green-500 hover:bg-green-600"}
                onClick={() => handleClickBtnAdd()}
              >
                <Plus />
                Thêm mới
              </Button>
            )}
            {!isAdd && (
              <Button
                className={"bg-green-500 hover:bg-green-600"}
                onClick={() => handleClickBtnUpdate()}
              >
                <FileInput />
                Lưu
              </Button>
            )}
            {!isAdd && (
              <Button
                className={"bg-red-500 hover:bg-red-600"}
                onClick={() => handleClickBtnDelete()}
              >
                <Trash2Icon />
                Xóa
              </Button>
            )}
            <Button
              className={"bg-gray-500 hover:bg-gray-600"}
              onClick={() => onOpenChange(false)}
            >
              <BanIcon />
              Bỏ qua
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
