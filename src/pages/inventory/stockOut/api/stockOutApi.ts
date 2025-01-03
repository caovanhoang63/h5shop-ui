import axiosInstance from "@/axiosSetup.ts";
import { StockInCreate } from "@/types/stockIn/stockIn.ts";
import {
  StockOutDetail,
  StockOutItemTable,
} from "@/types/stockOut/stockOut.ts";

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
      `v1/stock-out/${reportId}`,
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
