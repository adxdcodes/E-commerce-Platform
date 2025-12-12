import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Shop } from '@/types/database';
import { Store } from 'lucide-react';

export function ShopsGrid() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shops:', error);
      } else {
        setShops(data || []);
      }
      setLoading(false);
    };

    fetchShops();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Browse Shops
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-card animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (shops.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Browse Shops
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover unique stores from our verified sellers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {shops.map((shop) => (
            <Link
              key={shop.id}
              to={`/shop/${shop.slug}`}
              className="group glass rounded-xl overflow-hidden hover-lift"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {shop.logo_url ? (
                  <img
                    src={shop.logo_url}
                    alt={shop.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store className="h-12 w-12 text-primary/50" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors">
                  {shop.name}
                </h3>
                {shop.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {shop.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
