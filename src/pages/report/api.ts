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

export interface SkuStock {
  id: number;
  name: string;
  stock: number;
  status: number;
}

export const inventoryReport = () =>
  axiosInstance.get<{ data: SkuStock[] }>("v1/report/inventory", {
    params: {
      gtStock: 0,
      ltStock: 10000000,
    },
  });

export interface Category {
  id: number;
  name: string;
  amount: number;
  revenue: number;
}

export const categoryReport = (startDate: Date, endDate: Date) =>
  axiosInstance.get<{ data: Category[] }>("v1/report/category", {
    params: {
      startDate: startDate,
      endDate: endDate,
    },
  });

export interface RevenueAndExpenditure {
  day: Date;
  revenue: number;
  expenditure: number;
  profit: number;
}

export const rneReport = (startDate: Date, endDate: Date) =>
  axiosInstance.get<{ data: RevenueAndExpenditure[] }>(
    "v1/report/revenue-and-expenditure",
    {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    },
  );
