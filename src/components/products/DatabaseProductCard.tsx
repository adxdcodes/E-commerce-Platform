import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product } from '@/types/database';

interface DatabaseProductCardProps {
  product: Product;
}

export function DatabaseProductCard({ product }: DatabaseProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info('Please sign in to add items to cart');
      navigate('/auth');
      return;
    }

    // Create a cart-compatible product object
    const cartProduct = {
      id: product.id,
      name: product.name,
      brand: (product as any).shop?.name || 'Shop',
      price: product.price,
      originalPrice: product.compare_at_price || undefined,
      image: product.images[0] || '/placeholder.svg',
      images: product.images.length > 0 ? product.images : ['/placeholder.svg'],
      category: product.category || 'uncategorized',
      subcategory: product.category || 'general',
      sizes: product.sizes,
      colors: product.colors,
      description: product.description || '',
      materials: '',
      rating: 4.5,
      reviews: 0,
      isNew: product.is_new,
      isTrending: product.is_trending,
    };

    addToCart(
      cartProduct as any,
      product.sizes[0] || 'One Size',
      product.colors[0] || 'Default'
    );
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info('Please sign in to save items to wishlist');
      navigate('/auth');
      return;
    }

    await toggleWishlist(product.id);
  };

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-xl overflow-hidden glass hover-lift">
        {/* Image Container */}
        <div className="product-image-container aspect-[3/4] bg-muted/20">
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="primary-image h-full w-full object-cover"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="secondary-image h-full w-full object-cover"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded">
                -{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded">
                OUT OF STOCK
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute top-3 right-3 h-8 w-8 rounded-full glass transition-all duration-300',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            )}
            onClick={handleWishlist}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                isWishlisted ? 'fill-destructive text-destructive' : 'text-foreground'
              )}
            />
          </Button>

          {/* Quick Add Button */}
          {product.stock > 0 && (
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                'absolute bottom-3 left-3 right-3 transition-all duration-300',
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              onClick={handleQuickAdd}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-display font-semibold">${product.price}</span>
            {product.compare_at_price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.compare_at_price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
