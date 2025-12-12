import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getNewProducts } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

export function NewArrivals() {
  const products = getNewProducts().slice(0, 4);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-sm text-secondary font-medium uppercase tracking-wider mb-2 block">
              Fresh Drops
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              New Arrivals
            </h2>
          </div>

          <Button variant="ghost" asChild className="hidden md:flex">
            <Link to="/new">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link to="/new">
              View All New Arrivals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
