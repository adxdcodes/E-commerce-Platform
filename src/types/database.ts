// Database types for the multi-vendor marketplace

export type AppRole = 'superadmin' | 'shop_owner' | 'user' | 'admin' | 'moderator';

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  images: string[];
  category: string | null;
  sizes: string[];
  colors: string[];
  stock: number;
  is_active: boolean;
  is_new: boolean;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  shop?: Shop;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
