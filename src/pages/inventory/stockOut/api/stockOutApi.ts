import axiosInstance from "@/axiosSetup.ts";
import {
  StockOutCreate,
  StockOutDetail,
  StockOutItemTable,
} from "@/types/stockOut/stockOut.ts";
import { SkuGetDetail } from "@/types/sku/skuGetDetail.ts";

interface ResponseStockOutTable {
  data: StockOutItemTable[];
  extra?: never;
  paging?: never;
}
interface ResponseStockOutDetail {
  data: StockOutDetail;
  extra?: never;
  paging?: never;
}

interface ResponseStockInReportCreate {
  data: number;
  extra?: never;
  paging?: never;
}
export interface StockOutFitler {
  lk_providerName?: string | null;
  ltUpdatedAt?: Date | null;
  gtUpdatedAt?: Date | null;
  status?: [] | null;
  lk_Id?: string | null;
}

interface Response {
  data?: never;
  extra?: never;
  paging?: never;
}

interface SearchDetailResponse {
  data: SkuGetDetail[];
  extra: object;
  paging: {
    total: number;
    page: number;
    limit: number;
  };
}
const token = localStorage.getItem("token");

export async function listStockOutApi(
  filters: StockOutFitler,
): Promise<ResponseStockOutTable> {
  try {
    const response = await axiosInstance.get<ResponseStockOutTable>(
      "v1/stock-out",
      {
        params: {
          ...filters,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function getStockOutDetailById(
  reportId: number,
): Promise<ResponseStockOutDetail> {
  try {
    const response = await axiosInstance.get<ResponseStockOutDetail>(
      `v1/stock-out/detail/${reportId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function createStockOutReport(
  body: StockOutCreate,
): Promise<ResponseStockInReportCreate> {
  try {
    const response = await axiosInstance.post<ResponseStockInReportCreate>(
      "v1/stock-out",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function searchSku(query: string): Promise<SearchDetailResponse> {
  try {
    const response = await axiosInstance.get<SearchDetailResponse>(
      "v1/sku/search-detail",
      {
        params: {
          lkName: query,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function searchProvider(query: string): Promise<Response> {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosInstance.get<Response>("v1/provider/", {
      params: {
        lkName: query,
      },
      headers: config.headers,
    });
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function listReason(): Promise<Response> {
  try {
    const response = await axiosInstance.get<Response>("v1/stock-out/reasons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
