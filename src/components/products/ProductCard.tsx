import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info('Please sign in to add items to cart');
      navigate('/auth');
      return;
    }
    
    addToCart(product, product.sizes[0], product.colors[0]);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info('Please sign in to save items to wishlist');
      navigate('/auth');
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn("group block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="glass rounded-xl overflow-hidden hover-lift">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Primary Image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-700",
              isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
            )}
          />
          
          {/* Secondary Image */}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-700",
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md">
                NEW
              </span>
            )}
            {product.isSale && (
              <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md">
                SALE
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 h-8 w-8 rounded-full glass transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}
            onClick={handleWishlist}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isWishlisted ? "fill-secondary text-secondary" : ""
              )}
            />
          </Button>

          {/* Quick Actions */}
          <div
            className={cn(
              "absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Button
              variant="glass"
              size="sm"
              className="flex-1"
              onClick={handleQuickAdd}
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Quick Add
            </Button>
            <Button variant="glass" size="icon" className="h-9 w-9">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.brand}
          </p>
          <h3 className="font-medium text-sm mb-2 group-hover:text-primary transition-colors truncate">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Color Options */}
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
