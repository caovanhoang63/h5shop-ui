import axiosInstance from "@/axiosSetup.ts";

export const listOrderByDate = (startDate: Date, endDate: Date) =>
  axiosInstance.get<{ data: Sale[] }>("v1/report/sale", {
    params: {
      startDate: startDate,
      endDate: endDate,
    },
  });

export interface Sale {
  id: number;
  sellerName: string;
  customerPhoneNumber: string;
  saleType: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  createdAt: Date;
}
