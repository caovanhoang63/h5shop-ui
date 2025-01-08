import { Customer } from "@/types/customer/customer.ts";
import axiosInstance from "@/axiosSetup.ts";
import { CustomerItemTable } from "@/types/customer/customerItemTable.ts";
import { CustomerListFilter } from "@/types/customer/customerListFilter.ts";
import { Paging } from "@/types/paging";

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

interface CustomerTableResponse {
  data: CustomerItemTable[];
  extra?: never;
  paging?: never;
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
