'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getCrops, getFields, getIrrigationRecords, createIrrigationRecord } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Droplets } from 'lucide-react';

export function IrrigationPage() {
  const { currentFarm } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [formData, setFormData] = useState({
    duration: '',
    waterAmount: '',
    method: 'drip' as const,
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
  const fields = getFields(currentFarm.id);
  const records = getIrrigationRecords(selectedCrop, currentFarm.id);

  const handleAddRecord = () => {
    if (!selectedCrop || !selectedField || !formData.duration || !formData.waterAmount) {
      alert('Please fill all required fields');
      return;
    }

    createIrrigationRecord({
      cropId: selectedCrop,
      fieldId: selectedField,
      farmId: currentFarm.id,
      date: new Date().toISOString().split('T')[0],
      duration: parseInt(formData.duration),
      waterAmount: parseFloat(formData.waterAmount),
      method: formData.method,
      notes: formData.notes,
    });

    setFormData({
      duration: '',
      waterAmount: '',
      method: 'drip',
      notes: '',
    });
    setShowForm(false);
  };

  const totalWaterUsed = records.reduce((sum, r) => sum + r.waterAmount, 0);
  const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Irrigation Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor water usage and irrigation schedules</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Log Irrigation
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>New Irrigation Record</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Crop *</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select crop...</option>
                    {crops.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Field *</label>
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select field...</option>
                    {fields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration (minutes) *</label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Water Amount (liters) *</label>
                  <Input
                    type="number"
                    value={formData.waterAmount}
                    onChange={(e) => setFormData({ ...formData, waterAmount: e.target.value })}
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Irrigation Method</label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="drip">Drip Irrigation</option>
                  <option value="sprinkler">Sprinkler</option>
                  <option value="flood">Flood</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observations about irrigation..."
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                ></textarea>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddRecord} className="bg-blue-600 hover:bg-blue-700">
                  Log Irrigation
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Water Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWaterUsed.toFixed(0)} L</div>
            <p className="text-xs text-muted-foreground mt-1">in {records.length} irrigation sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDuration} min</div>
            <p className="text-xs text-muted-foreground mt-1">total irrigation time</p>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Irrigation Records</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-left py-2 px-2">Crop</th>
                    <th className="text-left py-2 px-2">Method</th>
                    <th className="text-left py-2 px-2">Duration</th>
                    <th className="text-left py-2 px-2">Water</th>
                    <th className="text-left py-2 px-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {records
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => {
                      const crop = crops.find((c) => c.id === record.cropId);
                      return (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="py-2 px-2">{crop?.name}</td>
                          <td className="py-2 px-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {record.method}
                            </span>
                          </td>
                          <td className="py-2 px-2">{record.duration} min</td>
                          <td className="py-2 px-2">{record.waterAmount} L</td>
                          <td className="py-2 px-2 text-muted-foreground text-xs">{record.notes || '-'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Droplets className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No irrigation records yet</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
