import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Tag,
  Settings,
  LogOut,
  ChevronLeft,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/hooks/useShop';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const shopOwnerLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
  { href: '/dashboard/discounts', label: 'Discounts', icon: Tag },
  { href: '/dashboard/settings', label: 'Shop Settings', icon: Settings },
];

export function ShopOwnerLayout({ children, title }: DashboardLayoutProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  const { shop } = useShop();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Back to Store</span>
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold truncate max-w-[140px]">
                {shop?.name || 'My Shop'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {shop?.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {shopOwnerLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border p-6">
          <h2 className="text-2xl font-display font-bold">{title}</h2>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
