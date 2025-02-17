import {
  InventoryReport,
  InventoryReportDetails,
  InventoryReportCreate,
} from "@/types/inventory/inventoryReport.ts";
import axiosInstance from "@/axiosSetup.ts";
import { Paging } from "@/types/paging.ts";

interface ResponseInventoryReport {
  data: InventoryReport[];
  extra?: never;
  paging?: Paging;
}
interface ResponseInventoryReportDetail {
  data: InventoryReportDetails;
  extra?: never;
  paging?: never;
}

interface ResponseInventoryReportCreate {
  data: number;
  extra?: never;
  paging?: never;
}
export interface InventoryReportFilter {
  lk_warehouseMan1?: string | null;
  ltUpdatedAt?: Date | null;
  gtUpdatedAt?: Date | null;
  status?: [] | null;
  lk_Id?: string | null;
  page?: number | null;
}
const token = localStorage.getItem("token");
export async function getInventoryReports(
  filters: InventoryReportFilter,
): Promise<ResponseInventoryReport> {
  try {
    const response = await axiosInstance.get<ResponseInventoryReport>(
      "v1/inventory",
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

export async function getInventoryReportDetailById(
  reportId: number,
): Promise<ResponseInventoryReportDetail> {
  try {
    const response = await axiosInstance.get<ResponseInventoryReportDetail>(
      `v1/inventory/${reportId}`,
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
export async function createInventoryReport(
  body: InventoryReportCreate,
): Promise<ResponseInventoryReportCreate> {
  try {
    const response = await axiosInstance.post<ResponseInventoryReportCreate>(
      "v1/inventory/create",
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
