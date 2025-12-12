-- Drop and recreate has_role function to ensure it works with new enum values
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Add superadmins policy for user_roles
CREATE POLICY "Superadmins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'superadmin'::app_role));

-- Create shops table
CREATE TABLE public.shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  logo_url text,
  banner_url text,
  is_active boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active shops"
ON public.shops FOR SELECT
USING (is_active = true OR owner_id = auth.uid() OR public.has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Shop owners can update their shop"
ON public.shops FOR UPDATE
USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can insert shops"
ON public.shops FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'superadmin'::app_role));

CREATE POLICY "Superadmins can delete shops"
ON public.shops FOR DELETE
USING (public.has_role(auth.uid(), 'superadmin'::app_role));

-- Create products table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  compare_at_price numeric CHECK (compare_at_price >= 0),
  images text[] DEFAULT '{}',
  category text,
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active boolean DEFAULT true,
  is_new boolean DEFAULT false,
  is_trending boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (shop_id, slug)
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
ON public.products FOR SELECT
USING (
  (is_active = true AND EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND is_active = true))
  OR EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'superadmin'::app_role)
);

CREATE POLICY "Shop owners can insert products"
ON public.products FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'superadmin'::app_role)
);

CREATE POLICY "Shop owners can update products"
ON public.products FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'superadmin'::app_role)
);

CREATE POLICY "Shop owners can delete products"
ON public.products FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'superadmin'::app_role)
);

-- Create wishlist table
CREATE TABLE public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their wishlist"
ON public.wishlists FOR ALL
USING (auth.uid() = user_id);

-- Create reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update reviews"
ON public.reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete reviews"
ON public.reviews FOR DELETE
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'superadmin'::app_role));

-- Add shop_id to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shop_id uuid REFERENCES public.shops(id);

-- Create updated_at triggers
CREATE TRIGGER update_shops_updated_at
BEFORE UPDATE ON public.shops
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Drop existing order policies that conflict
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;

-- Add policies for orders
CREATE POLICY "Users and shop owners can view orders"
ON public.orders FOR SELECT
USING (
  auth.uid() = user_id 
  OR EXISTS (SELECT 1 FROM public.shops WHERE id = orders.shop_id AND owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'superadmin'::app_role)
);

CREATE POLICY "Users can insert orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Shop owners can update orders"
ON public.orders FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.shops WHERE id = orders.shop_id AND owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'superadmin'::app_role)
);