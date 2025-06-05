"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation.js';
import { Input } from '../../components/ui/Input.js';
import { Button } from '../../components/ui/Button.js';
import { ArrowLeft, AtSign, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase.js';
import { authNotifications } from '../../../lib/notifications.js';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        throw error;
      }

      setSubmitted(true);
      authNotifications.resetPasswordSuccess();
    } catch (error: any) {
      console.error('Password reset error:', error);
      authNotifications.resetPasswordError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center">
      <div className="flex flex-col items-center px-6 py-12">
        <Link 
          href="/auth/signin"
          className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to sign in
        </Link>
        
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            {!submitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <img src="/logo.png" alt="CryptoNested Logo" className="h-12 w-auto" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot your password?</h1>
                  <p className="text-gray-600 dark:text-gray-400">Enter your email and we'll send you a link to reset your password</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="name@example.com"
                    icon={<AtSign className="h-5 w-5 text-gray-400" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  
                  <Button 
                    type="submit" 
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send reset link'}
                  </Button>
                  

                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="flex justify-center mb-6">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Didn't receive the email? Check your spam folder or <button 
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    onClick={() => setSubmitted(false)}
                  >
                    try again
                  </button>
                </p>
                <Button 
                  href="/auth/signin"
                  variant="outline"
                >
                  Return to sign in
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
