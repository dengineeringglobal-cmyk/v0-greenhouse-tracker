'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, TrendingUp, Activity, Sprout, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      label: 'Total Greenhouses',
      value: '12',
      icon: Leaf,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-l-4 border-green-600',
    },
    {
      label: 'Total Harvest',
      value: '15,420 kg',
      icon: Sprout,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-l-4 border-red-500',
    },
    {
      label: 'Active Records',
      value: '48',
      icon: Activity,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-l-4 border-yellow-400',
    },
    {
      label: 'Production Status',
      value: 'Active',
      icon: TrendingUp,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-l-4 border-green-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/80 to-white">
      {/* Header */}
      <header className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-8 h-8 text-green-700" />
            <h1 className="text-4xl font-bold text-green-800">
              Bell Pepper Farm Monitoring Dashboard
            </h1>
          </div>
          <p className="text-green-600 ml-11">
            Monitor your greenhouse production and harvest records
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className={`${stat.bgColor} ${stat.borderColor} shadow-md hover:shadow-lg transition-shadow`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color} opacity-30`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Production Monitoring */}
          <Card className="border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Activity className="w-5 h-5" />
                Greenhouse Production Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                Track greenhouse conditions, planting dates, plant counts, fertilizer schedules, irrigation patterns, and pest observations.
              </p>
              <Link href="/production">
                <Button className="w-full bg-green-700 hover:bg-green-800 text-white">
                  Go to Production Monitoring
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Harvest Monitoring */}
          <Card className="border-red-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Sprout className="w-5 h-5" />
                Bell Pepper Harvest Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                Record harvest dates, quantities, grades, and destinations. Track all harvest activities in one centralized location.
              </p>
              <Link href="/harvest">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Go to Harvest Monitoring
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white border border-green-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-green-800 mb-3">About This Dashboard</h2>
          <p className="text-gray-700 mb-2">
            This comprehensive farm management system helps you monitor bell pepper greenhouse operations efficiently.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Track production metrics across multiple greenhouses</li>
            <li>Record and manage harvest information with grade classifications</li>
            <li>Monitor fertilizer and irrigation schedules</li>
            <li>Track pest and disease observations</li>
            <li>Maintain detailed harvest records with destination tracking</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
