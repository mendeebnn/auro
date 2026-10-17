export type Language = 'mn' | 'en';

export type CategoryKey = 'all' | 'men' | 'women' | 'new';

export interface Product {
  id: string;
  nameMn: string; // e.g. "Placeholder 01" or real product name
  nameEn: string; // e.g. "Product 01"
  category: CategoryKey;
  categoryMn: string;
  categoryEn: string;
  gender?: 'men' | 'women' | 'unisex';
  imagePlaceholderText: string;
  imageUrl?: string; // Optional real image URL or base64 photo
  descriptionMn: string;
  descriptionEn: string;
  sizes?: string[];
  colors?: { nameMn: string; nameEn: string; hex: string }[];
  inStock: boolean;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  city: string;
  district: string;
  streetAddress: string;
  notes?: string;
  createdAt: string;
  status?: 'new' | 'contacted' | 'completed' | 'cancelled';
}

export type PageView = 'home' | 'collection' | 'product-detail' | 'admin';

