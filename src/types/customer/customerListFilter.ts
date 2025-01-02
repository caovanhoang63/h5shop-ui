export interface CustomerListFilter {
  lkPhoneNumber?: string;
  gtCreatedAt?: Date;
  ltCreatedAt?: Date;
  gtUpdatedAt?: Date;
  ltUpdatedAt?: Date;
  status?: number[];
}
