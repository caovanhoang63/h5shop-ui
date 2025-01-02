import { Customer } from "@/types/customer/customer.ts";
import axiosInstance from "@/axiosSetup.ts";
import { CustomerCreate } from "@/types/customer/customerCreate.ts";
import { CustomerUpdate } from "@/types/customer/customerUpdate.ts";
import { CustomerListFilter } from "@/types/customer/customerListFilter.ts";
import { formatISO } from "date-fns";

interface CustomerResponse {
  data: Customer;
}
export async function createCustomer(c: CustomerCreate) {
  try {
    const res = await axiosInstance.post<CustomerResponse>("/v1/customer", c);
    return res.data;
  } catch (e) {
    console.error("Create customer error:", e);
    throw e;
  }
}

export async function updateCustomer(c: CustomerUpdate) {
  try {
    const res = await axiosInstance.patch<CustomerUpdate>("/v1/customer", c);
    return res.data;
  } catch (e) {
    console.error("Update customer error:", e);
    throw e;
  }
}

interface CustomerListResponse {
  data: Customer[];
}
export async function listCustomer(filter: CustomerListFilter) {
  try {
    const processedFilter: Record<string, string | number | number[]> = {};

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined) {
        // Format Date fields to ISO strings
        if (value instanceof Date) {
          processedFilter[key as keyof CustomerListFilter] = formatISO(value);
        } else {
          processedFilter[key as keyof CustomerListFilter] = value;
        }
      }
    });

    const res = await axiosInstance.get<CustomerListResponse>("/v1/customer", {
      params: processedFilter,
    });
    return res.data;
  } catch (e) {
    console.error("List customer error:", e);
    throw e;
  }
}
