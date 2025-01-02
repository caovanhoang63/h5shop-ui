import * as Yup from "yup";
import { CustomerGender } from "@/types/customer/customer.ts";

export interface CustomerCreate {
  phoneNumber: string;
  address?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender: CustomerGender;
}

export const customerCreateSchema = Yup.object().shape({
  lastName: Yup.string().required("Họ không được để trống!"),
  firstName: Yup.string().required("Tên không được để trống!"),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, "Số điện thoại phải là số hợp lệ!")
    .required("Số điện thoại không được để trống!"),
});
