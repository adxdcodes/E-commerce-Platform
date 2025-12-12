import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartPanel } from '@/components/cart/CartPanel';
import { useTheme, ThemeName } from '@/context/ThemeContext';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartPanel />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Palette className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold">Settings</h1>
          </div>

          {/* Theme Selection */}
          <section className="glass rounded-xl p-6">
            <h2 className="text-xl font-display font-semibold mb-2">Color Theme</h2>
            <p className="text-muted-foreground mb-6">
              Choose a color theme that suits your style
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name)}
                  className={cn(
                    'relative p-4 rounded-xl border-2 transition-all duration-300 hover-lift',
                    theme === t.name
                      ? 'border-primary glow-subtle'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {/* Theme Preview */}
                  <div 
                    className="w-full h-24 rounded-lg mb-3 overflow-hidden"
                    style={{ backgroundColor: t.preview.bg }}
                  >
                    <div className="h-full flex items-center justify-center gap-2 p-3">
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: t.preview.primary }}
                      />
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: t.preview.secondary }}
                      />
                      <div 
                        className="flex-1 h-3 rounded-full"
                        style={{ 
                          background: `linear-gradient(to right, ${t.preview.primary}, ${t.preview.secondary})` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Theme Name */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t.label}</span>
                    {theme === t.name && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Preview Section */}
          <section className="mt-8 glass rounded-xl p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Preview</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Primary Button
                </button>
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Secondary Button
                </button>
                <button className="px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors">
                  Outline Button
                </button>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-card border border-border rounded-lg">
                  <p className="font-medium">Card Component</p>
                  <p className="text-sm text-muted-foreground">With muted text</p>
                </div>
                <div className="flex-1 p-4 bg-muted rounded-lg">
                  <p className="font-medium">Muted Surface</p>
                  <p className="text-sm text-muted-foreground">For subtle areas</p>
                </div>
              </div>

              <p className="gradient-text text-2xl font-display font-bold">
                Gradient Text Preview
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
