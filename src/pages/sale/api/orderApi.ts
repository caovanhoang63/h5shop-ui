import { OrderGetDetail } from "@/types/order/orderGetDetail.ts";
import axiosInstance from "@/axiosSetup.ts";

export enum OrderStatus {
  CANCEL,
  PENDING,
  COMPLETE,
  ALL,
}

interface OrderListResponse {
  data: OrderGetDetail[];
}

export async function getListOrder(orderStatus: OrderStatus) {
  try {
    const query =
      orderStatus === OrderStatus.ALL
        ? `?status=1&status=2`
        : `?status=${orderStatus}`;
    const response = await axiosInstance.get<OrderListResponse>(
      `/v1/order${query}`,
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
