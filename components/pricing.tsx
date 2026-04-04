'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Target, Crown } from 'lucide-react';

export function PricingPage() {
  const plans = [
    {
      name: 'Basic',
      price: '₦5,000',
      period: '/month',
      description: 'Perfect for small farms just getting started',
      icon: Target,
      features: [
        'Up to 5 crops',
        'Up to 3 fields',
        'Basic harvest tracking',
        'Expense management',
        'Monthly activity logs',
        'Email support',
      ],
      excluded: [
        'Crop health monitoring',
        'Irrigation tracking',
        'Fertilizer management',
        'Pest control monitoring',
        'Weather API integration',
        'Advanced analytics',
      ],
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '₦10,000',
      period: '/month',
      description: 'Ideal for established farms wanting advanced features',
      icon: Zap,
      features: [
        'Unlimited crops',
        'Unlimited fields',
        'Full harvest tracking',
        'Advanced expense management',
        'Complete activity logs',
        'Crop health monitoring',
        'Irrigation tracking',
        'Fertilizer management',
        'Pest control tracking',
        'Priority email support',
        'Monthly financial reports',
      ],
      excluded: [
        'Weather API integration',
        'Advanced predictive analytics',
        'Dedicated account manager',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '₦20,000',
      period: '/month',
      description: 'For large-scale commercial operations',
      icon: Crown,
      features: [
        'Everything in Professional',
        'Weather monitoring API',
        'Advanced predictive analytics',
        'Custom integrations',
        'Multi-farm management',
        'Dedicated account manager',
        'Priority 24/7 phone support',
        'Custom reports & exports',
        'API access',
        'Quarterly farm optimization reviews',
        'Advanced data insights',
      ],
      excluded: [],
      highlighted: false,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your farm. All plans include core features with flexible upgrades.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div key={plan.name} className={`relative ${plan.highlighted ? 'md:scale-105' : ''}`}>
              {plan.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-green-600 text-white">MOST POPULAR</Badge>
                </div>
              )}

              <Card className={`h-full flex flex-col ${plan.highlighted ? 'border-green-200 shadow-lg' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-6 w-6 ${plan.highlighted ? 'text-green-600' : 'text-blue-600'}`} />
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>

                  <Button
                    className={`w-full mt-6 ${
                      plan.highlighted
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Get Started
                  </Button>
                </CardHeader>

                <CardContent className="flex-1 space-y-6">
                  {/* Included Features */}
                  <div className="space-y-3">
                    <p className="font-semibold text-sm">What&apos;s included:</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Excluded Features */}
                  {plan.excluded.length > 0 && (
                    <div className="space-y-3 pt-6 border-t">
                      <p className="font-semibold text-sm text-muted-foreground">Not included:</p>
                      <ul className="space-y-2">
                        {plan.excluded.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 opacity-60">
                            <span className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5">—</span>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Do you offer a free trial?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes, we offer a 14-day free trial for all plans. No credit card required to get started.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We accept all major credit cards, bank transfers, and popular mobile payment methods.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is there a discount for annual billing?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! Save 20% when you pay annually. Contact our sales team for custom pricing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What about data security?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All data is encrypted at rest and in transit. We perform regular security audits and backups daily.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Do you offer custom plans?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! For enterprise customers with specific requirements, we offer custom plans and integrations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to grow your farm?</h2>
        <p className="text-lg opacity-90">Start with a free 14-day trial. No credit card required.</p>
        <Button className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6">
          Start Free Trial
        </Button>
      </div>
    </div>
  );
}
