'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Leaf,
  Sprout,
  Activity,
  TrendingUp,
  Plus,
  Trash2,
  Download,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';
import * as XLSX from 'xlsx';

type Page = 'dashboard' | 'greenhouses' | 'production' | 'harvest' | 'reports';

type Greenhouse = {
  id: string;
  greenhouseNumber: string;
  seedVariety: string;
  plantingDate: string;
  plantCount: string;
  fertilizerSchedule: string;
  irrigationSchedule: string;
  pestObservation: string;
};

type HarvestRecord = {
  id: string;
  date: string;
  greenhouse: string;
  quantity: string;
  grade: string;
  destination: string;
};

export default function BellPepperFarmSystem() {
  const [page, setPage] = useState<Page>('dashboard');
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>([]);

  const [greenhouseForm, setGreenhouseForm] = useState({
    greenhouseNumber: '',
    seedVariety: '',
    plantingDate: '',
    plantCount: '',
    fertilizerSchedule: '',
    irrigationSchedule: '',
    pestObservation: '',
  });

  const [harvestForm, setHarvestForm] = useState({
    date: '',
    greenhouse: '',
    quantity: '',
    grade: '',
    destination: '',
  });

  const [greenhouseErrors, setGreenhouseErrors] = useState<Record<string, string>>({});
  const [harvestErrors, setHarvestErrors] = useState<Record<string, string>>({});

  const validateGreenhouse = () => {
    const errors: Record<string, string> = {};
    if (!greenhouseForm.greenhouseNumber) errors.greenhouseNumber = 'Required';
    if (!greenhouseForm.seedVariety) errors.seedVariety = 'Required';
    if (!greenhouseForm.plantingDate) errors.plantingDate = 'Required';
    if (!greenhouseForm.plantCount) errors.plantCount = 'Required';
    return errors;
  };

  const validateHarvest = () => {
    const errors: Record<string, string> = {};
    if (!harvestForm.date) errors.date = 'Required';
    if (!harvestForm.greenhouse) errors.greenhouse = 'Required';
    if (!harvestForm.quantity) errors.quantity = 'Required';
    if (!harvestForm.grade) errors.grade = 'Required';
    if (!harvestForm.destination) errors.destination = 'Required';
    return errors;
  };

  const addGreenhouse = () => {
    const errors = validateGreenhouse();
    if (Object.keys(errors).length > 0) {
      setGreenhouseErrors(errors);
      return;
    }

    const newGreenhouse: Greenhouse = {
      ...greenhouseForm,
      id: Date.now().toString(),
    };
    setGreenhouses([...greenhouses, newGreenhouse]);
    setGreenhouseForm({
      greenhouseNumber: '',
      seedVariety: '',
      plantingDate: '',
      plantCount: '',
      fertilizerSchedule: '',
      irrigationSchedule: '',
      pestObservation: '',
    });
    setGreenhouseErrors({});
  };

  const addHarvest = () => {
    const errors = validateHarvest();
    if (Object.keys(errors).length > 0) {
      setHarvestErrors(errors);
      return;
    }

    const newHarvest: HarvestRecord = {
      ...harvestForm,
      id: Date.now().toString(),
    };
    setHarvestRecords([...harvestRecords, newHarvest]);
    setHarvestForm({
      date: '',
      greenhouse: '',
      quantity: '',
      grade: '',
      destination: '',
    });
    setHarvestErrors({});
  };

  const deleteGreenhouse = (id: string) => {
    setGreenhouses(greenhouses.filter((g) => g.id !== id));
  };

  const deleteHarvest = (id: string) => {
    setHarvestRecords(harvestRecords.filter((h) => h.id !== id));
  };

  const totalHarvest = harvestRecords.reduce(
    (sum, h) => sum + Number(h.quantity || 0),
    0
  );

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Greenhouses sheet
    const greenhouseData = [
      ['Greenhouse Number', 'Seed Variety', 'Planting Date', 'Plant Count', 'Fertilizer Schedule', 'Irrigation Schedule', 'Pest Observation'],
      ...greenhouses.map((g) => [
        g.greenhouseNumber,
        g.seedVariety,
        g.plantingDate,
        g.plantCount,
        g.fertilizerSchedule,
        g.irrigationSchedule,
        g.pestObservation,
      ]),
    ];
    const greenhouseSheet = XLSX.utils.aoa_to_sheet(greenhouseData);
    greenhouseSheet['!cols'] = [
      { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 24 },
    ];
    XLSX.utils.book_append_sheet(workbook, greenhouseSheet, 'Greenhouses');

    // Harvest sheet
    const harvestData = [
      ['Date', 'Greenhouse', 'Quantity (kg)', 'Grade', 'Destination'],
      ...harvestRecords.map((h) => [h.date, h.greenhouse, h.quantity, h.grade, h.destination]),
      [],
      ['Total Harvest (kg):', '', totalHarvest],
    ];
    const harvestSheet = XLSX.utils.aoa_to_sheet(harvestData);
    harvestSheet['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(workbook, harvestSheet, 'Harvest Records');

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `bell-pepper-farm-${today}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={page} onNavigate={setPage} />

      <main className="flex-1 bg-green-50 p-8 overflow-auto">
        {/* DASHBOARD */}
        {page === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">Farm Dashboard</h2>
            <p className="text-green-600 mb-8">Overview of your bell pepper farm operations</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white border-l-4 border-green-600 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Greenhouses</p>
                      <p className="text-3xl font-bold text-green-700 mt-1">{greenhouses.length}</p>
                    </div>
                    <Leaf className="w-10 h-10 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-l-4 border-red-500 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Harvest</p>
                      <p className="text-3xl font-bold text-red-600 mt-1">{totalHarvest.toLocaleString()} kg</p>
                    </div>
                    <Sprout className="w-10 h-10 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-l-4 border-yellow-400 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Harvest Records</p>
                      <p className="text-3xl font-bold text-yellow-600 mt-1">{harvestRecords.length}</p>
                    </div>
                    <Activity className="w-10 h-10 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-green-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => setPage('greenhouses')} className="bg-green-700 hover:bg-green-800">
                    <Plus className="w-4 h-4 mr-2" /> Add Greenhouse
                  </Button>
                  <Button onClick={() => setPage('harvest')} className="bg-red-600 hover:bg-red-700">
                    <Sprout className="w-4 h-4 mr-2" /> Record Harvest
                  </Button>
                  <Button onClick={() => setPage('reports')} variant="outline" className="border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                    <FileSpreadsheet className="w-4 h-4 mr-2" /> View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* GREENHOUSES PAGE */}
        {page === 'greenhouses' && (
          <div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">Greenhouse Management</h2>
            <p className="text-green-600 mb-8">Add and manage your greenhouse records</p>

            <Card className="bg-white shadow-md mb-8">
              <CardHeader>
                <CardTitle className="text-green-700">Add New Greenhouse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Greenhouse Number</label>
                    <Input
                      placeholder="e.g. GH-01"
                      value={greenhouseForm.greenhouseNumber}
                      onChange={(e) => setGreenhouseForm({ ...greenhouseForm, greenhouseNumber: e.target.value })}
                      className={greenhouseErrors.greenhouseNumber ? 'border-red-500' : ''}
                    />
                    {greenhouseErrors.greenhouseNumber && <p className="text-xs text-red-500 mt-1">{greenhouseErrors.greenhouseNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seed Variety</label>
                    <Input
                      placeholder="e.g. California Wonder"
                      value={greenhouseForm.seedVariety}
                      onChange={(e) => setGreenhouseForm({ ...greenhouseForm, seedVariety: e.target.value })}
                      className={greenhouseErrors.seedVariety ? 'border-red-500' : ''}
                    />
                    {greenhouseErrors.seedVariety && <p className="text-xs text-red-500 mt-1">{greenhouseErrors.seedVariety}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Planting Date</label>
                    <Input
                      type="date"
                      value={greenhouseForm.plantingDate}
                      onChange={(e) => setGreenhouseForm({ ...greenhouseForm, plantingDate: e.target.value })}
                      className={greenhouseErrors.plantingDate ? 'border-red-500' : ''}
                    />
                    {greenhouseErrors.plantingDate && <p className="text-xs text-red-500 mt-1">{greenhouseErrors.plantingDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Plants</label>
                    <Input
                      type="number"
                      placeholder="e.g. 500"
                      value={greenhouseForm.plantCount}
                      onChange={(e) => setGreenhouseForm({ ...greenhouseForm, plantCount: e.target.value })}
                      className={greenhouseErrors.plantCount ? 'border-red-500' : ''}
                    />
                    {greenhouseErrors.plantCount && <p className="text-xs text-red-500 mt-1">{greenhouseErrors.plantCount}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizer Schedule</label>
                    <Input
                      placeholder="e.g. Weekly NPK"
                      value={greenhouseForm.fertilizerSchedule}
                      onChange={(e) => setGreenhouseForm({ ...greenhouseForm, fertilizerSchedule: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Irrigation Schedule</label>
                    <Input
                      placeholder="e.g. Daily 6AM & 4PM"
                      value={greenhouseForm.irrigationSchedule}
                      onChange={(e) => setGreenhouseForm({ ...greenhouseForm, irrigationSchedule: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pest/Disease Observation</label>
                    <Input
                      placeholder="e.g. None observed / Minor aphid activity"
                      value={greenhouseForm.pestObservation}
                      onChange={(e) => setGreenhouseForm({ ...greenhouseForm, pestObservation: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={addGreenhouse} className="bg-green-700 hover:bg-green-800">
                  <Plus className="w-4 h-4 mr-2" /> Add Greenhouse
                </Button>
              </CardContent>
            </Card>

            {/* Greenhouse Table */}
            <Card className="bg-white shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-700">Greenhouse Records</CardTitle>
                <Badge className="bg-green-100 text-green-700">{greenhouses.length} Records</Badge>
              </CardHeader>
              <CardContent>
                {greenhouses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Leaf className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No greenhouses added yet. Add your first greenhouse above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-green-100">
                        <tr>
                          <th className="text-left p-3 font-semibold text-green-800">Greenhouse</th>
                          <th className="text-left p-3 font-semibold text-green-800">Seed Variety</th>
                          <th className="text-left p-3 font-semibold text-green-800">Planting Date</th>
                          <th className="text-right p-3 font-semibold text-green-800">Plants</th>
                          <th className="text-left p-3 font-semibold text-green-800">Fertilizer</th>
                          <th className="text-left p-3 font-semibold text-green-800">Irrigation</th>
                          <th className="text-left p-3 font-semibold text-green-800">Pest Observation</th>
                          <th className="p-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {greenhouses.map((g, i) => (
                          <tr key={g.id} className={i % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                            <td className="p-3 font-medium">{g.greenhouseNumber}</td>
                            <td className="p-3">{g.seedVariety}</td>
                            <td className="p-3">{formatDate(g.plantingDate)}</td>
                            <td className="p-3 text-right">{Number(g.plantCount).toLocaleString()}</td>
                            <td className="p-3">{g.fertilizerSchedule || '-'}</td>
                            <td className="p-3">{g.irrigationSchedule || '-'}</td>
                            <td className="p-3">{g.pestObservation || '-'}</td>
                            <td className="p-3">
                              <button onClick={() => deleteGreenhouse(g.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* PRODUCTION MONITORING PAGE */}
        {page === 'production' && (
          <div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">Production Monitoring</h2>
            <p className="text-green-600 mb-8">Monitor and track greenhouse production details</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white border-l-4 border-green-600 shadow-md">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500">Active Greenhouses</p>
                  <p className="text-2xl font-bold text-green-700">{greenhouses.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-l-4 border-yellow-400 shadow-md">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500">Total Plants</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {greenhouses.reduce((sum, g) => sum + Number(g.plantCount || 0), 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-l-4 border-red-500 shadow-md">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500">Pest Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {greenhouses.filter((g) => g.pestObservation && g.pestObservation.toLowerCase() !== 'none').length}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-l-4 border-green-400 shadow-md">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500">Production Status</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                </CardContent>
              </Card>
            </div>

            {/* Production Overview */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-green-700">Production Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {greenhouses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No production data available. Add greenhouses to see production metrics.</p>
                    <Button onClick={() => setPage('greenhouses')} className="mt-4 bg-green-700 hover:bg-green-800">
                      <Plus className="w-4 h-4 mr-2" /> Add Greenhouse
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {greenhouses.map((g) => (
                      <div key={g.id} className="border rounded-lg p-4 bg-green-50 hover:bg-green-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge className="bg-green-700 text-white mb-2">{g.greenhouseNumber}</Badge>
                            <p className="text-lg font-semibold text-green-800">{g.seedVariety}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Plants</p>
                            <p className="text-xl font-bold text-green-700">{Number(g.plantCount).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-gray-500">Planting Date</p>
                            <p className="font-medium">{formatDate(g.plantingDate)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Fertilizer</p>
                            <p className="font-medium">{g.fertilizerSchedule || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Irrigation</p>
                            <p className="font-medium">{g.irrigationSchedule || '-'}</p>
                          </div>
                        </div>
                        {g.pestObservation && g.pestObservation.toLowerCase() !== 'none' && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-600">
                              <span className="font-semibold">Pest Alert:</span> {g.pestObservation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* HARVEST MONITORING PAGE */}
        {page === 'harvest' && (
          <div>
            <h2 className="text-3xl font-bold text-red-700 mb-2">Harvest Monitoring</h2>
            <p className="text-red-500 mb-8">Record and track your harvest data</p>

            <Card className="bg-white shadow-md mb-8">
              <CardHeader>
                <CardTitle className="text-red-600">Record New Harvest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                    <Input
                      type="date"
                      value={harvestForm.date}
                      onChange={(e) => setHarvestForm({ ...harvestForm, date: e.target.value })}
                      className={harvestErrors.date ? 'border-red-500' : ''}
                    />
                    {harvestErrors.date && <p className="text-xs text-red-500 mt-1">{harvestErrors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Greenhouse</label>
                    <select
                      value={harvestForm.greenhouse}
                      onChange={(e) => setHarvestForm({ ...harvestForm, greenhouse: e.target.value })}
                      className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                        harvestErrors.greenhouse ? 'border-red-500' : 'border-input'
                      }`}
                    >
                      <option value="">Select greenhouse</option>
                      {greenhouses.map((g) => (
                        <option key={g.id} value={g.greenhouseNumber}>
                          {g.greenhouseNumber} - {g.seedVariety}
                        </option>
                      ))}
                    </select>
                    {harvestErrors.greenhouse && <p className="text-xs text-red-500 mt-1">{harvestErrors.greenhouse}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
                    <Input
                      type="number"
                      placeholder="e.g. 500"
                      value={harvestForm.quantity}
                      onChange={(e) => setHarvestForm({ ...harvestForm, quantity: e.target.value })}
                      className={harvestErrors.quantity ? 'border-red-500' : ''}
                    />
                    {harvestErrors.quantity && <p className="text-xs text-red-500 mt-1">{harvestErrors.quantity}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <select
                      value={harvestForm.grade}
                      onChange={(e) => setHarvestForm({ ...harvestForm, grade: e.target.value })}
                      className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                        harvestErrors.grade ? 'border-red-500' : 'border-input'
                      }`}
                    >
                      <option value="">Select grade</option>
                      <option value="A">Grade A (Premium)</option>
                      <option value="B">Grade B (Standard)</option>
                      <option value="C">Grade C (Processing)</option>
                    </select>
                    {harvestErrors.grade && <p className="text-xs text-red-500 mt-1">{harvestErrors.grade}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <select
                      value={harvestForm.destination}
                      onChange={(e) => setHarvestForm({ ...harvestForm, destination: e.target.value })}
                      className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                        harvestErrors.destination ? 'border-red-500' : 'border-input'
                      }`}
                    >
                      <option value="">Select destination</option>
                      <option value="Export">Export</option>
                      <option value="Local Market">Local Market</option>
                      <option value="Processing">Processing</option>
                    </select>
                    {harvestErrors.destination && <p className="text-xs text-red-500 mt-1">{harvestErrors.destination}</p>}
                  </div>
                </div>
                <Button onClick={addHarvest} className="bg-red-600 hover:bg-red-700">
                  <Sprout className="w-4 h-4 mr-2" /> Record Harvest
                </Button>
              </CardContent>
            </Card>

            {/* Harvest Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white border-l-4 border-red-500 shadow-md">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500">Total Harvest</p>
                  <p className="text-2xl font-bold text-red-600">{totalHarvest.toLocaleString()} kg</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-l-4 border-yellow-400 shadow-md">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500">Harvest Records</p>
                  <p className="text-2xl font-bold text-yellow-600">{harvestRecords.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-l-4 border-green-500 shadow-md">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500">Average per Harvest</p>
                  <p className="text-2xl font-bold text-green-600">
                    {harvestRecords.length > 0 ? Math.round(totalHarvest / harvestRecords.length).toLocaleString() : 0} kg
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Harvest Table */}
            <Card className="bg-white shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-red-600">Harvest Records</CardTitle>
                <Badge className="bg-red-100 text-red-600">{harvestRecords.length} Records</Badge>
              </CardHeader>
              <CardContent>
                {harvestRecords.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Sprout className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No harvest records yet. Record your first harvest above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-red-100">
                        <tr>
                          <th className="text-left p-3 font-semibold text-red-800">Date</th>
                          <th className="text-left p-3 font-semibold text-red-800">Greenhouse</th>
                          <th className="text-right p-3 font-semibold text-red-800">Quantity (kg)</th>
                          <th className="text-center p-3 font-semibold text-red-800">Grade</th>
                          <th className="text-left p-3 font-semibold text-red-800">Destination</th>
                          <th className="p-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {harvestRecords.map((h, i) => (
                          <tr key={h.id} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                            <td className="p-3">{formatDate(h.date)}</td>
                            <td className="p-3 font-medium">{h.greenhouse}</td>
                            <td className="p-3 text-right font-semibold">{Number(h.quantity).toLocaleString()}</td>
                            <td className="p-3 text-center">
                              <Badge
                                className={
                                  h.grade === 'A'
                                    ? 'bg-green-100 text-green-700'
                                    : h.grade === 'B'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                }
                              >
                                {h.grade}
                              </Badge>
                            </td>
                            <td className="p-3">{h.destination}</td>
                            <td className="p-3">
                              <button onClick={() => deleteHarvest(h.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-red-200">
                        <tr>
                          <td colSpan={2} className="p-3 font-bold text-red-800">Total</td>
                          <td className="p-3 text-right font-bold text-red-800">{totalHarvest.toLocaleString()} kg</td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* REPORTS PAGE */}
        {page === 'reports' && (
          <div>
            <h2 className="text-3xl font-bold text-yellow-600 mb-2">Farm Reports</h2>
            <p className="text-yellow-500 mb-8">View and export your farm data</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-green-700">Production Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Total Greenhouses</span>
                      <span className="font-bold text-green-700">{greenhouses.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Total Plants</span>
                      <span className="font-bold text-green-700">
                        {greenhouses.reduce((sum, g) => sum + Number(g.plantCount || 0), 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Seed Varieties</span>
                      <span className="font-bold text-green-700">
                        {new Set(greenhouses.map((g) => g.seedVariety)).size}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Pest Observations</span>
                      <span className="font-bold text-red-600">
                        {greenhouses.filter((g) => g.pestObservation && g.pestObservation.toLowerCase() !== 'none').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-red-600">Harvest Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Total Harvest</span>
                      <span className="font-bold text-red-600">{totalHarvest.toLocaleString()} kg</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Harvest Records</span>
                      <span className="font-bold text-red-600">{harvestRecords.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Grade A Harvests</span>
                      <span className="font-bold text-green-600">
                        {harvestRecords.filter((h) => h.grade === 'A').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Avg per Harvest</span>
                      <span className="font-bold text-yellow-600">
                        {harvestRecords.length > 0 ? Math.round(totalHarvest / harvestRecords.length).toLocaleString() : 0} kg
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Export Actions */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-yellow-600">Export Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Export your farm data to Excel or print a summary report.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={exportToExcel} className="bg-green-700 hover:bg-green-800">
                    <Download className="w-4 h-4 mr-2" /> Export to Excel
                  </Button>
                  <Button onClick={handlePrint} variant="outline" className="border-gray-300">
                    <Printer className="w-4 h-4 mr-2" /> Print Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
