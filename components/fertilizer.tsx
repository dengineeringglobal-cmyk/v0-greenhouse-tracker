'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getCrops, getFields, getFertilizerApplications, createFertilizerApplication } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Leaf } from 'lucide-react';

export function FertilizerPage() {
  const { currentFarm } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [formData, setFormData] = useState({
    fertilizerName: '',
    amount: '',
    type: 'organic' as const,
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
  const records = getFertilizerApplications(selectedCrop, currentFarm.id);

  const handleAddRecord = () => {
    if (!selectedCrop || !selectedField || !formData.fertilizerName || !formData.amount) {
      alert('Please fill all required fields');
      return;
    }

    createFertilizerApplication({
      cropId: selectedCrop,
      fieldId: selectedField,
      farmId: currentFarm.id,
      date: new Date().toISOString().split('T')[0],
      fertilizerId: 'fert_' + Date.now(),
      fertilizerName: formData.fertilizerName,
      amount: parseFloat(formData.amount),
      type: formData.type,
      notes: formData.notes,
    });

    setFormData({
      fertilizerName: '',
      amount: '',
      type: 'organic',
      notes: '',
    });
    setShowForm(false);
  };

  const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);
  const organicCount = records.filter((r) => r.type === 'organic').length;
  const chemicalCount = records.filter((r) => r.type === 'chemical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fertilizer Management</h1>
          <p className="text-muted-foreground mt-1">Track fertilizer applications and manage crop nutrition</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Log Application
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>New Fertilizer Application</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Crop *</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  <label className="text-sm font-medium">Fertilizer Name *</label>
                  <Input
                    value={formData.fertilizerName}
                    onChange={(e) => setFormData({ ...formData, fertilizerName: e.target.value })}
                    placeholder="e.g., NPK 10-10-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Amount (kg) *</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="organic">Organic</option>
                  <option value="chemical">Chemical</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Application details..."
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={2}
                ></textarea>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddRecord} className="bg-green-600 hover:bg-green-700">
                  Log Application
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmount.toFixed(0)} kg</div>
            <p className="text-xs text-muted-foreground mt-1">across {records.length} applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Organic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organicCount}</div>
            <p className="text-xs text-muted-foreground mt-1">organic applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Chemical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chemicalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">chemical applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Application Records</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-left py-2 px-2">Crop</th>
                    <th className="text-left py-2 px-2">Fertilizer</th>
                    <th className="text-left py-2 px-2">Amount</th>
                    <th className="text-left py-2 px-2">Type</th>
                    <th className="text-left py-2 px-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {records
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => {
                      const crop = crops.find((c) => c.id === record.cropId);
                      const typeColor =
                        record.type === 'organic'
                          ? 'bg-green-100 text-green-800'
                          : record.type === 'chemical'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800';
                      return (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="py-2 px-2">{crop?.name}</td>
                          <td className="py-2 px-2">{record.fertilizerName}</td>
                          <td className="py-2 px-2">{record.amount} kg</td>
                          <td className="py-2 px-2">
                            <span className={`px-2 py-1 rounded text-xs ${typeColor}`}>
                              {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                            </span>
                          </td>
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
                <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No fertilizer applications yet</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
