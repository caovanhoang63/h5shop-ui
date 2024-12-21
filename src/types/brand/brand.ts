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

export class brandConverter {
  static convertBrandToBrandCreate(brand: Brand): BrandCreate {
    return {
      name: brand.name,
    };
  }
}
