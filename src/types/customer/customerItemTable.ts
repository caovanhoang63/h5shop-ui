export interface CustomerItemTable {
  id: number;
  phoneNumber: string;
  address?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  paymentAmount: number;
  discountPoint: number;
  gender: string;
  status: number;
}
