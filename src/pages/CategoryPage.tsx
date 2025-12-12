import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown } from 'lucide-react';
import { products, categories } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

const sizeFilters = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colorFilters = ['#0A0A0F', '#FFFFFF', '#1A9FFF', '#A259FF', '#23232F'];

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const categoryInfo = categories.find(c => c.id === category);

  const filteredProducts = useMemo(() => {
    let filtered = category === 'all' 
      ? products 
      : products.filter(p => p.category === category);

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(s => selectedSizes.includes(s))
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => 
        p.colors.some(c => selectedColors.includes(c))
      );
    }

    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return filtered;
  }, [category, sortBy, selectedSizes, selectedColors]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  return (
    <main className="pt-20 md:pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            {categoryInfo?.name || 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {categoryInfo?.description || 'Explore our complete collection'}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-16 md:top-20 z-30 glass rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: Filter toggle & count */}
            <div className="flex items-center gap-4">
              <Button
                variant="glass"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(isFilterOpen && "border-primary")}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} products
              </span>
            </div>

            {/* Right: Sort & Grid */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative group">
                <Button variant="glass" className="min-w-[160px] justify-between">
                  {sortOptions.find(o => o.value === sortBy)?.label}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                <div className="absolute top-full right-0 mt-2 w-48 glass rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        sortBy === option.value
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Toggle */}
              <div className="hidden md:flex items-center gap-1 glass rounded-lg p-1">
                <Button
                  variant={gridCols === 3 ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGridCols(3)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridCols === 4 ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setGridCols(4)}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              isFilterOpen ? "max-h-40 mt-4 pt-4 border-t border-border" : "max-h-0"
            )}
          >
            <div className="flex flex-wrap gap-6">
              {/* Size Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {sizeFilters.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md border transition-all",
                        selectedSizes.includes(size)
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Color</h4>
                <div className="flex gap-2">
                  {colorFilters.map(color => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        selectedColors.includes(color)
                          ? "border-primary scale-110"
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedSizes([]);
                    setSelectedColors([]);
                  }}
                  className="self-end"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div
          className={cn(
            "grid gap-4 md:gap-6",
            gridCols === 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No products found matching your filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSizes([]);
                setSelectedColors([]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
