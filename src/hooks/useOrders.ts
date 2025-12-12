import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    fetchOrders();
  }, [user?.id]);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      setOrders(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
}

export function useOrderById(orderId: string) {
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !orderId) {
      setOrder(null);
      return;
    }

    fetchOrder();
  }, [user?.id, orderId]);

  const fetchOrder = async () => {
    if (!user || !orderId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (queryError) throw queryError;

      setOrder(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order';
      setError(message);
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
  };
}

export function useOrderStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    recentOrders: [] as OrderWithItems[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setStats({ totalOrders: 0, totalSpent: 0, recentOrders: [] });
      return;
    }

    fetchStats();
  }, [user?.id]);

  const fetchStats = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('orders')
        .select(`
          id,
          total,
          created_at,
          order_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      const totalSpent = data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const recentOrders = (data || []).slice(0, 5) as unknown as OrderWithItems[];

      setStats({
        totalOrders: data?.length || 0,
        totalSpent,
        recentOrders,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(message);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
