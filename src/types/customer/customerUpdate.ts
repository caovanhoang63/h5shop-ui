import { CustomerGender } from "@/types/customer/customer.ts";
import * as Yup from "yup";

export interface CustomerUpdate {
  address?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: CustomerGender;
  discountPoint?: number;
}

export const customerUpdateSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .max(50, "Tên không được vượt quá 50 ký tự!")
    .optional(),
  lastName: Yup.string()
    .trim()
    .max(50, "Họ không được vượt quá 50 ký tự!")
    .optional(),
  address: Yup.string()
    .trim()
    .max(100, "Địa chỉ không được vượt quá 100 ký tự!")
    .optional(),
  dateOfBirth: Yup.date()
    .nullable()
    .max(new Date(), "Ngày sinh không hợp lệ!")
    .optional(),
  gender: Yup.mixed()
    .oneOf(["male", "female", "other"] as const, "Giới tính không hợp lệ!")
    .optional(),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, "Số điện thoại phải là số hợp lệ!")
    .max(15, "Số điện thoại không được vượt quá 15 ký tự!")
    .optional(),
});
