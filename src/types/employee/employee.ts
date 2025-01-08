export interface Employee {
  id: number;
  phoneNumber: string;
  userName: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date | null;
  gender: "male" | "female" | "other";
  status: number;
  systemRole: string;
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
  gender: string;
  userName: string;
  password: string;
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
