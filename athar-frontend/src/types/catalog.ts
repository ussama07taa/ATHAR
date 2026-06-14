export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
  children?: MenuCategory[];
  products_count?: number;
}

export interface CategoryDetail {
  id: number;
  name: string;
  slug: string;
  description?: string;
  ancestors: { name: string; slug: string }[];
  children: { id: number; name: string; slug: string }[];
}
