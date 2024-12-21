export interface Brand {
  id: number;
  name: string;
}

export interface BrandCreate {
  name: string;
}

export interface BrandUpdate {
  id: number;
  name: string;
}

export class ConvertDataForBrand {
  public convertBrandToBrandUpdate = (brand: Brand): BrandUpdate => {
    return {
      id: brand.id,
      name: brand.name,
    };
  };
}
