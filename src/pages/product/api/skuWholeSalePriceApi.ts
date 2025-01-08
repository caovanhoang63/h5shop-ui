import axiosInstance from "@/axiosSetup.ts";

export async function deleteSkuWholeSalePrice(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`/v1/sku-wholesale-price/${id}`);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
