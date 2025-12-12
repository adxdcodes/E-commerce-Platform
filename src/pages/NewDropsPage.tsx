import { getNewProducts } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';

export default function NewDropsPage() {
  const products = getNewProducts();

  return (
    <main className="pt-20 md:pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm text-secondary font-medium uppercase tracking-wider mb-2 block">
            Just Landed
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            New Drops
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Be the first to discover our latest arrivals. Fresh styles, limited quantities.
          </p>
        </div>

        {/* Product Grid */}
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
      </div>
    </main>
  );
}
