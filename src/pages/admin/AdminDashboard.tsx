import { useEffect, useState } from 'react';
import { SuperadminLayout } from '@/components/layouts/SuperadminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Users, Package, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalShops: number;
  activeShops: number;
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalShops: 0,
    activeShops: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [shopsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        supabase.from('shops').select('id, is_active'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
      ]);

      const shops = shopsRes.data || [];
      setStats({
        totalShops: shops.length,
        activeShops: shops.filter((s) => s.is_active).length,
        totalUsers: usersRes.count || 0,
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Shops',
      value: stats.totalShops,
      subtitle: `${stats.activeShops} active`,
      icon: Store,
      color: 'text-primary',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      subtitle: 'Registered users',
      icon: Users,
      color: 'text-secondary',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      subtitle: 'Across all shops',
      icon: Package,
      color: 'text-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      subtitle: 'All time',
      icon: ShoppingCart,
      color: 'text-orange-500',
    },
  ];

  return (
    <SuperadminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="glass">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? '...' : card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.subtitle}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </SuperadminLayout>
  );
}
