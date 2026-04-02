'use client';

import { useRef } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getCrops, getHarvests, getExpenses, getActivities } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Printer } from 'lucide-react';
import * as XLSX from 'xlsx';

export function ReportsPage() {
  const { currentFarm } = useAppContext();
  const reportRef = useRef<HTMLDivElement>(null);

  if (!currentFarm) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please select a farm first</p>
      </div>
    );
  }

  const crops = getCrops(currentFarm.id);
  const harvests = getHarvests(currentFarm.id);
  const expenses = getExpenses(currentFarm.id);
  const activities = getActivities(currentFarm.id);

  // Prepare data for charts
  const monthlyHarvestData = harvests.reduce(
    (acc, h) => {
      const month = new Date(h.date).toLocaleString('default', { month: 'short' });
      const existing = acc.find((d) => d.month === month);
      if (existing) {
        existing.harvest += h.quantity;
      } else {
        acc.push({ month, harvest: h.quantity });
      }
      return acc;
    },
    [] as { month: string; harvest: number }[]
  );

  const monthlyExpensesData = expenses.reduce(
    (acc, e) => {
      const month = new Date(e.date).toLocaleString('default', { month: 'short' });
      const existing = acc.find((d) => d.month === month);
      if (existing) {
        existing.expenses += e.amount;
      } else {
        acc.push({ month, expenses: e.amount });
      }
      return acc;
    },
    [] as { month: string; expenses: number }[]
  );

  const cropStatusData = [
    { name: 'Growing', value: crops.filter((c) => c.status === 'growing').length },
    { name: 'Planning', value: crops.filter((c) => c.status === 'planning').length },
    { name: 'Harvesting', value: crops.filter((c) => c.status === 'harvesting').length },
    { name: 'Completed', value: crops.filter((c) => c.status === 'completed').length },
  ].filter((d) => d.value > 0);

  const expensesByCategory = expenses.reduce(
    (acc, e) => {
      const existing = acc.find((d) => d.category === e.category);
      if (existing) {
        existing.amount += e.amount;
      } else {
        acc.push({ category: e.category, amount: e.amount });
      }
      return acc;
    },
    [] as { category: string; amount: number }[]
  );

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

  // Export to Excel
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Create summary sheet
    const summaryData = [
      ['Farm Report', currentFarm.name],
      ['Report Date', new Date().toLocaleDateString()],
      [],
      ['Summary Metrics'],
      ['Total Crops', crops.length],
      ['Active Crops', crops.filter((c) => c.status === 'growing').length],
      ['Total Harvested', harvests.reduce((sum, h) => sum + h.quantity, 0)],
      ['Total Expenses', `$${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}`],
      ['Total Activities', activities.length],
    ];

    const cropsData = [
      ['Crops'],
      ['Name', 'Variety', 'Status', 'Area (sq m)', 'Planted', 'Est. Harvest'],
      ...crops.map((c) => [c.name, c.variety, c.status, c.area, new Date(c.plantingDate).toLocaleDateString(), new Date(c.estimatedHarvestDate).toLocaleDateString()]),
    ];

    const harvestsData = [
      ['Harvest Records'],
      ['Date', 'Crop', 'Quantity', 'Unit', 'Grade', 'Destination'],
      ...harvests.map((h) => {
        const crop = crops.find((c) => c.id === h.cropId);
        return [new Date(h.date).toLocaleDateString(), crop?.name, h.quantity, h.unit, h.grade, h.destination];
      }),
    ];

    const expensesData = [
      ['Expenses'],
      ['Date', 'Category', 'Amount', 'Description'],
      ...expenses.map((e) => [new Date(e.date).toLocaleDateString(), e.category, `$${e.amount.toFixed(2)}`, e.description]),
    ];

    XLSX.utils.sheet_add_aoa(wb.Sheets['Summary'] || XLSX.utils.aoa_to_sheet(summaryData), summaryData);
    wb.SheetNames.push('Summary');
    wb.Sheets['Summary'] = XLSX.utils.aoa_to_sheet(summaryData);
    wb.Sheets['Crops'] = XLSX.utils.aoa_to_sheet(cropsData);
    wb.Sheets['Harvest'] = XLSX.utils.aoa_to_sheet(harvestsData);
    wb.Sheets['Expenses'] = XLSX.utils.aoa_to_sheet(expensesData);
    wb.SheetNames = ['Summary', 'Crops', 'Harvest', 'Expenses'];

    XLSX.writeFile(wb, `farm-report-${currentFarm.name}-${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" ref={reportRef}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Farm Reports</h1>
          <p className="text-muted-foreground mt-1">{currentFarm.name} - {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportExcel} className="gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Crops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crops.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crops.filter((c) => c.status === 'growing').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Harvested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{harvests.reduce((sum, h) => sum + h.quantity, 0).toFixed(0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Harvest Trend */}
        {monthlyHarvestData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Harvest Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyHarvestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="harvest" stroke="#22c55e" name="Harvest (units)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Expense Trend */}
        {monthlyExpensesData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyExpensesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expenses" fill="#f59e0b" name="Expenses ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Crop Status */}
        {cropStatusData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Crop Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={cropStatusData} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${entry.value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {cropStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Expenses by Category */}
        {expensesByCategory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expensesByCategory.sort((a, b) => b.amount - a.amount).slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#f59e0b" name="Amount ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Tables */}
      <div className="space-y-4">
        {/* Crops Table */}
        <Card>
          <CardHeader>
            <CardTitle>Crops Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {crops.length === 0 ? (
              <p className="text-muted-foreground">No crops recorded</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-2 font-semibold">Crop</th>
                      <th className="text-left py-2 px-2 font-semibold">Variety</th>
                      <th className="text-left py-2 px-2 font-semibold">Status</th>
                      <th className="text-left py-2 px-2 font-semibold">Area (sq m)</th>
                      <th className="text-left py-2 px-2 font-semibold">Planted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crops.map((crop) => (
                      <tr key={crop.id} className="border-b">
                        <td className="py-2 px-2">{crop.name}</td>
                        <td className="py-2 px-2">{crop.variety}</td>
                        <td className="py-2 px-2 capitalize">{crop.status}</td>
                        <td className="py-2 px-2">{crop.area}</td>
                        <td className="py-2 px-2">{new Date(crop.plantingDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Harvests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Harvests</CardTitle>
          </CardHeader>
          <CardContent>
            {harvests.length === 0 ? (
              <p className="text-muted-foreground">No harvests recorded</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-2 font-semibold">Date</th>
                      <th className="text-left py-2 px-2 font-semibold">Crop</th>
                      <th className="text-left py-2 px-2 font-semibold">Quantity</th>
                      <th className="text-left py-2 px-2 font-semibold">Grade</th>
                      <th className="text-left py-2 px-2 font-semibold">Destination</th>
                    </tr>
                  </thead>
                  <tbody>
                    {harvests.slice(0, 10).map((harvest) => {
                      const crop = crops.find((c) => c.id === harvest.cropId);
                      return (
                        <tr key={harvest.id} className="border-b">
                          <td className="py-2 px-2">{new Date(harvest.date).toLocaleDateString()}</td>
                          <td className="py-2 px-2">{crop?.name}</td>
                          <td className="py-2 px-2">
                            {harvest.quantity} {harvest.unit}
                          </td>
                          <td className="py-2 px-2">{harvest.grade}</td>
                          <td className="py-2 px-2">{harvest.destination}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
