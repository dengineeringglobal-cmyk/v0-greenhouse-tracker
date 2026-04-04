'use client';

import { useAppContext } from '@/lib/app-context';
import { getCrops, getHarvests, getExpenses, getActivities } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Leaf, Sprout, TrendingUp, Activity, DollarSign, Droplets } from 'lucide-react';

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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <Sprout className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCrops}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently growing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Harvested</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHarvest.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground mt-1">units harvested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground mt-1">all expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Harvest Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Harvest Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyHarvestData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyHarvestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No harvest data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crops Status */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Status</CardTitle>
          </CardHeader>
          <CardContent>
            {cropsStatusData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={cropsStatusData.filter((d) => d.value > 0)} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${entry.value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {cropsStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
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
