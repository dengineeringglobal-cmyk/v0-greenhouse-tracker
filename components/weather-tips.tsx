'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import { getTips } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudRain, Lightbulb, Droplets, Bug, Leaf, Thermometer } from 'lucide-react';

const categoryIcons = {
  irrigation: Droplets,
  pest_control: Bug,
  fertilizing: Leaf,
  general: Lightbulb,
};

export function WeatherTipsPage() {
  const { currentFarm } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const tips = getTips();

  if (!currentFarm) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please select a farm first</p>
      </div>
    );
  }

  const categories = Array.from(new Set(tips.map((t) => t.category)));
  const filteredTips = selectedCategory ? tips.filter((t) => t.category === selectedCategory) : tips;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Weather & Agricultural Tips</h1>
        <p className="text-muted-foreground mt-1">Learn best practices for your farm</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          All Tips
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            {category.replace(/_/g, ' ')}
          </Badge>
        ))}
      </div>

      {/* Quick Weather Conditions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-blue-500" />
            Current Conditions Reminder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <Thermometer className="h-5 w-5 text-orange-500 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Temperature Range</p>
                <p className="font-medium">20-25°C optimal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Droplets className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity Level</p>
                <p className="font-medium">60-70% ideal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CloudRain className="h-5 w-5 text-slate-500 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Rainfall</p>
                <p className="font-medium">Check local forecast</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Leaf className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Growth Season</p>
                <p className="font-medium">Monitor regularly</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTips.map((tip) => {
          const IconComponent = categoryIcons[tip.category as keyof typeof categoryIcons] || Lightbulb;
          return (
            <Card key={tip.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-green-600" />
                      {tip.title}
                    </CardTitle>
                  </div>
                  <Badge variant="outline">{tip.category.replace(/_/g, ' ')}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground">{tip.content}</p>
                <p className="text-xs text-muted-foreground italic">Source: {tip.source}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Farm Management Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Daily Checklist</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Monitor temperature and humidity levels
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Check crop health and pest presence
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Verify irrigation system functionality
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Record any observations or activities
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Weekly Tasks</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-blue-600">→</span> Review crop progress and compare to schedule
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">→</span> Plan pesticide or fertilizer applications
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">→</span> Inspect greenhouse structure for issues
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">→</span> Update expense and activity records
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
