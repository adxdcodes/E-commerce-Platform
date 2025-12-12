import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
}

interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shipping_address: any;
  created_at: string;
  order_items: OrderItem[];
}

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/orders');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;

      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Fetch order items for each order
        const ordersWithItems = await Promise.all(
          (ordersData || []).map(async (order) => {
            const { data: items } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', order.id);
            return { ...order, order_items: items || [] };
          })
        );

        setOrders(ordersWithItems as Order[]);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-display font-bold">My Orders</h1>
          </div>

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3">No Orders Yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              You haven't placed any orders yet. Start shopping to find something you'll love.
            </p>
            <Button variant="glow" size="lg" asChild>
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-display font-bold">My Orders</h1>
          <span className="text-muted-foreground">({orders.length})</span>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="glass rounded-xl overflow-hidden transition-all hover:border-primary/30"
            >
              {/* Order Header */}
              <button
                className="w-full p-4 flex items-center justify-between text-left"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={statusColors[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <span className="font-display font-bold">${order.total.toFixed(2)}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedOrder === order.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Order Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-border p-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h3 className="font-medium mb-3">Items</h3>
                      <div className="space-y-3">
                        {order.order_items.map((item) => (
                          <Link
                            key={item.id}
                            to={`/product/${item.product_id}`}
                            className="flex gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors"
                          >
                            <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0 bg-muted/20">
                              {item.product_image ? (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.product_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.size && `Size: ${item.size}`}
                                {item.size && item.color && ' • '}
                                {item.color && (
                                  <span className="inline-flex items-center gap-1">
                                    Color:
                                    <span
                                      className="w-3 h-3 rounded-full border border-border"
                                      style={{ backgroundColor: item.color }}
                                    />
                                  </span>
                                )}
                              </p>
                              <p className="text-sm">
                                ${item.price.toFixed(0)} × {item.quantity}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Summary & Shipping */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span>${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-border pt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {order.shipping_address && (
                        <div>
                          <h3 className="font-medium mb-3">Shipping Address</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.shipping_address.firstName} {order.shipping_address.lastName}
                            <br />
                            {order.shipping_address.address}
                            <br />
                            {order.shipping_address.city}, {order.shipping_address.state}{' '}
                            {order.shipping_address.zipCode}
                            <br />
                            {order.shipping_address.country}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}