export interface OrderListFilter {
  gtUpdatedAt?: Date | null;
  ltUpdatedAt?: Date | null;
  status?: number[];
  page?: number | null;
}
