export type MediaType = "GALLERY" | "INTERIOR" | "BLUEPRINT" | "VIDEO";

export interface ProductMedia {
  id: string;
  type: MediaType;
  url: string;
  alt: string;
  sortOrder: number;
}

export interface ProductSpec {
  id: string;
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  sizeLabel: string;
  width: number | null;
  depth: number | null;
  height: number | null;
  sku: string;
  price: number;
  discountPrice: number | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: { name: string; slug: string };
  isFeatured: boolean;
  variants: ProductVariant[];
  media: ProductMedia[];
  specs: ProductSpec[];
}

export interface CartItem {
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  sizeLabel: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface OrderPayload {
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  items: CartItem[];
}
