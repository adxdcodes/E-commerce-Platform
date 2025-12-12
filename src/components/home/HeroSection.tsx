import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
        
        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '-4s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">New Collection 2024</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Redefine Your
            <span className="block gradient-text">Digital Style</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Premium fashion crafted for the future. Sustainable materials, 
            cutting-edge design, and timeless aesthetics.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/category/men">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link to="/new">Explore New Drops</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50 max-w-xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div>
              <p className="text-2xl md:text-3xl font-display font-bold gradient-text">500+</p>
              <p className="text-sm text-muted-foreground mt-1">Products</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-display font-bold gradient-text">50K+</p>
              <p className="text-sm text-muted-foreground mt-1">Customers</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-display font-bold gradient-text">4.9★</p>
              <p className="text-sm text-muted-foreground mt-1">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
}
