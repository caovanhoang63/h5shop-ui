export interface StringMap {
  [key: string]: string;
}

export const RoleMap: StringMap = {
  admin: "Quản trị viên",
  owner: "Chủ cửa hàng",
  sale_staff: "Nhân viên bán hàng",
  warehouse_staff: "Nhân viên kho",
  technical_staff: "Nhân viên kĩ thuật",
  finance_staff: "Nhân viên tài chính",
};
export const GenderMap: StringMap = {
  other: "khác",
  male: "Nam",
  female: "Nữ",
};

export enum SystemRole {
  admin = "admin",
  owner = "owner",
  sale_staff = "sale_staff",
  warehouse_staff = "warehouse_staff",
  technical_staff = "technical_staff",
  finance_staff = "finance_staff",
}
