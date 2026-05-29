'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateUser, registerUser } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Leaf, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const user = authenticateUser(email, password);
      if (user) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/'), 1000);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = registerUser(email, password, name);
      if (result.success) {
        setSuccess('Account created! Redirecting to dashboard...');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setError(result.message);
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
    setError('');
    setSuccess('');
    const user = authenticateUser(demoEmail, demoPassword);
    if (user) {
      setSuccess('Demo login successful! Redirecting...');
      setTimeout(() => router.push('/'), 1000);
    } else {
      setError('Demo login failed. Please try again.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setSuccess('');
  };

  const toggleMode = () => {
    resetForm();
    setIsSignUp(!isSignUp);
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

        {/* Auth Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2">
            <CardTitle>{isSignUp ? 'Create New Account' : 'Login to Your Farm'}</CardTitle>
            <CardDescription>
              {isSignUp ? 'Sign up to start managing your farm' : 'Enter your credentials to access the farm management system'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Success Alert */}
            {success && (
              <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Login Form */}
            {!isSignUp ? (
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

                {/* Demo Credentials */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
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
              </form>
            ) : (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Farmer"
                    disabled={loading}
                    className="h-10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
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
                      placeholder="At least 6 characters"
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
                  <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            )}

            {/* Toggle Sign Up / Login */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                {isSignUp ? 'Already have an account? ' : 'Don&apos;t have an account? '}
                <button
                  type="button"
                  onClick={toggleMode}
                  disabled={loading}
                  className="text-green-600 hover:text-green-700 font-medium underline"
                >
                  {isSignUp ? 'Login' : 'Sign up'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        {!isSignUp && (
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
        )}
      </div>
    </div>
  );
}
