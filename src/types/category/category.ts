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

export class categoryConverter {
  static convertCategoryToCategoryCreate(category: Category): CategoryCreate {
    return {
      name: category.name,
      parentId: category.parentId,
    };
  }
}
