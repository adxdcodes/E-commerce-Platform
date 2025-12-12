import { useEffect, useState } from 'react';
import { SuperadminLayout } from '@/components/layouts/SuperadminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MoreHorizontal, Store } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Shop, Profile } from '@/types/database';

interface ShopWithOwner extends Shop {
  owner?: Profile;
}

export default function AdminShops() {
  const [shops, setShops] = useState<ShopWithOwner[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newShop, setNewShop] = useState({
    name: '',
    slug: '',
    description: '',
    owner_id: '',
  });

  const fetchShops = async () => {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shops:', error);
    } else {
      // Fetch owner profiles separately
      const ownerIds = [...new Set(data.map((s) => s.owner_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', ownerIds);

      const shopsWithOwners = data.map((shop) => ({
        ...shop,
        owner: profiles?.find((p) => p.id === shop.owner_id),
      }));

      setShops(shopsWithOwners);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setUsers(data || []);
  };

  useEffect(() => {
    fetchShops();
    fetchUsers();
  }, []);

  const handleCreateShop = async () => {
    if (!newShop.name || !newShop.slug || !newShop.owner_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    const { error } = await supabase.from('shops').insert({
      name: newShop.name,
      slug: newShop.slug.toLowerCase().replace(/\s+/g, '-'),
      description: newShop.description,
      owner_id: newShop.owner_id,
      is_active: false,
    });

    if (error) {
      toast.error('Failed to create shop: ' + error.message);
    } else {
      // Add shop_owner role to the user
      await supabase.from('user_roles').insert({
        user_id: newShop.owner_id,
        role: 'shop_owner',
      });

      toast.success('Shop created successfully');
      setIsCreateOpen(false);
      setNewShop({ name: '', slug: '', description: '', owner_id: '' });
      fetchShops();
    }
  };

  const toggleShopStatus = async (shop: Shop) => {
    const { error } = await supabase
      .from('shops')
      .update({ is_active: !shop.is_active })
      .eq('id', shop.id);

    if (error) {
      toast.error('Failed to update shop status');
    } else {
      toast.success(shop.is_active ? 'Shop deactivated' : 'Shop activated');
      fetchShops();
    }
  };

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SuperadminLayout title="Manage Shops">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="glow-blue">
                <Plus className="h-4 w-4 mr-2" />
                Create Shop
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Shop</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Shop Name *</Label>
                  <Input
                    value={newShop.name}
                    onChange={(e) =>
                      setNewShop({ ...newShop, name: e.target.value })
                    }
                    placeholder="My Awesome Shop"
                  />
                </div>
                <div>
                  <Label>Slug *</Label>
                  <Input
                    value={newShop.slug}
                    onChange={(e) =>
                      setNewShop({ ...newShop, slug: e.target.value })
                    }
                    placeholder="my-awesome-shop"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newShop.description}
                    onChange={(e) =>
                      setNewShop({ ...newShop, description: e.target.value })
                    }
                    placeholder="Tell us about this shop..."
                  />
                </div>
                <div>
                  <Label>Shop Owner *</Label>
                  <select
                    className="w-full px-3 py-2 bg-background border border-input rounded-md"
                    value={newShop.owner_id}
                    onChange={(e) =>
                      setNewShop({ ...newShop, owner_id: e.target.value })
                    }
                  >
                    <option value="">Select an owner</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || user.email || user.id}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleCreateShop} className="w-full">
                  Create Shop
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Shops Table */}
        <Card className="glass">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
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
                ) : filteredShops.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Store className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No shops found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShops.map((shop) => (
                    <TableRow key={shop.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{shop.name}</p>
                          <p className="text-sm text-muted-foreground">
                            /{shop.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {shop.owner?.full_name || shop.owner?.email || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={shop.is_active ? 'default' : 'secondary'}
                        >
                          {shop.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(shop.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => toggleShopStatus(shop)}
                            >
                              {shop.is_active ? 'Deactivate' : 'Activate'}
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
    </SuperadminLayout>
  );
}
