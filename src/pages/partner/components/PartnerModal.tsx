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
import { BanIcon, FileInput, Trash2Icon } from "lucide-react";
import { Provider, ProviderUpdate } from "@/types/provider.ts";
import {
  deleteProvider,
  updateProvider,
} from "@/pages/partner/api/providerApi.ts";
import { useEffect, useState } from "react";
interface IPartnerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  partner?: Provider;
  refreshData: () => void; // Thêm prop refreshData
}

export default function PartnerModal({
  isOpen,
  partner,
  onOpenChange,
  refreshData,
}: IPartnerModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [debt, setDebt] = useState<number>();
  const [status, setStatus] = useState(1);
  useEffect(() => {
    if (partner) {
      setName(partner.name);
      setAddress(partner.address);
      setPhoneNumber(partner.phoneNumber);
      setEmail(partner.email);
      setDebt(partner.debt ?? ""); // Set debt to an empty string if it's null
      setStatus(partner.status);
    }
  }, [partner]);
  async function handleDelete() {
    try {
      if (partner?.id !== undefined) {
        await deleteProvider(partner.id);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Lỗi xóa nhà cung cấp", error);
    }
  }
  async function handleUpdate() {
    try {
      if (partner?.id !== undefined) {
        const body: ProviderUpdate = {
          name: name,
          address: address,
          phone_number: phoneNumber,
          email: email,
          debt: debt,
          status: status,
        };
        console.log("Body cập nhật:", body);
        const response = await updateProvider(partner.id, body);
        if (response) {
          console.log("Cập nhật nhà cung cấp thành công", response);
          refreshData(); // Gọi hàm refreshData sau khi cập nhật thành công
        }
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Lỗi xóa nhà cung cấp", error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl min-h-[calc(100vh-30%)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết nhà cung cấp</DialogTitle>
        </DialogHeader>
        <div className="grow">
          <div className="space-y-2 space-x-12 flex flex-row mt-6">
            <div className={"flex flex-row flex-1 space-x-12"}>
              <div className={"flex flex-col flex-1 space-y-5"}>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-5/12"} htmlFor="barcode">
                    Mã nhà cung cấp
                  </Label>
                  <Input
                    disabled={true}
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
                    value={name}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setName(newValue);
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
                    value={address}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setAddress(newValue);
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
                    value={phoneNumber}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setPhoneNumber(newValue);
                      console.log("Giá trị mới:", newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-6/12"} htmlFor="salePrice">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={email || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setEmail(newValue);
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
                    value={debt}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setDebt(parseInt(newValue));
                      console.log("Giá trị mới:", newValue);
                    }}
                  />
                </div>
                <div className={"flex flex-row items-center"}>
                  <Label className={"w-6/12"} htmlFor="status">
                    Trạng thái
                  </Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => {
                      console.log("Giá trị mới:", Number(e.target.value));
                      setStatus(Number(e.target.value));
                    }}
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value={1}>Đang hoạt động</option>
                    <option value={0}>Đã xóa</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="">
          <div className={"flex flex-row space-x-2 justify-end"}>
            <Button
              className={"bg-green-500 hover:bg-green-600"}
              onClick={handleUpdate}
            >
              <FileInput />
              Sửa
            </Button>
            <Button
              className={"bg-red-500 hover:bg-red-600"}
              onClick={handleDelete}
            >
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
