import axiosInstance from "@/axiosSetup.ts";
import { StockInItemTable } from "@/types/stockIn.ts";

interface ResponseStockInTable {
  data: StockInItemTable[];
  extra?: never;
  paging?: never;
}
/*interface ResponseInventoryReportDetail {
  data: StockInDetails;
  extra?: never;
  paging?: never;
}*/

/*interface ResponseInventoryReportCreate {
  data: number;
  extra?: never;
  paging?: never;
}*/
export interface StockInFilter {
  lk_providerName?: string | null;
  ltUpdatedAt?: Date | null;
  gtUpdatedAt?: Date | null;
  status?: [] | null;
  lk_Id?: string | null;
}
export async function getStockInTableApi(
  filters: StockInFilter,
): Promise<ResponseStockInTable> {
  try {
    const params: StockInFilter = {};
    if (filters.lk_providerName)
      params.lk_providerName = filters.lk_providerName;
    if (filters.ltUpdatedAt) params.ltUpdatedAt = filters.ltUpdatedAt;
    if (filters.gtUpdatedAt) params.gtUpdatedAt = filters.gtUpdatedAt;
    if (filters.status) params.status = filters.status;
    if (filters.lk_Id) params.lk_Id = filters.lk_Id;
    const response = await axiosInstance.get<ResponseStockInTable>(
      "v1/stock-in/list",
      { params: params },
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

/*export async function getInventoryReportDetailById(
  reportId: number,
): Promise<ResponseInventoryReportDetail> {
  try {
    const response = await axiosInstance.get<ResponseInventoryReportDetail>(
      `v1/inventory/${reportId}/details`,
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function createInventoryReport(
  body: InventoryReportCreate,
): Promise<ResponseInventoryReportCreate> {
  try {
    const response = await axiosInstance.post<ResponseInventoryReportCreate>(
      "v1/inventory/create",
      body,
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}*/
