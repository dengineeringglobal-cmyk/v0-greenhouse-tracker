'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Leaf } from 'lucide-react';

type GreenhouseRecord = {
  id: string;
  greenhouse: string;
  plantingDate: string;
  seedVariety: string;
  plants: string;
  fertilizer: string;
  irrigation: string;
  pest: string;
};

export default function ProductionMonitoring() {
  const [records, setRecords] = useState<GreenhouseRecord[]>([]);
  const [form, setForm] = useState({
    greenhouse: '',
    plantingDate: '',
    seedVariety: '',
    plants: '',
    fertilizer: '',
    irrigation: '',
    pest: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.greenhouse) newErrors.greenhouse = 'Required';
    if (!form.plantingDate) newErrors.plantingDate = 'Required';
    if (!form.seedVariety) newErrors.seedVariety = 'Required';
    if (!form.plants) newErrors.plants = 'Required';
    if (!form.fertilizer) newErrors.fertilizer = 'Required';
    if (!form.irrigation) newErrors.irrigation = 'Required';
    return newErrors;
  };

  const addRecord = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newRecord: GreenhouseRecord = {
      ...form,
      id: Date.now().toString(),
    };

    setRecords([...records, newRecord]);
    setForm({
      greenhouse: '',
      plantingDate: '',
      seedVariety: '',
      plants: '',
      fertilizer: '',
      irrigation: '',
      pest: '',
    });
    setErrors({});
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/80 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="gap-2 border-green-200 text-green-700 hover:bg-green-50">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-8 h-8 text-green-700" />
            <h1 className="text-4xl font-bold text-green-800">Greenhouse Production Monitoring</h1>
          </div>
          <p className="text-green-600 ml-11">Track planting, fertilizer, irrigation, and pest management</p>
        </div>

        {/* Form Card */}
        <Card className="border-green-200 mb-8 shadow-md">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <CardTitle className="text-green-800">Add Production Record</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">Greenhouse Number</label>
                <Input
                  placeholder="e.g., GH-01"
                  value={form.greenhouse}
                  onChange={(e) => setForm({ ...form, greenhouse: e.target.value })}
                  className={errors.greenhouse ? 'border-red-500' : ''}
                />
                {errors.greenhouse && <p className="text-xs text-red-600">{errors.greenhouse}</p>}
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">Planting Date</label>
                <Input
                  type="date"
                  value={form.plantingDate}
                  onChange={(e) => setForm({ ...form, plantingDate: e.target.value })}
                  className={errors.plantingDate ? 'border-red-500' : ''}
                />
                {errors.plantingDate && <p className="text-xs text-red-600">{errors.plantingDate}</p>}
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">Seed Variety</label>
                <Input
                  placeholder="e.g., Bell Pepper Red"
                  value={form.seedVariety}
                  onChange={(e) => setForm({ ...form, seedVariety: e.target.value })}
                  className={errors.seedVariety ? 'border-red-500' : ''}
                />
                {errors.seedVariety && <p className="text-xs text-red-600">{errors.seedVariety}</p>}
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">Number of Plants</label>
                <Input
                  placeholder="e.g., 500"
                  value={form.plants}
                  onChange={(e) => setForm({ ...form, plants: e.target.value })}
                  className={errors.plants ? 'border-red-500' : ''}
                />
                {errors.plants && <p className="text-xs text-red-600">{errors.plants}</p>}
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">Fertilizer Schedule</label>
                <Input
                  placeholder="e.g., Weekly NPK"
                  value={form.fertilizer}
                  onChange={(e) => setForm({ ...form, fertilizer: e.target.value })}
                  className={errors.fertilizer ? 'border-red-500' : ''}
                />
                {errors.fertilizer && <p className="text-xs text-red-600">{errors.fertilizer}</p>}
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">Irrigation Schedule</label>
                <Input
                  placeholder="e.g., Daily 6AM & 4PM"
                  value={form.irrigation}
                  onChange={(e) => setForm({ ...form, irrigation: e.target.value })}
                  className={errors.irrigation ? 'border-red-500' : ''}
                />
                {errors.irrigation && <p className="text-xs text-red-600">{errors.irrigation}</p>}
              </div>

              <div className="md:col-span-2 grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">Pest/Disease Observation (Optional)</label>
                <Input
                  placeholder="e.g., Minor aphid activity"
                  value={form.pest}
                  onChange={(e) => setForm({ ...form, pest: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={addRecord} className="mt-6 w-full bg-green-700 hover:bg-green-800 text-white gap-2">
              <Plus className="w-4 h-4" />
              Save Production Data
            </Button>
          </CardContent>
        </Card>

        {/* Records List */}
        {records.length > 0 && (
          <Card className="border-green-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="text-green-800">Production Records ({records.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                {records.map((record) => (
                  <div key={record.id} className="border border-green-200 rounded-lg p-4 bg-green-50/30 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-green-700 text-white font-mono text-base px-3 py-1">
                        {record.greenhouse}
                      </Badge>
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Seed Variety</p>
                        <p className="text-gray-800">{record.seedVariety}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Planting Date</p>
                        <p className="text-gray-800">{record.plantingDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Plant Count</p>
                        <p className="text-gray-800">{record.plants} plants</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Fertilizer</p>
                        <p className="text-gray-800">{record.fertilizer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Irrigation</p>
                        <p className="text-gray-800">{record.irrigation}</p>
                      </div>
                      {record.pest && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Pest Observation</p>
                          <p className="text-gray-800">{record.pest}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {records.length === 0 && (
          <Card className="border-green-200 shadow-md">
            <CardContent className="pt-12 pb-12 text-center">
              <Leaf className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-gray-600">No production records yet. Add your first greenhouse record above.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
