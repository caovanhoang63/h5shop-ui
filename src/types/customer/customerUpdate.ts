import { CustomerGender } from "@/types/customer/customer.ts";

export interface CustomerUpdate {
  address?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: CustomerGender;
}
