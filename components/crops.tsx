'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getCrops, createCrop, updateCrop, deleteCrop } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Sprout, Trash2 } from 'lucide-react';

export function CropsPage() {
  const { currentFarm } = useAppContext();
  const [crops, setCrops] = useState(() => getCrops(currentFarm?.id));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    plantingDate: '',
    estimatedHarvestDate: '',
    area: '',
    status: 'planning' as const,
    notes: '',
  });

  const handleAddCrop = () => {
    if (!formData.name || !currentFarm) return;

    createCrop({
      farmId: currentFarm.id,
      name: formData.name,
      variety: formData.variety,
      plantingDate: formData.plantingDate,
      estimatedHarvestDate: formData.estimatedHarvestDate,
      area: parseInt(formData.area) || 0,
      status: formData.status,
      notes: formData.notes,
    });

    setCrops(getCrops(currentFarm.id));
    setFormData({
      name: '',
      variety: '',
      plantingDate: '',
      estimatedHarvestDate: '',
      area: '',
      status: 'planning',
      notes: '',
    });
    setIsDialogOpen(false);
  };

  const handleDeleteCrop = (id: string) => {
    deleteCrop(id);
    if (currentFarm) {
      setCrops(getCrops(currentFarm.id));
    }
  };

  const statusColors = {
    planning: 'bg-blue-100 text-blue-800',
    growing: 'bg-green-100 text-green-800',
    harvesting: 'bg-amber-100 text-amber-800',
    completed: 'bg-purple-100 text-purple-800',
  };

  if (!currentFarm) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please select a farm first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crops</h1>
          <p className="text-muted-foreground mt-1">Manage crops in {currentFarm.name}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Crop</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="crop-name">Crop Name</Label>
                <Input
                  id="crop-name"
                  placeholder="e.g., Bell Pepper"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="crop-variety">Variety</Label>
                <Input
                  id="crop-variety"
                  placeholder="e.g., Red Bell Pepper F1"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="planting-date">Planting Date</Label>
                <Input
                  id="planting-date"
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="harvest-date">Est. Harvest Date</Label>
                <Input
                  id="harvest-date"
                  type="date"
                  value={formData.estimatedHarvestDate}
                  onChange={(e) => setFormData({ ...formData, estimatedHarvestDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="crop-area">Area (sq meters)</Label>
                <Input
                  id="crop-area"
                  type="number"
                  placeholder="e.g., 500"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="crop-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="crop-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="growing">Growing</SelectItem>
                    <SelectItem value="harvesting">Harvesting</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="crop-notes">Notes</Label>
                <Input
                  id="crop-notes"
                  placeholder="Any additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleAddCrop} className="col-span-2 w-full">
                Create Crop
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {crops.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sprout className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No crops added yet. Create your first crop to start tracking.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {crops.map((crop) => (
            <Card key={crop.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-green-600" />
                    <div>
                      <CardTitle>{crop.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{crop.variety}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[crop.status]}>{crop.status}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCrop(crop.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Planted</p>
                    <p className="font-medium">{new Date(crop.plantingDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Harvest</p>
                    <p className="font-medium">{new Date(crop.estimatedHarvestDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-medium">{crop.area} sq m</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">
                      {Math.floor(
                        (new Date().getTime() - new Date(crop.plantingDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{' '}
                      days
                    </p>
                  </div>
                </div>
                {crop.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm">{crop.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
