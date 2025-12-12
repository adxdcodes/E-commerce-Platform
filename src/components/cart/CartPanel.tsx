import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function CartPanel() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-display font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            <span className="text-sm text-muted-foreground">({items.length})</span>
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-2">Your cart is empty</p>
              <Button variant="outline" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="glass rounded-lg p-3 flex gap-3 animate-fade-in"
                >
                  {/* Image */}
                  <div className="w-20 h-24 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>Size: {item.size}</span>
                      <span>•</span>
                      <div
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <span className="font-semibold text-sm">
                        ${(item.product.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary">Free</span>
              </div>
              <div className="flex justify-between font-display font-semibold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span className="gradient-text">${totalPrice.toFixed(0)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button variant="glow" size="lg" className="w-full" asChild>
              <a href="/cart">View Cart & Checkout</a>
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
