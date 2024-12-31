import { OrderGetDetail } from "@/types/order/orderGetDetail.ts";
import axiosInstance from "@/axiosSetup.ts";
import { OrderCreate } from "@/types/order/orderCreate.ts";
import { OrderItemCreate } from "@/types/orderItem/orderItemCreate.ts";

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

export async function createOrder(order: OrderCreate) {
  try {
    const response = await axiosInstance.post<OrderGetDetail>(
      "/v1/order",
      order,
    );
    return response.data;
  } catch (error) {
    console.error("Create error:", error);
    throw error;
  }
}

export async function deleteOrder(id: number) {
  try {
    const response = await axiosInstance.delete<void>(`/v1/order/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

export async function addOrderItem(item: OrderItemCreate) {
  try {
    const response = await axiosInstance.post<void>("/v1/order-item", item);
    return response.data;
  } catch (error) {
    console.error("Create error:", error);
    throw error;
  }
}

export async function deleteOrderItem(orderId: number, skuId: number) {
  try {
    const response = await axiosInstance.delete<void>(
      `/v1/order-item/?orderId=${orderId}&skuId=${skuId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}
