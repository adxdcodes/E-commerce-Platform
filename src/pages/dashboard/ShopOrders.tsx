import { useEffect, useState } from 'react';
import { ShopOwnerLayout } from '@/components/layouts/ShopOwnerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClipboardList } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useShop } from '@/hooks/useShop';
import { toast } from 'sonner';

interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  shipping_address: any;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function ShopOrders() {
  const { shop } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!shop) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (shop) {
      fetchOrders();
    }
  }, [shop]);

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update order status');
    } else {
      toast.success('Order status updated');
      fetchOrders();
    }
  };

  if (!shop) {
    return (
      <ShopOwnerLayout title="Orders">
        <p className="text-muted-foreground">No shop assigned.</p>
      </ShopOwnerLayout>
    );
  }

  return (
    <ShopOwnerLayout title="Orders">
      <Card className="glass">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status] || ''}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ShopOwnerLayout>
  );
}
