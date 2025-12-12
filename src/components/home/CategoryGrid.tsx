import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categories } from '@/data/products';
import { cn } from '@/lib/utils';

export function CategoryGrid() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore our curated collections designed for every style and occasion
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl aspect-[3/4] hover-lift",
                index === 0 && "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2"
              )}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              
              {/* Glass Card */}
              <div className="absolute inset-x-4 bottom-4 glass rounded-xl p-4 transition-all duration-300 group-hover:translate-y-0 translate-y-1 opacity-90 group-hover:opacity-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
