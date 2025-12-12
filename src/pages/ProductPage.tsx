import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Star, Heart, Minus, Plus, Truck, RotateCcw, Shield, ChevronDown } from 'lucide-react';
import { getProductById, getTrendingProducts } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('description');

  const relatedProducts = getTrendingProducts().filter(p => p.id !== id).slice(0, 4);

  if (!product) {
    return (
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-display mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    addToCart(product, selectedSize, selectedColor || product.colors[0], quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <main className="pt-20 md:pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to={`/category/${product.category}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to {product.category}
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md">
                    NEW
                  </span>
                )}
                {product.isSale && (
                  <span className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md">
                    SALE
                  </span>
                )}
              </div>

              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 glass-subtle px-3 py-1.5 rounded-md text-xs">
                Click to zoom
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "w-20 h-24 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                {product.brand}
              </p>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-display font-bold">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-secondary/20 text-secondary rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Color Selector */}
            <div>
              <h4 className="text-sm font-medium mb-3">Color</h4>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all hover:scale-110",
                      selectedColor === color || (!selectedColor && index === 0)
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Size</h4>
                <button className="text-sm text-primary hover:underline">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-[48px] h-12 px-4 rounded-lg border text-sm font-medium transition-all",
                      selectedSize === size
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h4 className="text-sm font-medium mb-3">Quantity</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center glass rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="glow"
                size="xl"
                className="flex-1"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                variant="glass"
                size="xl"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isWishlisted && "fill-secondary text-secondary"
                  )}
                />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">2-Year Warranty</span>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-2 pt-4">
              {[
                { id: 'description', title: 'Description', content: product.description },
                { id: 'materials', title: 'Materials & Care', content: product.materials },
                { id: 'shipping', title: 'Shipping & Returns', content: 'Free standard shipping on orders over $100. Express shipping available. 30-day return policy for unworn items with original tags.' },
              ].map(section => (
                <div key={section.id} className="glass rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-medium">{section.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-transform",
                        expandedSection === section.id && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      expandedSection === section.id ? "max-h-40" : "max-h-0"
                    )}
                  >
                    <p className="px-4 pb-4 text-sm text-muted-foreground">
                      {section.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-display font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((product, index) => (
              <div
                key={product.id}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
