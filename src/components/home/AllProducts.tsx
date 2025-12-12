import { products } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';

export function AllProducts() {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            All Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of premium fashion and accessories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
