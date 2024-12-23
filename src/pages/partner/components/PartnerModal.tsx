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
import { BanIcon, FileInput, Plus, Trash2Icon } from "lucide-react";
import { InputUploadImage } from "@/components/InputUploadImage.tsx";
import { Partner } from "@/types/partner.ts";

interface IPartnerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  partner?: Partner;
}

export default function PartnerModal({
  isOpen,
  partner,
  onOpenChange,
}: IPartnerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl min-h-[calc(100vh-30%)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết nhà cung cấp</DialogTitle>
        </DialogHeader>
        <div className="grow">
          <div className="space-y-2 space-x-12 flex flex-row mt-6">
            <div>
              <InputUploadImage height={"320px"} width={"320px"} />
            </div>
            <div className={"flex flex-row flex-1 space-x-12"}>
              <div className={"flex flex-col flex-1 space-y-5"}>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="barcode">
                    Mã nhà cung cấp
                  </Label>
                  <Input
                    id="id"
                    value={partner?.id || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log("Giá trị mới:", newValue);
                    }}
                  ></Input>
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="name">
                    Tên nhà cung cấp
                  </Label>
                  <Input
                    id="name"
                    value={partner?.name || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log("Giá trị mới:", newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="brand">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    value={partner?.address || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log("Giá trị mới:", newValue);
                    }}
                  />
                </div>
              </div>
              <div className={"flex flex-col flex-1 space-y-5"}>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-6/12"} htmlFor="costPrice">
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone_number"
                    value={partner?.phoneNumber || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log("Giá trị mới:", newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-6/12"} htmlFor="salePrice">
                    Số nợ
                  </Label>
                  <Input
                    id="debt"
                    value={partner?.debt || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      console.log("Giá trị mới:", newValue);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="">
          <div className={"flex flex-row space-x-2 justify-end"}>
            <Button className={"bg-green-500 hover:bg-green-600"}>
              <Plus />
              Thêm mới
            </Button>
            <Button className={"bg-green-500 hover:bg-green-600"}>
              <FileInput />
              Lưu
            </Button>
            <Button className={"bg-red-500 hover:bg-red-600"}>
              <Trash2Icon />
              Xóa
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
