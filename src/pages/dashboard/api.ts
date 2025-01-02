import { Paging } from "@/types/paging.ts";
import axiosInstance from "@/axiosSetup.ts";
import { Audit } from "@/types/auditLog.ts";

export interface IAuditFilter {
  objectType?: string[];
  action?: string[];
  gtCreatedAt?: Date;
}
export interface Response {
  data: Audit[];
  paging: Paging;
  filters: IAuditFilter;
}

export const getAudit = (filter: IAuditFilter, paging: Paging) =>
  axiosInstance.get<Response>("v1/audit", {
    params: {
      ...filter,
      ...paging,
    },
  });
