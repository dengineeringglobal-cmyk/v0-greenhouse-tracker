'use client'

import * as React from 'react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase' 
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: 'user', 
          farmId: 'farm-1' 
        }
      }
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    alert('Registration successful! You can now log in.')
    router.push('/auth/login')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2">Join the Farm Tracker community</p>
        </div>

        {/* Added autoComplete="off" to the form */}
        <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Full Name" 
              className="pl-10 h-12"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="new-name"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input 
              type="email" 
              placeholder="Email Address" 
              className="pl-10 h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="new-email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input 
              type="password" 
              placeholder="Password" 
              className="pl-10 h-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  )
}