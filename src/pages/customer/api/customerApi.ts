import { Customer } from "@/types/customer/customer.ts";
import axiosInstance from "@/axiosSetup.ts";
import { CustomerItemTable } from "@/types/customer/customerItemTable.ts";
import { CustomerListFilter } from "@/types/customer/customerListFilter.ts";
import { Paging } from "@/types/paging";
import { CustomerUpdate } from "@/types/customer/customerUpdate.ts";

interface CustomerResponse {
  data: Customer;
  extra?: never;
  paging?: never;
}
export async function getCustomerById(id: number) {
  try {
    const response = await axiosInstance.get<CustomerResponse>(
      `/v1/customer/${id}`,
    );
    console.log("get by id response", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function updateCustomer(id: number, c: CustomerUpdate) {
  try {
    const res = await axiosInstance.patch<CustomerUpdate>(
      `/v1/customer/${id}`,
      c,
    );
    return res.data;
  } catch (e) {
    console.error("Update customer error:", e);
    throw e;
  }
}

interface CustomerTableResponse {
  data: CustomerItemTable[];
  extra?: never;
  paging?: Paging;
}
export async function getCustomerTableApi(
  filters: CustomerListFilter,
  paging: Paging,
): Promise<CustomerTableResponse> {
  try {
    const response = await axiosInstance.get<CustomerTableResponse>(
      "/v1/customer",
      {
        params: {
          ...filters,
          ...paging,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
