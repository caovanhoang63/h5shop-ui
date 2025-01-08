export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  children: Category[];
}

export interface CategoryCreate {
  name: string;
  parentId: number | null;
}

export interface CategoryUpdate {
  name: string;
  parentId: number | null;
}

export class categoryConverter {
  static convertCategoryToCategoryCreate(category: Category): CategoryCreate {
    return {
      name: category.name,
      parentId: category.parentId,
    };
  }

  static convertCategoryToCategoryUpdate(category: Category): CategoryUpdate {
    return {
      name: category.name,
      parentId: category.parentId,
    };
  }
}
