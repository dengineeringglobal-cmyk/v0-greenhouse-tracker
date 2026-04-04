'use client';

import { useAppContext } from '@/lib/app-context';
import { getCrops, getHarvests, getExpenses, getActivities, calculateFarmFinancials, getMonthlyFinancials } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, Leaf, Sprout } from 'lucide-react';

export function Dashboard() {
  const { currentFarm } = useAppContext();

  if (!currentFarm) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No farm selected</p>
      </div>
    );
  }

  const crops = getCrops(currentFarm.id);
  const harvests = getHarvests(currentFarm.id);
  const expenses = getExpenses(currentFarm.id);
  const activities = getActivities(currentFarm.id);

  // Calculate metrics
  const activeCrops = crops.filter((c) => c.status === 'growing').length;
  const completedCrops = crops.filter((c) => c.status === 'completed').length;
  const totalHarvest = harvests.reduce((sum, h) => sum + h.quantity, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const recentActivities = activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Financial metrics
  const financials = calculateFarmFinancials(currentFarm.id);
  const monthlyFinancials = getMonthlyFinancials(currentFarm.id);

  // Calculate cost per unit
  const totalHarvestUnits = harvests.reduce((sum, h) => sum + h.quantity, 0);
  const costPerUnit = totalHarvestUnits > 0 ? financials.totalExpenses / totalHarvestUnits : 0;

  // Calculate profit per unit
  const profitPerUnit = totalHarvestUnits > 0 ? financials.netProfit / totalHarvestUnits : 0;

  // Prepare chart data
  const monthlyHarvestData = harvests.reduce(
    (acc, h) => {
      const month = new Date(h.date).toLocaleString('default', { month: 'short' });
      const existing = acc.find((d) => d.month === month);
      if (existing) {
        existing.quantity += h.quantity;
      } else {
        acc.push({ month, quantity: h.quantity });
      }
      return acc;
    },
    [] as { month: string; quantity: number }[]
  );

  const cropsStatusData = [
    { name: 'Growing', value: activeCrops, color: '#22c55e' },
    { name: 'Planning', value: crops.filter((c) => c.status === 'planning').length, color: '#3b82f6' },
    { name: 'Harvesting', value: crops.filter((c) => c.status === 'harvesting').length, color: '#f59e0b' },
    { name: 'Completed', value: completedCrops, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">{currentFarm.name}</p>
      </div>

      {/* Key Metrics - Primary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financials.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalHarvestUnits} units harvested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financials.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">total spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className={`h-4 w-4 ${financials.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${financials.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${financials.netProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">margin: {financials.profitMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <Sprout className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCrops}</div>
            <p className="text-xs text-muted-foreground mt-1">currently growing</p>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics - Advanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Cost Per Unit</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${costPerUnit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">per harvest unit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Profit Per Unit</CardTitle>
            <TrendingUp className={`h-4 w-4 ${profitPerUnit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitPerUnit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profitPerUnit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">net profit per unit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Harvest</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHarvestUnits.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground mt-1">units harvested</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Financial Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Financial Trends</CardTitle>
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

        {/* Expense Breakdown */}
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
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{category}</span>
                          <span className="text-muted-foreground">${amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Harvest & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Harvest Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Harvest Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyHarvestData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyHarvestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No harvest data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crops Status */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {cropsStatusData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={cropsStatusData.filter((d) => d.value > 0)} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${entry.value}`} outerRadius={70} fill="#8884d8" dataKey="value">
                    {cropsStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No crop data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const crop = crops.find((c) => c.id === activity.cropId);
                return (
                  <div key={activity.id} className="flex items-start justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">{crop?.name} - {new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline">{activity.type.replace(/_/g, ' ')}</Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No activities recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
