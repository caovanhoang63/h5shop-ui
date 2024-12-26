import axiosInstance from "@/axiosSetup.ts";

export async function deleteSku(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`/v1/sku/${id}`);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
