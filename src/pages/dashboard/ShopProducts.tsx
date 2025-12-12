import { useEffect, useState } from 'react';
import { ShopOwnerLayout } from '@/components/layouts/ShopOwnerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Package, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useShop } from '@/hooks/useShop';
import { toast } from 'sonner';
import type { Product } from '@/types/database';

const defaultProduct = {
  name: '',
  slug: '',
  description: '',
  price: '',
  compare_at_price: '',
  category: '',
  sizes: '',
  colors: '',
  stock: '',
  images: '',
  is_new: false,
  is_trending: false,
};

export default function ShopProducts() {
  const { shop } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(defaultProduct);

  const fetchProducts = async () => {
    if (!shop) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shop.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (shop) {
      fetchProducts();
    }
  }, [shop]);

  const handleSubmit = async () => {
    if (!shop) return;
    if (!formData.name || !formData.slug || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const productData = {
      shop_id: shop.id,
      name: formData.name,
      slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description || null,
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price
        ? parseFloat(formData.compare_at_price)
        : null,
      category: formData.category || null,
      sizes: formData.sizes ? formData.sizes.split(',').map((s) => s.trim()) : [],
      colors: formData.colors ? formData.colors.split(',').map((c) => c.trim()) : [],
      stock: parseInt(formData.stock) || 0,
      images: formData.images ? formData.images.split(',').map((i) => i.trim()) : [],
      is_new: formData.is_new,
      is_trending: formData.is_trending,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        toast.error('Failed to update product');
      } else {
        toast.success('Product updated');
        setIsDialogOpen(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from('products').insert(productData);

      if (error) {
        toast.error('Failed to create product: ' + error.message);
      } else {
        toast.success('Product created');
        setIsDialogOpen(false);
        fetchProducts();
      }
    }

    setFormData(defaultProduct);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() || '',
      category: product.category || '',
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      stock: product.stock.toString(),
      images: product.images.join(', '),
      is_new: product.is_new,
      is_trending: product.is_trending,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted');
      fetchProducts();
    }
  };

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id);

    if (error) {
      toast.error('Failed to update product');
    } else {
      toast.success(product.is_active ? 'Product deactivated' : 'Product activated');
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!shop) {
    return (
      <ShopOwnerLayout title="Products">
        <p className="text-muted-foreground">No shop assigned.</p>
      </ShopOwnerLayout>
    );
  }

  return (
    <ShopOwnerLayout title="Products">
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setFormData(defaultProduct);
              setEditingProduct(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="glow-blue">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Compare at Price</Label>
                  <Input
                    type="number"
                    value={formData.compare_at_price}
                    onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Sizes (comma separated)</Label>
                  <Input
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                  />
                </div>
                <div>
                  <Label>Colors (comma separated)</Label>
                  <Input
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Black, White, Blue"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Image URLs (comma separated)</Label>
                  <Input
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_new}
                      onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                    />
                    New Arrival
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_trending}
                      onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                    />
                    Trending
                  </label>
                </div>
                <div className="col-span-2">
                  <Button onClick={handleSubmit} className="w-full">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card className="glass">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No products yet</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="h-12 w-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleActive(product)}>
                              {product.is_active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(product.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ShopOwnerLayout>
  );
}
