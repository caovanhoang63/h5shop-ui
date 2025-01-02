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
import { BanIcon, FileInput, Trash2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteEmployee,
  updateEmployee,
} from "@/pages/employee/api/employeeApi.ts";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Employee } from "@/types/employee/employee.ts";

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

interface IEmployeeEditModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  employee?: Employee;
}

export default function EmployeeEditModal({
  isOpen,
  onOpenChange,
  employee,
}: IEmployeeEditModalProps) {
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
    if (isOpen && employee) {
      setValue("firstName", employee.firstName);
      setValue("lastName", employee.lastName);
      setValue("phoneNumber", employee.phoneNumber);
      setValue("email", employee.email);
      setValue("gender", employee.gender);
      setValue("address", employee.address);
      setValue(
        "dateOfBirth",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        employee.dateOfBirth,
      );
    } else {
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
  }, [isOpen, employee, reset, setValue]);
  const onDeleteSubmit = async () => {
    try {
      if (employee?.id !== undefined) {
        await deleteEmployee(employee.id);
        toast.success("Xóa nhân viên thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onOpenChange(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Xóa nhân viên thất bại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await updateEmployee(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        employee?.id,
        data,
      );
      console.log(response.data);
      toast.success("Sửa nhân viên thành công!", {
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
      toast.error("Sửa nhân viên thất bại!", {
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
          <DialogTitle>Chi tiết nhân viên</DialogTitle>
        </DialogHeader>
        <div className="grow">
          <form onSubmit={onSubmit}>
            <div className="space-y-2 space-x-12 flex flex-row mt-6">
              <div className={"flex flex-row flex-1 space-x-12"}>
                <div className={"flex flex-col flex-1 space-y-5"}>
                  <div className={"flex flex-col"}>
                    <Label className={"w-full mb-2"} htmlFor="id">
                      Mã nhân viên
                    </Label>
                    <Input
                      disabled={true}
                      id="id"
                      defaultValue={employee?.id}
                    />
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
                  onClick={() => {}}
                >
                  <FileInput />
                  Sửa
                </Button>
                <Button
                  className={"bg-red-500 hover:bg-red-600"}
                  onClick={(event) => {
                    event.preventDefault();
                    onDeleteSubmit();
                  }}
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
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
