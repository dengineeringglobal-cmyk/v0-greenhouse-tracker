'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Sprout } from 'lucide-react';

type HarvestRecord = {
  id: string;
  date: string;
  greenhouse: string;
  quantity: string;
  grade: string;
  destination: string;
};

export default function HarvestMonitoring() {
  const [records, setRecords] = useState<HarvestRecord[]>([]);
  const [form, setForm] = useState({
    date: '',
    greenhouse: '',
    quantity: '',
    grade: '',
    destination: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.date) newErrors.date = 'Required';
    if (!form.greenhouse) newErrors.greenhouse = 'Required';
    if (!form.quantity) newErrors.quantity = 'Required';
    if (!form.grade) newErrors.grade = 'Required';
    if (!form.destination) newErrors.destination = 'Required';
    return newErrors;
  };

  const addRecord = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newRecord: HarvestRecord = {
      ...form,
      id: Date.now().toString(),
    };

    setRecords([...records, newRecord]);
    setForm({
      date: '',
      greenhouse: '',
      quantity: '',
      grade: '',
      destination: '',
    });
    setErrors({});
  };

  const deleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const totalHarvest = records.reduce((sum, r) => sum + Number(r.quantity || 0), 0);

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-600';
      case 'B':
        return 'bg-yellow-600';
      case 'C':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50/80 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sprout className="w-8 h-8 text-red-600" />
            <h1 className="text-4xl font-bold text-red-700">Bell Pepper Harvest Monitoring</h1>
          </div>
          <p className="text-red-600 ml-11">Record harvest dates, quantities, grades, and destinations</p>
        </div>

        {/* Summary Cards */}
        {records.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <p className="text-xs text-red-600 font-medium">Total Harvest</p>
                <p className="text-2xl font-bold text-red-700 mt-1">{totalHarvest.toLocaleString()} kg</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <p className="text-xs text-yellow-700 font-medium">Total Records</p>
                <p className="text-2xl font-bold text-yellow-700 mt-1">{records.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-6">
                <p className="text-xs text-orange-700 font-medium">Avg Quantity</p>
                <p className="text-2xl font-bold text-orange-700 mt-1">
                  {records.length > 0 ? Math.round(totalHarvest / records.length).toLocaleString() : 0} kg
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Form Card */}
        <Card className="border-red-200 mb-8 shadow-md">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
            <CardTitle className="text-red-700">Record Harvest</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}
              </div>

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
                <label className="text-sm font-medium text-gray-700">Quantity Harvested (kg)</label>
                <Input
                  type="number"
                  placeholder="e.g., 150"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className={errors.quantity ? 'border-red-500' : ''}
                />
                {errors.quantity && <p className="text-xs text-red-600">{errors.quantity}</p>}
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">Grade Classification</label>
                <Input
                  placeholder="e.g., A, B, C"
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                  className={errors.grade ? 'border-red-500' : ''}
                />
                {errors.grade && <p className="text-xs text-red-600">{errors.grade}</p>}
              </div>

              <div className="md:col-span-2 grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">Destination</label>
                <Input
                  placeholder="e.g., Local Market, Export, Processor"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  className={errors.destination ? 'border-red-500' : ''}
                />
                {errors.destination && <p className="text-xs text-red-600">{errors.destination}</p>}
              </div>
            </div>

            <Button onClick={addRecord} className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Record Harvest
            </Button>
          </CardContent>
        </Card>

        {/* Records List */}
        {records.length > 0 && (
          <Card className="border-red-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
              <CardTitle className="text-red-700">Harvest Records ({records.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-red-100 border-b-2 border-red-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-red-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-red-900">Greenhouse</th>
                      <th className="text-right py-3 px-4 font-semibold text-red-900">Quantity (kg)</th>
                      <th className="text-center py-3 px-4 font-semibold text-red-900">Grade</th>
                      <th className="text-left py-3 px-4 font-semibold text-red-900">Destination</th>
                      <th className="py-3 px-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr key={record.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-red-50/30'} hover:bg-red-100/30`}>
                        <td className="py-3 px-4 text-gray-800">{record.date}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-red-600 text-white font-mono">{record.greenhouse}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-800">{Number(record.quantity).toLocaleString()}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={`${getGradeBadgeColor(record.grade)} text-white font-bold`}>{record.grade}</Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-800">{record.destination}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => deleteRecord(record.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-red-100 border-t-2 border-red-200 font-bold">
                      <td colSpan={2} className="py-3 px-4 text-red-900">
                        Total Harvest
                      </td>
                      <td className="py-3 px-4 text-right text-red-900">{totalHarvest.toLocaleString()} kg</td>
                      <td colSpan={2} className="py-3 px-4" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {records.length === 0 && (
          <Card className="border-red-200 shadow-md">
            <CardContent className="pt-12 pb-12 text-center">
              <Sprout className="w-12 h-12 text-red-300 mx-auto mb-4" />
              <p className="text-gray-600">No harvest records yet. Add your first harvest record above.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
