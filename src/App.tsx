import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartPanel } from "@/components/cart/CartPanel";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import NewDropsPage from "./pages/NewDropsPage";
import SalePage from "./pages/SalePage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ShopPage from "./pages/ShopPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminShops from "./pages/admin/AdminShops";
import AdminUsers from "./pages/admin/AdminUsers";

// Shop owner pages
import ShopDashboard from "./pages/dashboard/ShopDashboard";
import ShopProducts from "./pages/dashboard/ShopProducts";
import ShopOrders from "./pages/dashboard/ShopOrders";
import ShopSettings from "./pages/dashboard/ShopSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Admin Routes (no navbar/footer) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRoles={["superadmin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/shops"
                  element={
                    <ProtectedRoute requiredRoles={["superadmin"]}>
                      <AdminShops />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRoles={["superadmin"]}>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />

                {/* Shop Owner Routes (no navbar/footer) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requiredRoles={["shop_owner"]}>
                      <ShopDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/products"
                  element={
                    <ProtectedRoute requiredRoles={["shop_owner"]}>
                      <ShopProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/orders"
                  element={
                    <ProtectedRoute requiredRoles={["shop_owner"]}>
                      <ShopOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/settings"
                  element={
                    <ProtectedRoute requiredRoles={["shop_owner"]}>
                      <ShopSettings />
                    </ProtectedRoute>
                  }
                />

                {/* Public Routes with Navbar/Footer */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
                      <CartPanel />
                      <div className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route
                            path="/category/:category"
                            element={<CategoryPage />}
                          />
                          <Route
                            path="/product/:id"
                            element={<ProductPage />}
                          />
                          <Route path="/shop/:slug" element={<ShopPage />} />
                          <Route path="/new" element={<NewDropsPage />} />
                          <Route path="/sale" element={<SalePage />} />
                          <Route path="/auth" element={<AuthPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/orders" element={<OrdersPage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                      <Footer />
                    </div>
                  }
                />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
