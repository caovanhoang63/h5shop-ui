export interface SpuFilter {
  name?: string;
  categoryId?: number;
  brandId?: number;
  status?: number | null;
  page?: number;
  limit?: number;
}
