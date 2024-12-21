export interface Brand {
  id: number;
  name: string;
}

export interface BrandCreate {
  name: string;
}

export interface BrandUpdate {
  name: string;
}

export class brandConverter {
  static convertBrandToBrandCreate(brand: Brand): BrandCreate {
    return {
      name: brand.name,
    };
  }

  static convertBrandToBrandUpdate(brand: Brand): BrandUpdate {
    return {
      name: brand.name,
    };
  }
}
