export enum CustomerGender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Customer {
  id: number;
  phoneNumber: string;
  address?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  paymentAmount: number;
  gender: CustomerGender;
  status: number;
}
