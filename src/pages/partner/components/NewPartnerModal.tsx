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
import { ProviderCreate } from "@/types/provider.ts";
import { createProvider } from "@/pages/partner/api/providerApi.ts";
import { toast } from "sonner";

interface INewPartnerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function NewPartnerModal({
  isOpen,
  onOpenChange,
}: INewPartnerModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [debt, setDebt] = useState("");
  async function onSubmit() {
    const data: ProviderCreate = {
      name: name,
      email: email,
      address: address,
      phone_number: phoneNumber,
      debt: parseInt(debt),
    };
    try {
      const response = await createProvider(data);
      if (response) {
        toast("Tạo thành công", {});
        onOpenChange(false);
      }
    } catch (e) {
      toast("Tạo thất bại", {});
      console.log(e);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl min-h-[calc(100vh-30%)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Thêm nhà cung cấp</DialogTitle>
        </DialogHeader>
        <div className="grow">
          <div className="space-y-2 space-x-12 flex flex-row mt-6">
            <div className={"flex flex-row flex-1 space-x-12"}>
              <div className={"flex flex-col flex-1 space-y-5"}>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="name">
                    Tên nhà cung cấp
                  </Label>
                  <Input
                    id="name"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setName(newValue);
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
                      setEmail(newValue);
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
                      setAddress(newValue);
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
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setPhoneNumber(newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-6/12"} htmlFor="salePrice">
                    Số nợ
                  </Label>
                  <Input
                    id="debt"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setDebt(newValue);
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
