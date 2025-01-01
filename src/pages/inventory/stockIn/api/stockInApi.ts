import axiosInstance from "@/axiosSetup.ts";
import {
  StockInCreate,
  StockInDetails,
  StockInItemTable,
} from "@/types/stockIn/stockIn.ts";

interface ResponseStockInTable {
  data: StockInItemTable[];
  extra?: never;
  paging?: never;
}
interface ResponseStockInDetail {
  data: StockInDetails;
  extra?: never;
  paging?: never;
}

interface ResponseStockInReportCreate {
  data: number;
  extra?: never;
  paging?: never;
}
export interface StockInFilter {
  lk_providerName?: string | null;
  ltUpdatedAt?: Date | null;
  gtUpdatedAt?: Date | null;
  status?: [] | null;
  lk_Id?: string | null;
}

interface ResponseSearchSku {
  data?: never;
  extra?: never;
  paging?: never;
}
export async function getStockInTableApi(
  filters: StockInFilter,
): Promise<ResponseStockInTable> {
  try {
    const response = await axiosInstance.get<ResponseStockInTable>(
      "v1/stock-in/list",
      {
        params: {
          ...filters,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function getStockInDetailById(
  reportId: number,
): Promise<ResponseStockInDetail> {
  try {
    const response = await axiosInstance.get<ResponseStockInDetail>(
      `v1/stock-in/details/${reportId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function createStockInReport(
  body: StockInCreate,
): Promise<ResponseStockInReportCreate> {
  try {
    const response = await axiosInstance.post<ResponseStockInReportCreate>(
      "v1/stock-in/create",
      body,
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function searchSku(query: string): Promise<ResponseSearchSku> {
  try {
    const response = await axiosInstance.get<ResponseSearchSku>(
      "v1/sku/search-detail",
      {
        params: {
          lkName: query,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
