"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { authNotifications } from '../../../lib/notifications';


export default function UpdatePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we have an access token in the URL (from password reset email)
    const accessToken = searchParams.get('access_token');
    if (!accessToken) {
      router.push('/auth/forgot-password');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      authNotifications.updatePasswordError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      authNotifications.updatePasswordError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setSuccess(true);
      
      // Redirect to sign in after 3 seconds
      authNotifications.updatePasswordSuccess();
      setSuccess(true);
      
      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (error: any) {
      console.error('Password update error:', error);
      authNotifications.updatePasswordError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center">
        <div className="flex flex-col items-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Updated</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your password has been successfully updated. Redirecting to sign in...
              </p>
              <Button onClick={() => router.push('/auth/signin')}>
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center">
      <div className="flex flex-col items-center px-6 py-12">
        <button 
          onClick={() => router.push('/auth/signin')}
          className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to sign in
        </button>
        
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-indigo-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Set a new password</h1>
              <p className="text-gray-600 dark:text-gray-400">Create a new password for your account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                required
              />
              

              
              <Button 
                type="submit" 
                fullWidth
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
