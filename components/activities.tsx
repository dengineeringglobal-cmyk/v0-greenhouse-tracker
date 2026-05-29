'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getCrops, getActivities, createActivity } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Activity } from 'lucide-react';

const activityTypes = [
  { value: 'fertilizing', label: 'Fertilizing' },
  { value: 'irrigation', label: 'Irrigation' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'pruning', label: 'Pruning' },
  { value: 'other', label: 'Other' },
];

const activityColors = {
  fertilizing: 'bg-amber-100 text-amber-800',
  irrigation: 'bg-blue-100 text-blue-800',
  pest_control: 'bg-red-100 text-red-800',
  pruning: 'bg-green-100 text-green-800',
  other: 'bg-gray-100 text-gray-800',
};

export function ActivitiesPage() {
  const { currentFarm } = useAppContext();
  const [activities, setActivities] = useState(() => getActivities(currentFarm?.id));
  const [crops] = useState(() => getCrops(currentFarm?.id));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cropId: '',
    type: 'fertilizing' as const,
    date: new Date().toISOString().split('T')[0],
    description: '',
    notes: '',
  });

  const handleAddActivity = () => {
    if (!formData.cropId || !currentFarm) return;

    createActivity({
      cropId: formData.cropId,
      farmId: currentFarm.id,
      type: formData.type as any,
      date: formData.date,
      description: formData.description,
      notes: formData.notes,
    });

    setActivities(getActivities(currentFarm.id));
    setFormData({
      cropId: '',
      type: 'fertilizing',
      date: new Date().toISOString().split('T')[0],
      description: '',
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

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activities</h1>
          <p className="text-muted-foreground mt-1">Track farm operations and crop activities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Log Activity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Farm Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="activity-crop">Crop</Label>
                <Select value={formData.cropId} onValueChange={(value) => setFormData({ ...formData, cropId: value })}>
                  <SelectTrigger id="activity-crop">
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
                <Label htmlFor="activity-type">Activity Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="activity-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="activity-date">Date</Label>
                <Input
                  id="activity-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="activity-description">Description</Label>
                <Input
                  id="activity-description"
                  placeholder="What was done?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="activity-notes">Notes</Label>
                <Input
                  id="activity-notes"
                  placeholder="Additional details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleAddActivity} className="w-full">
                Log Activity
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sortedActivities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No activities logged yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedActivities.map((activity) => {
            const crop = crops.find((c) => c.id === activity.cropId);
            const activityType = activityTypes.find((t) => t.value === activity.type);
            return (
              <Card key={activity.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={activityColors[activity.type as keyof typeof activityColors]}>
                          {activityType?.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-medium mt-2">{activity.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Crop: <span className="font-medium">{crop?.name}</span>
                      </p>
                      {activity.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">{activity.notes}</p>
                      )}
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
