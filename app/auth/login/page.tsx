'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateUser } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Leaf, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = authenticateUser(email, password);
      if (user) {
        router.push('/');
      } else {
        setError('Invalid email or password. Try admin@farm.com / admin123 or staff@farm.com / staff123');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setLoading(true);
    const user = authenticateUser(demoEmail, demoPassword);
    if (user) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Section */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-2xl">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Farm Tracker</h1>
          <p className="text-gray-600">Professional Farm Management System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2">
            <CardTitle>Login to Your Farm</CardTitle>
            <CardDescription>Enter your credentials to access the farm management system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@farm.com"
                  disabled={loading}
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={loading}
                    className="h-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('admin@farm.com', 'admin123')}
                disabled={loading}
                className="w-full h-10"
              >
                Admin Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('staff@farm.com', 'staff123')}
                disabled={loading}
                className="w-full h-10"
              >
                Staff Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Demo Credentials:</h3>
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-medium text-gray-700">Administrator</p>
              <p className="text-gray-600">Email: admin@farm.com</p>
              <p className="text-gray-600">Password: admin123</p>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="font-medium text-gray-700">Farm Staff</p>
              <p className="text-gray-600">Email: staff@farm.com</p>
              <p className="text-gray-600">Password: staff123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
