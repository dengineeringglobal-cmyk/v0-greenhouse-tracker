'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getAllUsers, createUser, getFarms } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Users } from 'lucide-react';

export function UsersPage() {
  const { currentFarm } = useAppContext();
  const [users, setUsers] = useState(() => getAllUsers());
  const [farms] = useState(() => getFarms());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    farmId: currentFarm?.id || '',
    role: 'farm_staff' as const,
  });

  const handleAddUser = () => {
    if (!formData.email || !formData.name || !formData.farmId) {
      return;
    }

    createUser({
      email: formData.email,
      name: formData.name,
      farmId: formData.farmId,
      role: formData.role,
    });

    setUsers(getAllUsers());
    setFormData({
      email: '',
      name: '',
      farmId: currentFarm?.id || '',
      role: 'farm_staff',
    });
    setIsDialogOpen(false);
  };

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    farm_staff: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage farm staff and permissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="user-name">Full Name</Label>
                <Input
                  id="user-name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="user-farm">Farm</Label>
                <Select value={formData.farmId} onValueChange={(value) => setFormData({ ...formData, farmId: value })}>
                  <SelectTrigger id="user-farm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((farm) => (
                      <SelectItem key={farm.id} value={farm.id}>
                        {farm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="user-role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="user-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farm_staff">Farm Staff</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} className="w-full">
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No users created yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const userFarm = farms.find((f) => f.id === user.farmId);
            return (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-lg">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Farm: <span className="font-medium">{userFarm?.name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={roleColors[user.role]}>{user.role.replace(/_/g, ' ')}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SettingsPage() {
  const { currentFarm, currentUser } = useAppContext();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your farm system preferences</p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentUser && (
            <>
              <div>
                <Label>Name</Label>
                <p className="mt-1 font-medium">{currentUser.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="mt-1 font-medium">{currentUser.email}</p>
              </div>
              <div>
                <Label>Role</Label>
                <Badge className="mt-2 bg-blue-100 text-blue-800">{currentUser.role.replace(/_/g, ' ')}</Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Farm Information */}
      {currentFarm && (
        <Card>
          <CardHeader>
            <CardTitle>Current Farm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Farm Name</Label>
              <p className="mt-1 font-medium">{currentFarm.name}</p>
            </div>
            <div>
              <Label>Location</Label>
              <p className="mt-1 font-medium">{currentFarm.location}</p>
            </div>
            <div>
              <Label>Total Area</Label>
              <p className="mt-1 font-medium">{currentFarm.totalArea} sq meters</p>
            </div>
            <div>
              <Label>Created</Label>
              <p className="mt-1 font-medium">{new Date(currentFarm.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Data Backups</Label>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Weather Alerts</Label>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="text-muted-foreground">
              Farm Tracker is a comprehensive farm management system designed to help you monitor crops, track harvests, manage expenses, and optimize your agricultural operations.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Version 2.0</p>
            <p className="text-muted-foreground">
              © 2024 Farm Tracker. All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
