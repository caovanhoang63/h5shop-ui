import {
  Employee,
  EmployeeCreate,
  EmployeeFilter,
  EmployeeUpdate,
} from "@/types/employee/employee.ts";
import axiosInstance from "@/axiosSetup.ts";

export interface EmployeeResponse {
  data: Employee[];
}
export interface EmployeeCreateResponse {
  data: boolean;
}
export interface EmployeeUpdateResponse {
  data: boolean;
}

export async function getEmployee(
  filters: EmployeeFilter,
): Promise<EmployeeResponse> {
  const params: EmployeeFilter = {};
  if (filters.lk_first_name) params.lk_first_name = filters.lk_first_name;
  if (filters.status) params.status = filters.status;
  try {
    const response = await axiosInstance.get<EmployeeResponse>("/v1/users", {
      params: params,
    });
    console.log("Fetch success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function createEmployee(
  body: EmployeeCreate,
): Promise<EmployeeCreateResponse> {
  try {
    const response = await axiosInstance.post<EmployeeCreateResponse>(
      "/v1/auth/register",
      body,
    );
    console.log("Fetch success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function deleteEmployee(
  id: number,
): Promise<EmployeeCreateResponse> {
  try {
    const response = await axiosInstance.delete<EmployeeCreateResponse>(
      `/v1/users/${id}`,
    );
    console.log("Fetch success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function updateEmployee(
  id: number,
  body: EmployeeUpdate,
): Promise<EmployeeUpdateResponse> {
  try {
    const response = await axiosInstance.patch<EmployeeCreateResponse>(
      `/v1/users/${id}`,
      body,
    );
    console.log("Fetch success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export const changePassword = (userId: number, password: string) =>
  axiosInstance.post(`/v1/auth/${userId}/change-password`, {
    password: password,
  });
