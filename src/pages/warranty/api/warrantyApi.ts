import axiosInstance from "@/axiosSetup.ts";
import { Warranty } from "@/types/warranty/warranty.ts";

export interface ResponseWarranty {
  data: Warranty[];
  extra: object;
  paging: object;
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

export async function getListWarrantyForm(): Promise<ResponseWarranty> {
  try {
    const response = await axiosInstance.get<ResponseWarranty>("/v1/warranty");
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
