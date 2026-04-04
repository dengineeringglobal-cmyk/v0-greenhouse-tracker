'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getCrops, getFields, getPestControlRecords, createPestControl } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Bug, AlertTriangle } from 'lucide-react';

export function PestControlPage() {
  const { currentFarm } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [formData, setFormData] = useState({
    pestType: '',
    treatmentUsed: '',
    severity: 'medium' as const,
    effectiveness: 'pending' as const,
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
  const records = getPestControlRecords(selectedCrop, currentFarm.id);

  const handleAddRecord = () => {
    if (!selectedCrop || !selectedField || !formData.pestType || !formData.treatmentUsed) {
      alert('Please fill all required fields');
      return;
    }

    createPestControl({
      cropId: selectedCrop,
      fieldId: selectedField,
      farmId: currentFarm.id,
      date: new Date().toISOString().split('T')[0],
      pestType: formData.pestType,
      treatmentUsed: formData.treatmentUsed,
      severity: formData.severity,
      effectiveness: formData.effectiveness,
      notes: formData.notes,
    });

    setFormData({
      pestType: '',
      treatmentUsed: '',
      severity: 'medium',
      effectiveness: 'pending',
      notes: '',
    });
    setShowForm(false);
  };

  const criticalIssues = records.filter((r) => r.severity === 'critical').length;
  const treatedRecords = records.filter((r) => r.effectiveness !== 'pending').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'effective':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'ineffective':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pest Control Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage pest infestations</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Log Treatment
        </Button>
      </div>

      {/* Critical Alert */}
      {criticalIssues > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Critical Pest Issues</h3>
            <p className="text-sm text-red-800">You have {criticalIssues} critical pest infestations that need immediate attention</p>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle>Log Pest Control Treatment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Crop *</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  <label className="text-sm font-medium">Pest Type *</label>
                  <Input
                    value={formData.pestType}
                    onChange={(e) => setFormData({ ...formData, pestType: e.target.value })}
                    placeholder="e.g., Aphids, Mites"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Severity *</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Treatment Used *</label>
                <Input
                  value={formData.treatmentUsed}
                  onChange={(e) => setFormData({ ...formData, treatmentUsed: e.target.value })}
                  placeholder="e.g., Neem oil spray, Pesticide A"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Effectiveness</label>
                <select
                  value={formData.effectiveness}
                  onChange={(e) => setFormData({ ...formData, effectiveness: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="pending">Pending</option>
                  <option value="effective">Effective</option>
                  <option value="partial">Partial</option>
                  <option value="ineffective">Ineffective</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Treatment details..."
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={2}
                ></textarea>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddRecord} className="bg-red-600 hover:bg-red-700">
                  Log Treatment
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
            <CardTitle className="text-sm font-medium">Total Treatments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{treatedRecords} completed evaluations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
            <p className="text-xs text-muted-foreground mt-1">requiring immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment Records</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-left py-2 px-2">Crop</th>
                    <th className="text-left py-2 px-2">Pest</th>
                    <th className="text-left py-2 px-2">Severity</th>
                    <th className="text-left py-2 px-2">Treatment</th>
                    <th className="text-left py-2 px-2">Effectiveness</th>
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
                          <td className="py-2 px-2 font-medium">{record.pestType}</td>
                          <td className="py-2 px-2">
                            <Badge className={getSeverityColor(record.severity)}>
                              {record.severity.charAt(0).toUpperCase() + record.severity.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 text-xs">{record.treatmentUsed}</td>
                          <td className="py-2 px-2">
                            <Badge className={getEffectivenessColor(record.effectiveness)}>
                              {record.effectiveness.charAt(0).toUpperCase() + record.effectiveness.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Bug className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No pest records yet</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
