import { useEffect, useState } from 'react';
import { SuperadminLayout } from '@/components/layouts/SuperadminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Search, MoreHorizontal, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Profile, UserRole, AppRole } from '@/types/database';

interface UserWithRoles extends Profile {
  roles: AppRole[];
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      return;
    }

    // Fetch roles for all users
    const { data: roles } = await supabase.from('user_roles').select('*');

    const usersWithRoles = profiles.map((profile) => ({
      ...profile,
      roles: (roles?.filter((r) => r.user_id === profile.id).map((r) => r.role) as AppRole[]) || [],
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addRole = async (userId: string, role: AppRole) => {
    const { error } = await supabase.from('user_roles').insert({
      user_id: userId,
      role,
    });

    if (error) {
      if (error.code === '23505') {
        toast.info('User already has this role');
      } else {
        toast.error('Failed to add role');
      }
    } else {
      toast.success('Role added successfully');
      fetchUsers();
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) {
      toast.error('Failed to remove role');
    } else {
      toast.success('Role removed successfully');
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'superadmin':
        return 'destructive';
      case 'shop_owner':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <SuperadminLayout title="Manage Users">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users Table */}
        <Card className="glass">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt=""
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-primary font-medium">
                                {user.full_name?.charAt(0) ||
                                  user.email?.charAt(0) ||
                                  '?'}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.full_name || 'No name'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant={getRoleBadgeVariant(role)}
                              className="cursor-pointer"
                              onClick={() => removeRole(user.id, role)}
                            >
                              {role} ×
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
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
                              onClick={() => addRole(user.id, 'superadmin')}
                            >
                              Make Superadmin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => addRole(user.id, 'shop_owner')}
                            >
                              Make Shop Owner
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
