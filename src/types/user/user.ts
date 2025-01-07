export interface User {
  id: number;
  phoneNumber: string | null;
  userName: string;
  email: string | null;
  address: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  gender: "male" | "female" | "other";
  systemRole: string;
  avatar: string | null;
}
