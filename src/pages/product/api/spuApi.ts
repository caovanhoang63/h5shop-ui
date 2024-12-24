import { SpuUpsert } from "@/types/spu/spuUpsert.ts";
import axiosInstance from "@/axiosSetup.ts";

export async function upsertSpuDetail(spu: SpuUpsert): Promise<void> {
  try {
    await axiosInstance.post("/v1/spu/upsert-detail", spu);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
