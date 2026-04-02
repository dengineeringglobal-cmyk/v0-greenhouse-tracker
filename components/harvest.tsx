'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getCrops, getHarvests, createHarvest } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Leaf, Plus } from 'lucide-react';

export function HarvestPage() {
  const { currentFarm } = useAppContext();
  const [harvests, setHarvests] = useState(() => getHarvests(currentFarm?.id));
  const [crops] = useState(() => getCrops(currentFarm?.id));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cropId: '',
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    unit: 'kg',
    grade: 'A',
    destination: '',
    notes: '',
  });

  const handleAddHarvest = () => {
    if (!formData.cropId || !currentFarm || !formData.quantity) return;

    createHarvest({
      cropId: formData.cropId,
      farmId: currentFarm.id,
      date: formData.date,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      grade: formData.grade,
      destination: formData.destination,
      notes: formData.notes,
    });

    setHarvests(getHarvests(currentFarm.id));
    setFormData({
      cropId: '',
      date: new Date().toISOString().split('T')[0],
      quantity: '',
      unit: 'kg',
      grade: 'A',
      destination: '',
      notes: '',
    });
    setIsDialogOpen(false);
  };

  if (!currentFarm) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please select a farm first</p>
      </div>
    );
  }

  const sortedHarvests = [...harvests].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalQuantity = harvests.reduce((sum, h) => sum + h.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Harvest Records</h1>
          <p className="text-muted-foreground mt-1">Track crop harvests and yields</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Record Harvest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Harvest</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="harvest-crop">Crop</Label>
                <Select value={formData.cropId} onValueChange={(value) => setFormData({ ...formData, cropId: value })}>
                  <SelectTrigger id="harvest-crop">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop) => (
                      <SelectItem key={crop.id} value={crop.id}>
                        {crop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="harvest-date">Date</Label>
                <Input
                  id="harvest-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="harvest-quantity">Quantity</Label>
                  <Input
                    id="harvest-quantity"
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="harvest-unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger id="harvest-unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                      <SelectItem value="tons">Metric Tons</SelectItem>
                      <SelectItem value="units">Units/Pieces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="harvest-grade">Grade</Label>
                <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                  <SelectTrigger id="harvest-grade">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grade A (Premium)</SelectItem>
                    <SelectItem value="B">Grade B (Standard)</SelectItem>
                    <SelectItem value="C">Grade C (Fair)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="harvest-destination">Destination</Label>
                <Input
                  id="harvest-destination"
                  placeholder="e.g., Market, Processor, Storage"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="harvest-notes">Notes</Label>
                <Input
                  id="harvest-notes"
                  placeholder="Any additional details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleAddHarvest} className="w-full">
                Record Harvest
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Harvested</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">All harvests combined</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Harvest Records</CardTitle>
            <Leaf className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sortedHarvests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Avg Grade</CardTitle>
            <Leaf className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sortedHarvests.length > 0
                ? sortedHarvests.reduce((sum, h) => sum + (h.grade === 'A' ? 3 : h.grade === 'B' ? 2 : 1), 0) /
                    sortedHarvests.length
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Grade points</p>
          </CardContent>
        </Card>
      </div>

      {sortedHarvests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Leaf className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No harvest records yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedHarvests.map((harvest) => {
            const crop = crops.find((c) => c.id === harvest.cropId);
            return (
              <Card key={harvest.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{crop?.name}</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-medium text-sm">{new Date(harvest.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="font-medium text-sm">
                            {harvest.quantity} {harvest.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Grade</p>
                          <p className="font-medium text-sm">{harvest.grade}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Destination</p>
                          <p className="font-medium text-sm">{harvest.destination}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Notes</p>
                          <p className="font-medium text-sm">{harvest.notes || '-'}</p>
                        </div>
                      </div>
                    </div>
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
