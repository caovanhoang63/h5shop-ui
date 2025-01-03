import axiosInstance from "@/axiosSetup.ts";
import { Warranty, WarrantyFilter } from "@/types/warranty/warranty.ts";
import { PagingSpu } from "@/types/spu/PagingSpu.ts";

export interface ResponseWarranty {
  data: Warranty[];
  extra: object;
  paging: PagingSpu;
}

export async function createWarrantyForm(warranty: Warranty): Promise<void> {
  try {
    const body = {
      warrantyType: warranty.warrantyType,
      customerId: warranty.customerId,
      customerPhoneNumber: warranty.customerPhoneNumber,
      stockInId: warranty.stockInId,
      skuId: warranty.skuId,
      orderId: warranty.orderId,
      amount: warranty.amount,
      returnDate: warranty.returnDate,
      note: warranty.note,
    };
    await axiosInstance.post("/v1/warranty", body);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function getListWarrantyForm(
  warrantyFilter: WarrantyFilter,
): Promise<ResponseWarranty> {
  try {
    const newFilter = {
      ...warrantyFilter,
      page: warrantyFilter.page ?? 1,
      limit: warrantyFilter.limit ?? 10,
    };

    const response = await axiosInstance.get<ResponseWarranty>("/v1/warranty", {
      params: newFilter,
    });
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
