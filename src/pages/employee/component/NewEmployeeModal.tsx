import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEmployee } from "@/pages/employee/api/employeeApi.ts";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = yup
  .object({
    firstName: yup.string().required("Tên nhân viên không được để trống"),
    lastName: yup.string().required("Họ nhân viên không được để trống"),
    phoneNumber: yup.string().required("Số điện thoại không được để trống"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    gender: yup.string().required("Giới tính không được để trống"),
    address: yup.string().required("Địa chỉ không được để trống"),
    dateOfBirth: yup.string().required("Ngày sinh không được để trống"),
  })
  .required();

interface INewEmployeeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function NewEmployeeModal({
  isOpen,
  onOpenChange,
}: INewEmployeeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (!isOpen) {
      reset({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        gender: "",
        address: "",
        dateOfBirth: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const response = await createEmployee(data);
      console.log(response.data);
      toast.success("Tạo nhân viên thành công!", {
        position: "top-right",
        autoClose: 3000,
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
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl min-h-[calc(100vh-50%)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Thêm nhân viên mới</DialogTitle>
        </DialogHeader>
        <div className="grow">
          <form onSubmit={onSubmit}>
            <div className="space-y-2 space-x-12 flex flex-row mt-6">
              <div className={"flex flex-row flex-1 space-x-12"}>
                <div className={"flex flex-col flex-1 space-y-5"}>
                  <div className={"flex flex-col"}>
                    <Label className={"w-full mb-2"} htmlFor="firstName">
                      Tên nhân viên
                    </Label>
                    <Input id="firstName" {...register("firstName")} />
                    {errors.firstName && (
                      <p className="text-red-500 mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className={"flex flex-col"}>
                    <Label className={"w-full mb-2"} htmlFor="phoneNumber">
                      Số điện thoại
                    </Label>
                    <Input id="phoneNumber" {...register("phoneNumber")} />
                    {errors.phoneNumber && (
                      <p className="text-red-500 mt-1">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <div className={"flex flex-col"}>
                    <Label className={"w-full mb-2"} htmlFor="email">
                      Email
                    </Label>
                    <Input id="email" {...register("email")} />
                    {errors.email && (
                      <p className="text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Label className="w-full mb-2" htmlFor="gender">
                      Giới tính
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("gender", value)}
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
                    {errors.gender && (
                      <p className="text-red-500 mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className={"flex flex-col flex-1 space-y-5"}>
                  <div className={"flex flex-col"}>
                    <Label className={"w-full mb-2"} htmlFor="lastName">
                      Họ nhân viên
                    </Label>
                    <Input id="lastName" {...register("lastName")} />
                    {errors.lastName && (
                      <p className="text-red-500 mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div className={"flex flex-col"}>
                    <Label className={"w-full mb-2"} htmlFor="address">
                      Địa chỉ
                    </Label>
                    <Input id="address" {...register("address")} />
                    {errors.address && (
                      <p className="text-red-500 mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className={"flex flex-col"}>
                    <Label className={"w-full mb-2"} htmlFor="dateOfBirth">
                      Ngày sinh
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 mt-1">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <div className={"flex flex-row space-x-2 justify-end"}>
                <Button
                  className={"bg-green-500 hover:bg-green-600"}
                  type="submit"
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
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
