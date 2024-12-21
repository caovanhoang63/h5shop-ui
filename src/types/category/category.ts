export interface Category {
  id: number;
  name: string;
  level: number;
  parentId: number;
  children: Category[];
}
