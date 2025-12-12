import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/database';

interface UseProductsOptions {
  shopId?: string;
  category?: string;
  isNew?: boolean;
  isTrending?: boolean;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*, shop:shops(id, name, slug, logo_url)')
        .eq('is_active', true);

      if (options.shopId) {
        query = query.eq('shop_id', options.shopId);
      }
      if (options.category) {
        query = query.eq('category', options.category);
      }
      if (options.isNew) {
        query = query.eq('is_new', true);
      }
      if (options.isTrending) {
        query = query.eq('is_trending', true);
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error: err } = await query;

      if (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } else {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [options.shopId, options.category, options.isNew, options.isTrending, options.limit]);

  return { products, loading, error };
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, shop:shops(id, name, slug, logo_url)')
        .eq('id', productId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data as Product | null);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  return { product, loading };
}
