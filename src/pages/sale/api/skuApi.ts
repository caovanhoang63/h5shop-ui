import { SkuGetDetail } from "@/types/sku/skuGetDetail.ts";
import axiosInstance from "@/axiosSetup.ts";
import { SkuSearchFilter } from "@/types/sku/skuSearchFilter.ts";

interface SkuListDetailResponse {
  data: SkuGetDetail[];
  extra: object;
  paging: {
    total: number;
    page: number;
    limit: number;
  };
}

export async function getListSku(
  brandId?: number,
  categoryId?: number,
  page?: number,
  limit?: number,
): Promise<SkuListDetailResponse> {
  try {
    const response = await axiosInstance.get<SkuListDetailResponse>(
      `/v1/sku/list-detail?brandId=${brandId}&categoryId=${categoryId}&page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function searchListSku(
  filter: SkuSearchFilter,
): Promise<SkuListDetailResponse> {
  try {
    const response = await axiosInstance.get<SkuListDetailResponse>(
      `/v1/sku/search-detail?lkName=${filter.lkName}`,
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
