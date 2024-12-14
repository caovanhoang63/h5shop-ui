import {
  InventoryReport,
  InventoryReportDetails,
} from "@/types/inventoryReport.ts";
import axiosInstance from "@/axiosSetup.ts";

export interface ResponseInventoryReport {
  data: InventoryReport[];
  extra?: never;
  paging?: never;
}
export interface ResponseInventoryReportDetail {
  data: InventoryReportDetails;
  extra?: never;
  paging?: never;
}

export async function getInventoryReports(): Promise<ResponseInventoryReport> {
  try {
    const response =
      await axiosInstance.get<ResponseInventoryReport>("/inventory/table");
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
      `/inventory/${reportId}/details`,
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
