import { useEffect, useState } from 'react';
import { ShopOwnerLayout } from '@/components/layouts/ShopOwnerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useShop } from '@/hooks/useShop';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function ShopDashboard() {
  const { shop, loading: shopLoading } = useShop();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      const [productsRes, ordersRes] = await Promise.all([
        supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('shop_id', shop.id),
        supabase.from('orders').select('*').eq('shop_id', shop.id),
      ]);

      const orders = ordersRes.data || [];
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
      const pendingOrders = orders.filter((o) => o.status === 'pending').length;

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
      });
      setLoading(false);
    };

    fetchStats();
  }, [shop]);

  if (shopLoading) {
    return (
      <ShopOwnerLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </ShopOwnerLayout>
    );
  }

  if (!shop) {
    return (
      <ShopOwnerLayout title="Dashboard">
        <Card className="glass">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Shop Assigned</h3>
            <p className="text-muted-foreground text-center mb-4">
              You don't have a shop assigned to your account yet. Please contact
              the platform administrator.
            </p>
            <Button onClick={() => navigate('/')}>Return to Store</Button>
          </CardContent>
        </Card>
      </ShopOwnerLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-primary',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-secondary',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'text-orange-500',
    },
  ];

  return (
    <ShopOwnerLayout title="Dashboard">
      {!shop.is_active && (
        <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <p className="text-orange-400">
            Your shop is currently inactive. Contact the administrator to
            activate it and make your products visible to customers.
          </p>
        </div>
      )}

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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ShopOwnerLayout>
  );
}
