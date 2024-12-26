import axiosInstance from "@/axiosSetup.ts";

export async function deleteSkuAttr(id: number, index: number): Promise<void> {
  try {
    console.log("deleteSkuAttr", id, index);
    await axiosInstance.post(`/v1/sku-attr/${id}`, { index: index });
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
