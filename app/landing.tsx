"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './components/ui/Button';
import { ArrowRight, BarChart2, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-16 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
                Launching May 2025
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                Manage your crypto portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">like a pro</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                CryptoNested provides you with powerful tools to track, analyze, and optimize your cryptocurrency investments all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/auth/signup" size="lg">
                  Get started for free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button href="/auth/signin" variant="outline" size="lg">
                  Sign in
                </Button>
              </div>
              
              <div className="pt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Shield className="h-4 w-4 mr-2" />
                <span>No credit card required. Cancel anytime.</span>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                <Image 
                  src="/dashboard-preview.png" 
                  alt="CryptoNested Dashboard"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-3xl -z-10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Powerful tools for crypto investors</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to track, analyze, and optimize your cryptocurrency portfolio.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to start your crypto journey?</h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of investors who are already using CryptoNested.
            </p>
            <Button 
              href="/auth/signup" 
              size="lg" 
              className="bg-white hover:bg-gray-100 text-indigo-600 hover:text-indigo-700"
            >
              Create your free account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              CryptoNested
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              © 2025 CryptoNested. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">About</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Privacy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Terms</Link>
            <Link href="/contact" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: 'Portfolio Tracking',
    description: 'Track your entire crypto portfolio in real-time with accurate data from multiple exchanges.',
    icon: <BarChart2 className="h-6 w-6" />,
  },
  {
    title: 'Market Analytics',
    description: 'Advanced analytics and insights to help you make informed investment decisions.',
    icon: <Zap className="h-6 w-6" />,
  },
  {
    title: 'Bank-level Security',
    description: 'Your data is protected with industry-leading security measures and encryption.',
    icon: <Shield className="h-6 w-6" />,
  },
];
