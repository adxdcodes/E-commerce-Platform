import { useState } from 'react';
import { ShopOwnerLayout } from '@/components/layouts/ShopOwnerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useShop } from '@/hooks/useShop';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function ShopSettings() {
  const { shop } = useShop();
  const [formData, setFormData] = useState({
    name: shop?.name || '',
    description: shop?.description || '',
    logo_url: shop?.logo_url || '',
    banner_url: shop?.banner_url || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!shop) return;

    setSaving(true);
    const { error } = await supabase
      .from('shops')
      .update({
        name: formData.name,
        description: formData.description,
        logo_url: formData.logo_url || null,
        banner_url: formData.banner_url || null,
      })
      .eq('id', shop.id);

    if (error) {
      toast.error('Failed to update shop settings');
    } else {
      toast.success('Shop settings updated');
    }
    setSaving(false);
  };

  if (!shop) {
    return (
      <ShopOwnerLayout title="Shop Settings">
        <p className="text-muted-foreground">No shop assigned.</p>
      </ShopOwnerLayout>
    );
  }

  return (
    <ShopOwnerLayout title="Shop Settings">
      <div className="max-w-2xl">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Shop Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input
                value={formData.logo_url}
                onChange={(e) =>
                  setFormData({ ...formData, logo_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Banner URL</Label>
              <Input
                value={formData.banner_url}
                onChange={(e) =>
                  setFormData({ ...formData, banner_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass mt-6">
          <CardHeader>
            <CardTitle>Shop Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Status: {shop.is_active ? 'Active' : 'Inactive'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {shop.is_active
                    ? 'Your shop is visible to customers'
                    : 'Contact admin to activate your shop'}
                </p>
              </div>
              <div
                className={`h-3 w-3 rounded-full ${
                  shop.is_active ? 'bg-green-500' : 'bg-orange-500'
                }`}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ShopOwnerLayout>
  );
}
