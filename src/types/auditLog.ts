export interface Audit {
  id?: bigint;
  userId: number;
  action: string;
  objectType: string;
  objectId: number;
  oldValues?: unknown;
  newValues?: unknown;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
}
