import { Employee, EmployeeCreate } from "@/types/employee/employee.ts";
import axiosInstance from "@/axiosSetup.ts";

export interface EmployeeResponse {
  data: Employee[];
}
export interface EmployeeCreateResponse {
  data: boolean;
}

export async function getEmployee(): Promise<EmployeeResponse> {
  try {
    const response = await axiosInstance.get<EmployeeResponse>("/v1/employee");
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
      "/v1/employee",
      body,
    );
    console.log("Fetch success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
