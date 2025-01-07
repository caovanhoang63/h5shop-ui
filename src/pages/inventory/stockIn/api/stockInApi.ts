import axiosInstance from "@/axiosSetup.ts";
import {
  StockInCreate,
  StockInDetails,
  StockInItemTable,
} from "@/types/stockIn/stockIn.ts";
import { Paging } from "@/types/paging.ts";

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

interface Response {
  data?: never;
  extra?: never;
  paging?: never;
}
const token = localStorage.getItem("token");

export async function getStockInTableApi(
  filters: StockInFilter,
  paging: Paging,
): Promise<ResponseStockInTable> {
  try {
    const response = await axiosInstance.get<ResponseStockInTable>(
      "v1/stock-in",
      {
        params: {
          ...filters,
          ...paging,
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

export async function getStockInDetailById(
  reportId: number,
): Promise<ResponseStockInDetail> {
  try {
    const response = await axiosInstance.get<ResponseStockInDetail>(
      `v1/stock-in/${reportId}`,
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
export async function createStockInReport(
  body: StockInCreate,
): Promise<ResponseStockInReportCreate> {
  try {
    const response = await axiosInstance.post<ResponseStockInReportCreate>(
      "v1/stock-in",
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

export async function searchSku(query: string): Promise<Response> {
  try {
    const response = await axiosInstance.get<Response>("v1/sku/search-detail", {
      params: {
        lkName: query,
      },
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
