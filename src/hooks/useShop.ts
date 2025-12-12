import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Shop } from '@/types/database';

export function useShop() {
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setShop(null);
      setLoading(false);
      return;
    }

    const fetchShop = async () => {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching shop:', error);
      } else {
        setShop(data);
      }
      setLoading(false);
    };

    fetchShop();
  }, [user]);

  return { shop, loading };
}
