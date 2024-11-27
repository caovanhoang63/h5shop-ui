import { Image } from "@/types/image.ts";

export interface Spu {
  id: number;
  name: string;
  description: string;
  metadata: unknown;
  categoryId: number;
  image?: Image;
  outOfStock: boolean;
  stock: number;
  status: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
