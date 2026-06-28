export interface ProductVariant {
  id: number;
  product_id: number;
  size: string;
  price: string;
  compare_at_price?: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  brand: string;
  brand_id?: number;
  slug: string;
  description: string;
  image: string;
  image_url: string;
  gallery?: string[];
  gallery_urls?: string[];
  is_active: boolean;
  is_pack: boolean;
  is_custom_pack: boolean;
  pack_slots?: number;
  is_niche: boolean;
  gender: 'homme' | 'femme' | 'unisex';
  badge_label?: string;
  badge_color?: string;
  meta_title?: string;
  meta_description?: string;
  variants: ProductVariant[];
  category?: {
    id: number;
    name: string;
    slug: string;
    full_path?: string;
  };
  bundle_products?: Product[];
  related_products?: Product[];
}
