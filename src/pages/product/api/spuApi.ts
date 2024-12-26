import { SpuUpsert } from "@/types/spu/spuUpsert.ts";
import axiosInstance from "@/axiosSetup.ts";
import { SpuListTable } from "@/types/spu/spuListTable.ts";
import { SpuDetail } from "@/types/spu/spuGetDetail.ts";

export interface ResponseSpu {
  data: SpuListTable[];
  extra?: never;
  paging?: never;
}

export interface ResponseSpuDetail {
  data: {
    spuDetail: SpuDetail;
  };
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

export async function getSpuDetail(id: number): Promise<ResponseSpuDetail> {
  try {
    const response = await axiosInstance.get<ResponseSpuDetail>(
      `/v1/spu/detail/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
