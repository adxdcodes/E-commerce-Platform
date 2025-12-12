import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { WishlistItem } from '@/types/database';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('wishlists')
      .select('*, product:products(*, shop:shops(id, name, slug))')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
    } else {
      setWishlist(data as WishlistItem[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to add items to wishlist');
      return false;
    }

    const { error } = await supabase
      .from('wishlists')
      .insert({ user_id: user.id, product_id: productId });

    if (error) {
      if (error.code === '23505') {
        toast.info('Item already in wishlist');
      } else {
        toast.error('Failed to add to wishlist');
        console.error(error);
      }
      return false;
    }

    toast.success('Added to wishlist');
    fetchWishlist();
    return true;
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      toast.error('Failed to remove from wishlist');
      return false;
    }

    toast.success('Removed from wishlist');
    fetchWishlist();
    return true;
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product_id === productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    }
    return addToWishlist(productId);
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  };
}
