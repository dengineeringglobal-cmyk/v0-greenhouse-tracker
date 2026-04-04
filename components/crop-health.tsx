'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getCrops, getCropHealthRecords, createCropHealth } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Plus, Activity } from 'lucide-react';

export function CropHealthPage() {
  const { currentFarm } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [formData, setFormData] = useState({
    healthStatus: 'good' as const,
    leafColor: '',
    stemStrength: '',
    diseaseIndicators: '',
    notes: '',
  });

  if (!currentFarm) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No farm selected</p>
      </div>
    );
  }

  const crops = getCrops(currentFarm.id);
  const healthRecords = getCropHealthRecords(selectedCrop, currentFarm.id);

  const handleAddHealth = () => {
    if (!selectedCrop || !formData.leafColor || !formData.stemStrength) {
      alert('Please fill all required fields');
      return;
    }

    createCropHealth({
      cropId: selectedCrop,
      farmId: currentFarm.id,
      date: new Date().toISOString().split('T')[0],
      healthStatus: formData.healthStatus,
      leafColor: formData.leafColor,
      stemStrength: formData.stemStrength,
      diseaseIndicators: formData.diseaseIndicators,
      notes: formData.notes,
    });

    setFormData({
      healthStatus: 'good',
      leafColor: '',
      stemStrength: '',
      diseaseIndicators: '',
      notes: '',
    });
    setShowForm(false);
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-emerald-100 text-emerald-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crop Health Monitoring</h1>
          <p className="text-muted-foreground mt-1">Track and monitor the health status of your crops</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Health Record
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>New Health Record</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Crop *</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a crop...</option>
                  {crops.map((crop) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name} ({crop.variety})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Health Status *</label>
                <select
                  value={formData.healthStatus}
                  onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Leaf Color *</label>
                  <Input
                    value={formData.leafColor}
                    onChange={(e) => setFormData({ ...formData, leafColor: e.target.value })}
                    placeholder="e.g., vibrant green"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stem Strength *</label>
                  <Input
                    value={formData.stemStrength}
                    onChange={(e) => setFormData({ ...formData, stemStrength: e.target.value })}
                    placeholder="e.g., strong and upright"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Disease Indicators</label>
                <Input
                  value={formData.diseaseIndicators}
                  onChange={(e) => setFormData({ ...formData, diseaseIndicators: e.target.value })}
                  placeholder="e.g., leaf spots, wilting"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional observations..."
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                ></textarea>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddHealth} className="bg-green-600 hover:bg-green-700">
                  Add Record
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crop Filter */}
      {crops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Filter by Crop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCrop ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCrop('')}
              >
                All Crops
              </Button>
              {crops.map((crop) => (
                <Button
                  key={crop.id}
                  variant={selectedCrop === crop.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCrop(crop.id)}
                >
                  {crop.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {healthRecords.length > 0 ? (
          healthRecords
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((record) => {
              const crop = crops.find((c) => c.id === record.cropId);
              return (
                <Card key={record.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{crop?.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getHealthColor(record.healthStatus)}>
                        {record.healthStatus.charAt(0).toUpperCase() + record.healthStatus.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Leaf Color</p>
                      <p className="text-sm text-muted-foreground">{record.leafColor}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Stem Strength</p>
                      <p className="text-sm text-muted-foreground">{record.stemStrength}</p>
                    </div>
                    {record.diseaseIndicators && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-900 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Disease Indicators
                        </p>
                        <p className="text-sm text-yellow-800 mt-1">{record.diseaseIndicators}</p>
                      </div>
                    )}
                    {record.notes && (
                      <div>
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex items-center justify-center h-40">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No health records yet</p>
                  <p className="text-sm text-muted-foreground">Start by adding a health record for your crops</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
