import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Lock, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const shipping = 0;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to complete your order');
      navigate('/auth?redirect=/checkout');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          subtotal: totalPrice,
          shipping: shipping,
          tax: tax,
          total: total,
          shipping_address: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zipCode: shippingInfo.zipCode,
            country: shippingInfo.country,
            phone: shippingInfo.phone,
          },
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and show confirmation
      clearCart();
      setStep('confirmation');
      toast.success('Order placed successfully!');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && step !== 'confirmation') {
    navigate('/cart');
    return null;
  }

  // Confirmation step
  if (step === 'confirmation') {
    return (
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 glow-blue">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-3">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your purchase. We've sent a confirmation email to {shippingInfo.email || user?.email}.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <a href="/orders">View Orders</a>
              </Button>
              <Button variant="glow" asChild>
                <a href="/">Continue Shopping</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-display font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-primary glow-blue' : 'bg-primary/30'}`}>
              <Truck className="w-4 h-4" />
            </div>
            <span className={step === 'shipping' ? 'text-foreground' : 'text-muted-foreground'}>Shipping</span>
          </div>
          <div className="w-12 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-primary glow-blue' : 'bg-muted'}`}>
              <CreditCard className="w-4 h-4" />
            </div>
            <span className={step === 'payment' ? 'text-foreground' : 'text-muted-foreground'}>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="glass rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      required
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      required
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    required
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      required
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      required
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      required
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" variant="glow" size="lg" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="glass rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    required
                    value={paymentInfo.cardName}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      required
                      value={paymentInfo.expiry}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      required
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is secured with SSL encryption</span>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep('shipping')} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" variant="glow" size="lg" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-display font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        ${(item.product.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-primary">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-display font-bold text-lg">
                  <span>Total</span>
                  <span className="gradient-text">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}