import { Category, CategoryCreate } from "@/types/category/category.ts";
import axiosInstance from "@/axiosSetup.ts";

export interface ResponseCategory {
  data: Category[];
  extra?: never;
  paging?: never;
}

export async function getCategories(): Promise<ResponseCategory> {
  try {
    const response =
      await axiosInstance.get<ResponseCategory>("/v1/category/tree");
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function createCategory(category: CategoryCreate): Promise<void> {
  try {
    await axiosInstance.post<ResponseCategory>("/v1/category", category);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
