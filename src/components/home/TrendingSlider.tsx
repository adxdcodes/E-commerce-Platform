import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getTrendingProducts } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TrendingSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const products = getTrendingProducts();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">
              Trending Now
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Most Popular
            </h2>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="glass"
              size="icon"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={cn(!canScrollLeft && "opacity-50 cursor-not-allowed")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="glass"
              size="icon"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={cn(!canScrollRight && "opacity-50 cursor-not-allowed")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          onScroll={checkScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[280px] opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
