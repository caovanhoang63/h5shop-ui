import { SpuUpsert } from "@/types/spu/spuUpsert.ts";
import axiosInstance from "@/axiosSetup.ts";
import { SpuListTable } from "@/types/spu/spuListTable.ts";
import { SpuDetail } from "@/types/spu/spuGetDetail.ts";
import { SpuFilter } from "@/types/spu/spuFilter.ts";

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

export interface ResponseSpuListTable {
  data: SpuListTable[];
  extra: object;
  paging: {
    total: number;
    page: number;
    limit: number;
  };
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

export async function getSpuListTable(
  filter: SpuFilter,
): Promise<ResponseSpuListTable> {
  try {
    const params = {
      name: filter.name ? filter.name : undefined,
      categoryId:
        filter?.categoryId && filter.categoryId > 0
          ? filter.categoryId
          : undefined,
      brandId:
        filter?.brandId && filter.brandId > 0 ? filter.brandId : undefined,
      page: filter.page ? filter.page : 1,
      limit: filter.limit ? filter.limit : 10,
    };

    const response = await axiosInstance.get<ResponseSpuListTable>("/v1/spu", {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function deleteSpu(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`/v1/spu/${id}`);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
