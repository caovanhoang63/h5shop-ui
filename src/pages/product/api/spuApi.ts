import { SpuUpsert } from "@/types/spu/spuUpsert.ts";
import axiosInstance, { axiosInstanceUpload } from "@/axiosSetup.ts";
import { SpuListTable } from "@/types/spu/spuListTable.ts";
import { Image } from "@/types/image.ts";

export interface ResponseSpu {
  data: SpuListTable[];
  extra?: never;
  paging?: never;
}

export async function upsertSpuDetail(spu: SpuUpsert): Promise<void> {
  try {
    await axiosInstance.post("/v1/spu/upsert-detail", spu);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function uploadImage(file: File): Promise<Image> {
  if (!file) {
    throw new Error("File is required");
  }
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstanceUpload.post<Image>(
      "/v1/upload/image",
      formData,
    );

    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
