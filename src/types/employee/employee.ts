export interface Employee {
  id: number;
  phoneNumber: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date | null;
  gender: "male" | "female" | "other";
  status: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
export interface EmployeeCreate {
  phoneNumber: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
}
export interface EmployeeUpdate {
  phoneNumber?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: Date | null;
  gender?: "male" | "female" | "other";
}
export interface EmployeeFilter {
  lk_first_name?: string | null;
  status?: [] | null;
}
