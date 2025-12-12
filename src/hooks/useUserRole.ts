import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { AppRole } from '@/types/database';

export function useUserRole() {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        setRoles([]);
      } else {
        setRoles(data.map((r) => r.role as AppRole));
      }
      setLoading(false);
    };

    fetchRoles();
  }, [user, authLoading]);

  const hasRole = (role: AppRole) => roles.includes(role);
  const isSuperadmin = () => hasRole('superadmin');
  const isShopOwner = () => hasRole('shop_owner');
  const isUser = () => hasRole('user');

  return {
    roles,
    loading,
    hasRole,
    isSuperadmin,
    isShopOwner,
    isUser,
  };
}
