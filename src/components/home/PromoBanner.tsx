import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PromoBanner() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          <div className="absolute inset-0 glass" />
          
          {/* Glow effects */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/30 rounded-full blur-[100px]" />

          {/* Content */}
          <div className="relative px-6 py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/20 backdrop-blur-sm mb-6">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 max-w-2xl mx-auto">
              Get <span className="gradient-text">20% Off</span> Your First Order
            </h2>
            
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Join our community and unlock exclusive perks. Use code NEXUS20 at checkout.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="glow" size="lg" asChild>
                <Link to="/category/men">
                  Shop Now
                </Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
