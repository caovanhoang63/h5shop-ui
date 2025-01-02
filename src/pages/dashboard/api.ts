import { Paging } from "@/types/paging.ts";
import axiosInstance from "@/axiosSetup.ts";
import { Audit } from "@/types/auditLog.ts";

export interface IAuditFilter {
  objectType?: string[];
  action?: string[];
  gtCreatedAt?: Date;
}
export interface AuditResponse {
  data: Audit[];
  paging: Paging;
  filters: IAuditFilter;
}

export const getAudit = (filter: IAuditFilter, paging: Paging) =>
  axiosInstance.get<AuditResponse>("v1/audit", {
    params: {
      ...filter,
      ...paging,
    },
  });

export interface Revenue {
  date: Date;
  revenue: number;
  totalOrder: number;
}
export interface RevenueResponse {
  data: Revenue[];
}

export interface GetTotalOrderResponse {
  data: number;
}

export const getTotalOrder = (startDate: Date, endDate: Date) =>
  axiosInstance.get<GetTotalOrderResponse>("v1/report/total-order", {
    params: {
      startDate: startDate,
      endDate: endDate,
    },
  });

export const getRevenue = (startDate: Date, endDate: Date) =>
  axiosInstance.get<RevenueResponse>("v1/report/revenue", {
    params: {
      startDate: startDate,
      endDate: endDate,
    },
  });
