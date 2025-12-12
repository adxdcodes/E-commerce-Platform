import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartPanel } from '@/components/cart/CartPanel';
import { DatabaseProductCard } from '@/components/products/DatabaseProductCard';
import { Store, ArrowLeft } from 'lucide-react';
import type { Shop, Product } from '@/types/database';

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      if (!slug) return;

      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (shopError || !shopData) {
        console.error('Error fetching shop:', shopError);
        setLoading(false);
        return;
      }

      setShop(shopData);

      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      setProducts((productsData as Product[]) || []);
      setLoading(false);
    };

    fetchShopAndProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <CartPanel />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <CartPanel />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <Store className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Shop Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The shop you're looking for doesn't exist or is inactive.
          </p>
          <Link
            to="/"
            className="text-primary hover:underline flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartPanel />
      <main className="flex-1">
        {/* Shop Header */}
        <div className="relative">
          {shop.banner_url ? (
            <div className="h-48 md:h-64 w-full">
              <img
                src={shop.banner_url}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
          ) : (
            <div className="h-48 md:h-64 w-full bg-gradient-to-br from-primary/20 to-secondary/20" />
          )}

          <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-10">
            <div className="flex items-end gap-4">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-xl glass overflow-hidden flex items-center justify-center">
                {shop.logo_url ? (
                  <img
                    src={shop.logo_url}
                    alt={shop.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store className="h-12 w-12 text-primary" />
                )}
              </div>
              <div className="pb-2">
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  {shop.name}
                </h1>
                {shop.description && (
                  <p className="text-muted-foreground mt-1 max-w-xl">
                    {shop.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <section className="py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-xl font-semibold mb-6">
              Products ({products.length})
            </h2>

            {products.length === 0 ? (
              <div className="text-center py-16">
                <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  This shop doesn't have any products yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <DatabaseProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
