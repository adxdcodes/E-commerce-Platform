import { Heart, Users, Leaf, Award, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: "Sustainable",
      description:
        "Committed to eco-friendly materials and ethical production practices",
    },
    {
      icon: Zap,
      title: "Innovative",
      description: "Cutting-edge designs that push the boundaries of fashion",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Building a movement of fashion-forward thinkers and creators",
    },
    {
      icon: Heart,
      title: "Quality First",
      description: "Premium materials and craftsmanship in every piece",
    },
  ];

  const stats = [
    { number: "500+", label: "Premium Products" },
    { number: "50K+", label: "Happy Customers" },
    { number: "100+", label: "Global Partners" },
    { number: "4.9★", label: "Customer Rating" },
  ];

  const team = [
    {
      name: "Alex Rivera",
      role: "Founder & Creative Director",
      description: "Visionary designer with 10+ years in fashion",
    },
    {
      name: "Jordan Chen",
      role: "Head of Sustainability",
      description: "Eco-conscious innovator driving our green initiatives",
    },
    {
      name: "Sam Taylor",
      role: "Community Manager",
      description: "Connecting brands with our vibrant fashion community",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float" />
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-float"
            style={{ animationDelay: "-2s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">
                About Clothify
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Fashion Meets
              <span className="block gradient-text">Technology</span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              We're building the future of fashion by combining sustainable
              practices, innovative design, and cutting-edge technology to
              create pieces that matter.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 gradient-text">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                At Clothify, we believe fashion should be a form of
                self-expression that doesn't compromise our planet. We're
                committed to reimagining the fashion industry through
                sustainable practices, ethical partnerships, and designs that
                inspire confidence and individuality.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every piece in our collection tells a story of innovation,
                craftsmanship, and purpose. We work directly with sustainable
                manufacturers and communities to ensure that fashion forward
                thinking also means thinking responsibly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              These principles guide every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover-lift group"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
                    {stat.number}
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Passionate individuals driving the future of sustainable fashion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover-lift"
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4" />
                <h3 className="text-xl font-display font-semibold mb-1">
                  {member.name}
                </h3>
                <p className="text-primary text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-center">
              Our Journey
            </h2>

            <div className="space-y-8">
              {[
                {
                  year: "2020",
                  title: "The Beginning",
                  description:
                    "Founded Clothify with a vision to revolutionize sustainable fashion.",
                },
                {
                  year: "2021",
                  title: "First Collection",
                  description:
                    "Launched our debut collection featuring eco-friendly materials and innovative designs.",
                },
                {
                  year: "2022",
                  title: "Community Growth",
                  description:
                    "Reached 50K+ customers and expanded to multiple global markets.",
                },
                {
                  year: "2024",
                  title: "Innovation Peak",
                  description:
                    "Introduced our platform connecting independent designers with conscious consumers.",
                },
              ].map((milestone, index) => (
                <div key={index} className="flex gap-6 md:gap-12">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    {index < 3 && (
                      <div className="h-16 w-1 bg-gradient-to-b from-primary/50 to-transparent" />
                    )}
                  </div>
                  <div className="glass rounded-2xl p-6 flex-1">
                    <p className="text-primary font-display font-semibold mb-2">
                      {milestone.year}
                    </p>
                    <h3 className="text-xl font-display font-bold mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Join the Movement
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Discover our latest collections and become part of the sustainable
              fashion revolution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/category/women">Explore Collections</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
