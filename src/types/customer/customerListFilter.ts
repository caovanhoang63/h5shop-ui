export interface CustomerListFilter {
  lkPhoneNumber?: string | null;
  gtCreatedAt?: Date | null;
  ltCreatedAt?: Date | null;
  gtUpdatedAt?: Date | null;
  ltUpdatedAt?: Date | null;
  status?: number[];
  page?: number | null;
}
