'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { createFarm, updateFarm, Farm } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Warehouse } from 'lucide-react';

export function FarmsPage() {
  const { currentFarm, farms, refreshFarms, setCurrentFarm } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    totalArea: '',
  });

  const handleAddFarm = () => {
    if (!formData.name || !formData.location || !formData.totalArea) {
      return;
    }

    createFarm({
      name: formData.name,
      location: formData.location,
      totalArea: parseInt(formData.totalArea),
      ownerId: 'admin_001',
    });

    refreshFarms();
    setFormData({ name: '', location: '', totalArea: '' });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Farms</h1>
          <p className="text-muted-foreground mt-1">Manage your farm properties</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Farm
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Farm</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="farm-name">Farm Name</Label>
                <Input
                  id="farm-name"
                  placeholder="e.g., Main Greenhouse Farm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="farm-location">Location</Label>
                <Input
                  id="farm-location"
                  placeholder="e.g., Agricultural District"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="farm-area">Total Area (sq meters)</Label>
                <Input
                  id="farm-area"
                  type="number"
                  placeholder="e.g., 5000"
                  value={formData.totalArea}
                  onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                />
              </div>
              <Button onClick={handleAddFarm} className="w-full">
                Create Farm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {farms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Warehouse className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No farms created yet. Add your first farm to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farms.map((farm) => (
            <Card
              key={farm.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${currentFarm?.id === farm.id ? 'ring-2 ring-green-500' : ''}`}
              onClick={() => setCurrentFarm(farm)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-green-600" />
                  {farm.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{farm.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Area</p>
                  <p className="font-medium">{farm.totalArea} sq meters</p>
                </div>
                <div className="text-xs text-muted-foreground pt-2">
                  Created {new Date(farm.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
