import { getSaleProducts } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';

export default function SalePage() {
  const products = getSaleProducts();

  return (
    <main className="pt-20 md:pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">
            Limited Time
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Sale</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Premium pieces at exceptional prices. Shop now before they're gone.
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
