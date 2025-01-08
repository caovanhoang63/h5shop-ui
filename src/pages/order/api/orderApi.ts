import { OrderGetDetail } from "@/types/order/orderGetDetail.ts";
import axiosInstance from "@/axiosSetup.ts";
import { OrderListFilter } from "@/types/order/orderListFilter.ts";
import { Paging } from "@/types/paging.ts";
import { OrderItemTable } from "@/types/order/orderItemTable.ts";

interface OrderResponse {
  data: OrderGetDetail;
  extra?: never;
  paging?: never;
}
export async function getOrderById(id: number) {
  try {
    const response = await axiosInstance.get<OrderResponse>(`/v1/order/${id}`);
    console.log("get by id response", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

interface OrderTableResponse {
  data: OrderItemTable[];
  extra?: never;
  paging: Paging;
}

export async function getOrderTableApi(
  filters: OrderListFilter,
  paging: Paging,
): Promise<OrderTableResponse> {
  try {
    const response = await axiosInstance.get<OrderTableResponse>("/v1/order", {
      params: {
        ...filters,
        ...paging,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function deleteOrderApi(id: number) {
  try {
    const response = await axiosInstance.delete(`/v1/order/${id}`);
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
