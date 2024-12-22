import {
  InventoryReport,
  InventoryReportDetails,
  InventoryReportCreate,
} from "@/types/inventoryReport.ts";
import axiosInstance from "@/axiosSetup.ts";

interface ResponseInventoryReport {
  data: InventoryReport[];
  extra?: never;
  paging?: never;
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
export async function getInventoryReports(): Promise<ResponseInventoryReport> {
  try {
    const response =
      await axiosInstance.get<ResponseInventoryReport>("v1/inventory/table");
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
}
