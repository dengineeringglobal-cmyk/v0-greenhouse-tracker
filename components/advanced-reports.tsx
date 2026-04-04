'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import {
  getCrops,
  getHarvests,
  getExpenses,
  getActivities,
  calculateFarmFinancials,
  getMonthlyFinancials,
  getFields,
} from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from 'recharts';
import { Download, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

export function AdvancedReportsPage() {
  const { currentFarm } = useAppContext();
  const [reportType, setReportType] = useState<'overview' | 'financial' | 'efficiency' | 'predictions'>('overview');

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
  const fields = getFields(currentFarm.id);
  const financials = calculateFarmFinancials(currentFarm.id);
  const monthlyFinancials = getMonthlyFinancials(currentFarm.id);

  const handleExportReport = () => {
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['Advanced Farm Report'],
      ['Farm Name', currentFarm.name],
      ['Report Generated', new Date().toLocaleDateString()],
      [],
      ['Financial Summary'],
      ['Total Revenue', financials.totalRevenue],
      ['Total Expenses', financials.totalExpenses],
      ['Net Profit', financials.netProfit],
      ['Profit Margin %', financials.profitMargin],
      [],
      ['Operations Summary'],
      ['Total Crops', crops.length],
      ['Active Crops', crops.filter((c) => c.status === 'growing').length],
      ['Total Fields', fields.length],
      ['Total Harvested (units)', harvests.reduce((sum, h) => sum + h.quantity, 0)],
      ['Total Activities Logged', activities.length],
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

    // Monthly Financials
    const monthlyData = [
      ['Month', 'Revenue', 'Expenses', 'Profit'],
      ...monthlyFinancials.map((m) => [m.month, m.revenue, m.expenses, m.profit]),
    ];

    const ws2 = XLSX.utils.aoa_to_sheet(monthlyData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Monthly Financials');

    // Crops Details
    const cropsData = [
      ['Crop Name', 'Variety', 'Status', 'Area (m²)', 'Planting Date', 'Est. Harvest Date'],
      ...crops.map((c) => [
        c.name,
        c.variety,
        c.status,
        c.area,
        new Date(c.plantingDate).toLocaleDateString(),
        new Date(c.estimatedHarvestDate).toLocaleDateString(),
      ]),
    ];

    const ws3 = XLSX.utils.aoa_to_sheet(cropsData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Crops');

    // Expense Details
    const expenseData = [
      ['Date', 'Category', 'Description', 'Amount'],
      ...expenses.map((e) => [
        new Date(e.date).toLocaleDateString(),
        e.category,
        e.description,
        e.amount,
      ]),
    ];

    const ws4 = XLSX.utils.aoa_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(wb, ws4, 'Expenses');

    XLSX.writeFile(wb, `${currentFarm.name}-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Crops</p>
            <p className="text-3xl font-bold mt-2">{crops.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Active Crops</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {crops.filter((c) => c.status === 'growing').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Fields</p>
            <p className="text-3xl font-bold mt-2">{fields.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Activities</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{activities.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Harvest Summary by Crop</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {crops
              .filter((c) => getHarvestsForCrop(c.id).length > 0)
              .map((crop) => {
                const cropHarvests = getHarvestsForCrop(crop.id);
                const totalQuantity = cropHarvests.reduce((sum, h) => sum + h.quantity, 0);
                return (
                  <div key={crop.id}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{crop.name}</span>
                      <span className="text-sm text-gray-600">{totalQuantity} units</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (totalQuantity / Math.max(...harvests.map((h) => h.quantity), 1)) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600 mt-2">${financials.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600 mt-2">${financials.totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Net Profit</p>
            <p className={`text-3xl font-bold mt-2 ${financials.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${financials.netProfit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Profit Margin</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{financials.profitMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Financial Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyFinancials.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyFinancials}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No financial data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(financials.expensesByCategory).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(financials.expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = (amount / financials.totalExpenses) * 100;
                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium capitalize">{category}</span>
                        <span className="text-sm text-gray-600">${amount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-muted-foreground">No expense data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderEfficiencyReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Avg Harvest per Crop</p>
            <p className="text-3xl font-bold mt-2">
              {crops.length > 0
                ? (harvests.reduce((sum, h) => sum + h.quantity, 0) / crops.length).toFixed(1)
                : 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Cost per Unit</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              ${
                harvests.length > 0
                  ? (financials.totalExpenses / harvests.reduce((sum, h) => sum + h.quantity, 0)).toFixed(2)
                  : '0.00'
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Harvest Grade A %</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {harvests.length > 0
                ? (
                    ((harvests.filter((h) => h.grade === 'A').length / harvests.length) * 100) as any
                  ).toFixed(1)
                : '0'}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-3">
              {Object.entries(
                activities.reduce(
                  (acc, a) => {
                    acc[a.type] = (acc[a.type] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                )
              )
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium capitalize">{type.replace(/_/g, ' ')}</span>
                      <span className="text-sm text-gray-600">{count} activities</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(count / Math.max(...Object.values(
                            activities.reduce(
                              (acc, a) => {
                                acc[a.type] = (acc[a.type] || 0) + 1;
                                return acc;
                              },
                              {} as Record<string, number>
                            )
                          ))) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No activity data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderPredictionsReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Farm Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {crops.length === 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-900">Add Crops</p>
              <p className="text-sm text-blue-800 mt-1">Start by adding crops to track your farm operations</p>
            </div>
          )}

          {crops.filter((c) => c.status === 'growing').length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-medium text-green-900">Active Growing Season</p>
              <p className="text-sm text-green-800 mt-1">
                {crops.filter((c) => c.status === 'growing').length} crops currently in growth phase
              </p>
            </div>
          )}

          {financials.profitMargin < 20 && financials.profitMargin >= 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-medium text-yellow-900">Optimize Expenses</p>
              <p className="text-sm text-yellow-800 mt-1">
                Your profit margin is {financials.profitMargin.toFixed(1)}%. Consider optimizing operational costs.
              </p>
            </div>
          )}

          {financials.netProfit < 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-medium text-red-900">Profitability Alert</p>
              <p className="text-sm text-red-800 mt-1">
                Current operations are not profitable. Review expenses and increase harvest volumes.
              </p>
            </div>
          )}

          {fields.length > 0 && crops.length > 0 && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="font-medium text-purple-900">Field Utilization</p>
              <p className="text-sm text-purple-800 mt-1">
                {((crops.length / fields.length) * 100).toFixed(1)}% of your fields are in active use
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const getHarvestsForCrop = (cropId: string) => {
    return harvests.filter((h) => h.cropId === cropId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and insights for {currentFarm.name}</p>
        </div>
        <Button onClick={handleExportReport} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-2 flex-wrap">
        {(['overview', 'financial', 'efficiency', 'predictions'] as const).map((type) => (
          <Button
            key={type}
            variant={reportType === type ? 'default' : 'outline'}
            onClick={() => setReportType(type)}
            className={reportType === type ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {/* Report Content */}
      {reportType === 'overview' && renderOverviewReport()}
      {reportType === 'financial' && renderFinancialReport()}
      {reportType === 'efficiency' && renderEfficiencyReport()}
      {reportType === 'predictions' && renderPredictionsReport()}
    </div>
  );
}
