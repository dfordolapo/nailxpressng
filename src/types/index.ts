export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: 'handmade' | 'factory' | null;
  categoryName: string | null;
  nailShape?: string;
  style?: string;
  lengths: string[];
  sizes: string[];
  images: string[];
  image: string | null;
  videoUrl?: string | null;
  newArrival: boolean;
  bestseller: boolean;
  inStock: boolean;
  stockCount: number;
  createdAt: string;
  tags?: string[];
  color?: string | null;
  colors?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string | null;
  length?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  tagline?: string;
}

export interface CustomOrderRequest {
  shape: string;
  length: string;
  design: string;
  color?: string;
  notes?: string;
  referenceImage?: string | null;
  name: string;
  email: string;
  phone?: string;
  inspirationUrl?: string | null;
}
