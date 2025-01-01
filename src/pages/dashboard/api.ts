import { Paging } from "@/types/paging.ts";
import axiosInstance from "@/axiosSetup.ts";

export interface IAuditFilter {
  objectType?: string[];
  action?: string[];
}

export const getAudit = (filter: IAuditFilter, paging: Paging) =>
  axiosInstance.get("v1/audit", {
    params: {
      ...filter,
      ...paging,
    },
  });
