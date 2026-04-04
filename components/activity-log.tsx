'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getActivityLogs } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Filter, Clock } from 'lucide-react';

export function ActivityLogPage() {
  const { currentFarm, isAdmin } = useAppContext();
  const [filterUser, setFilterUser] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  if (!currentFarm) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No farm selected</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Activity logs are only available to administrators</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allLogs = getActivityLogs(currentFarm.id);

  // Filter logs
  const filteredLogs = allLogs.filter((log) => {
    if (filterUser && log.userId !== filterUser) return false;
    if (filterAction && log.action !== filterAction) return false;
    if (filterModule && log.module !== filterModule) return false;
    if (searchTerm && !log.recordName?.toLowerCase().includes(searchTerm.toLowerCase()) && !log.userName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Get unique values for filters
  const uniqueUsers = Array.from(new Set(allLogs.map((l) => l.userId)));
  const uniqueActions = Array.from(new Set(allLogs.map((l) => l.action)));
  const uniqueModules = Array.from(new Set(allLogs.map((l) => l.module)));

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Module', 'Record', 'Details'];
    const rows = filteredLogs.map((log) => [
      new Date(log.timestamp).toLocaleString(),
      log.userName,
      log.action,
      log.module,
      log.recordName || '-',
      log.details || '-',
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'LOGIN':
        return 'bg-purple-100 text-purple-800';
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'crop':
        return 'bg-green-50 text-green-900';
      case 'harvest':
        return 'bg-yellow-50 text-yellow-900';
      case 'expense':
        return 'bg-blue-50 text-blue-900';
      case 'field':
        return 'bg-amber-50 text-amber-900';
      case 'auth':
        return 'bg-purple-50 text-purple-900';
      default:
        return 'bg-gray-50 text-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-muted-foreground mt-1">Track all system activities and user actions</p>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={handleExportCSV} className="gap-2 bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Search</label>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user, record name..."
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">User</label>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Users</option>
                {uniqueUsers.map((userId) => {
                  const userName = allLogs.find((l) => l.userId === userId)?.userName;
                  return (
                    <option key={userId} value={userId}>
                      {userName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Action</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Actions</option>
                {uniqueActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Module</label>
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Modules</option>
                {uniqueModules.map((module) => (
                  <option key={module} value={module}>
                    {module.charAt(0).toUpperCase() + module.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setFilterUser('');
                setFilterAction('');
                setFilterModule('');
                setSearchTerm('');
              }}
              variant="outline"
              size="sm"
            >
              Clear Filters
            </Button>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Showing {filteredLogs.length} of {allLogs.length} logs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Timestamp</th>
                    <th className="text-left py-2 px-3">User</th>
                    <th className="text-left py-2 px-3">Action</th>
                    <th className="text-left py-2 px-3">Module</th>
                    <th className="text-left py-2 px-3">Record</th>
                    <th className="text-left py-2 px-3">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-2 px-3 font-medium">{log.userName}</td>
                        <td className="py-2 px-3">
                          <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded text-xs ${getModuleColor(log.module)}`}>
                            {log.module.charAt(0).toUpperCase() + log.module.slice(1)}
                          </span>
                        </td>
                        <td className="py-2 px-3">{log.recordName || '-'}</td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">{log.details || '-'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No activity logs found</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
