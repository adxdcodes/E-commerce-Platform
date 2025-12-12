import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, X, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = 0;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-3">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Start shopping to find something you'll love.
            </p>
            <Button variant="glow" size="lg" asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-display font-bold">Shopping Cart</h1>
            <span className="text-muted-foreground">({items.length} items)</span>
          </div>
          <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="glass rounded-xl p-4 flex gap-4 transition-all hover:border-primary/30"
              >
                {/* Image */}
                <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                  <div className="w-28 h-36 rounded-lg overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-display font-semibold hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span>Size: <span className="text-foreground">{item.size}</span></span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        Color:
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center gap-2 glass-subtle rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Price */}
                    <span className="font-display font-bold text-xl">
                      ${(item.product.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-display font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-primary">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-display font-bold text-xl">
                  <span>Total</span>
                  <span className="gradient-text">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button variant="glow" size="lg" className="w-full mb-4" onClick={handleCheckout}>
                {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
              </Button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="h-4 w-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="h-4 w-4" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}