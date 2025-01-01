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
