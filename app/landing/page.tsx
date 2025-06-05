"use client";

import Image from 'next/image';
import DashboardWrapper from '../components/DashboardWrapper';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { ArrowRight, BarChart2, Clock, CreditCard, DollarSign, Lock, Percent, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <DashboardWrapper>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-16 md:pb-32 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-500/20 to-purple-600/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/20 to-fuchsia-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-600 dark:text-indigo-300 text-sm font-medium border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
              <span className="mr-2">🚀</span>
              Launching May 2025 - Early Access Available
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
              The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Crypto Portfolio</span> Platform
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Track, analyze, and optimize your cryptocurrency investments all in one place. Earn up to <span className="font-bold text-indigo-600 dark:text-indigo-400">12% APY</span> by staking your assets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button href="/auth/signup" size="lg" className="text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                Get started for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button href="/auth/signin" variant="outline" size="lg" className="text-base px-8 py-6 rounded-xl border-2">
                Sign in
              </Button>
            </div>

            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              <Shield className="h-4 w-4 mr-2" />
              <span>No credit card required. Cancel anytime.</span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mx-auto max-w-5xl">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 dark:bg-gray-800 flex items-center px-2">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="pt-6">
                <Image
                  src="/dashboard.png"
                  alt="CryptoNested Dashboard"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Glow Effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-3xl -z-10 rounded-2xl"></div>

            {/* Floating Elements */}
            <div className="absolute top-1/4 -left-16 w-32 h-32 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 transform -rotate-6 hidden md:block">
              <div className="h-4 w-16 bg-indigo-200 dark:bg-indigo-700 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-8 w-full bg-green-200 dark:bg-green-700 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-green-700 dark:text-green-300">+12.4%</span>
              </div>
            </div>

            <div className="absolute bottom-1/4 -right-16 w-32 h-32 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 transform rotate-6 hidden md:block">
              <div className="h-4 w-16 bg-purple-200 dark:bg-purple-700 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-8 w-full bg-blue-200 dark:bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300">$34,567</span>
              </div>
            </div>
          </div>

          {/* Trusted By Section */}
          <div className="mt-20 text-center">
            <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6">Trusted by crypto enthusiasts worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src="/logos/bitcoin.svg" alt="Bitcoin" className="h-8" />
              </div>
              <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src="/logos/ethereum.svg" alt="Ethereum" className="h-8" />
              </div>
              <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src="/logos/solana.svg" alt="Solana" className="h-8" />
              </div>
              <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src="/logos/cardano.svg" alt="Cardano" className="h-8" />
              </div>
              <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src="/logos/binance.svg" alt="Binance" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staking Rewards Section */}
      <section id="pricing" className="py-16 md:py-24 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Earn While You HODL</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Stake your crypto assets and earn passive income with our competitive APY rates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {stakingPlans.map((plan, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{plan.title}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{plan.apy}%</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-1">APY</span>
                </div>
                <p className="text-gray-600 dark:text-gray-100">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  {plan.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600 dark:text-gray-100">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  href="/staking"
                  variant={index === 1 ? "primary" : "outline"}
                  className="w-full dark:text-white"
                >
                  Start staking
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-xl bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-700">Compound Your Earnings</h3>
                  <p className="text-gray-600 dark:text-gray-700">Reinvest your staking rewards automatically to maximize your returns over time.</p>
                </div>
              </div>
              <Button href="/auth/signup" variant="outline" className=" text-gray-900 dark:text-gray-700">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-6 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-indigo-500/10 to-purple-600/10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl transform -translate-x-1/3 -translate-y-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
              <span className="mr-2">✨</span>
              Advanced Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Powerful tools for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">crypto investors</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to track, analyze, and optimize your cryptocurrency portfolio in one intuitive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 hover:shadow-xl transition-all duration-300 group hover:border-indigo-200 dark:hover:border-indigo-800/50"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Feature Highlight */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12 lg:p-16">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-sm font-medium mb-4">
                  <span className="mr-2">📊</span>
                  Real-time Analytics
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">Advanced Portfolio Analytics</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Get detailed insights into your portfolio performance with advanced analytics tools. Track your gains, losses, and overall performance over time.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">Real-time price updates and portfolio valuation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">Performance metrics and historical data analysis</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">Customizable dashboards and reporting tools</span>
                  </li>
                </ul>
                <Button href="/auth/signup" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white">
                  Explore Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 md:p-0 relative">
                <div className="relative z-10 transform md:scale-110 md:translate-x-12">
                  <Image
                    src="/dashboard.png"
                    alt="Analytics Dashboard"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-xl shadow-2xl"
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 px-6 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/10 to-purple-600/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
              <span className="mr-2">🚀</span>
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Staking Works</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start earning passive income with your crypto in just three simple steps.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-indigo-500/20 z-0"></div>

            <div className="grid md:grid-cols-3 gap-12 md:gap-16 relative z-10">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative group">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl font-bold mb-8 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{step.title}</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>

                  {/* Step Icon */}
                  {index === 0 && (
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full hidden md:flex items-center justify-center text-green-600 dark:text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  )}

                  {index === 1 && (
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full hidden md:flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  )}

                  {index === 2 && (
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full hidden md:flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Card */}
          <div className="mt-20 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 shadow-lg border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ready to start earning?</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">Create your account in minutes and begin your crypto staking journey.</p>
              </div>
              <Button href="/staking" size="lg" className="whitespace-nowrap bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8">
                Start Staking Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 px-6 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-indigo-500/5 to-purple-600/5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/5 to-cyan-400/5 rounded-full blur-3xl transform -translate-x-1/3 -translate-y-1/3"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
              <span className="mr-2">❓</span>
              Got Questions?
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about staking and investing with CryptoNested.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-800/50 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mt-1 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/30 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Help */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">Still have questions? We're here to help.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Read Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 px-6 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/5 to-purple-600/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 to-cyan-400/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-4">
              <span className="mr-2">👋</span>
              About Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              We're on a mission to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">simplify crypto</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              CryptoNested was founded by a team of crypto enthusiasts who believe that cryptocurrency should be accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-8">
                <Image
                  src="/dashboard.png"
                  alt="Our Team"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">50K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">$2M+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Assets Managed</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">20+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h3>
              <div className="space-y-6 text-gray-600 dark:text-gray-300">
                <p>
                  Founded in 2023, CryptoNested began with a simple idea: make cryptocurrency portfolio management accessible, intuitive, and powerful for everyone from beginners to experts.
                </p>
                <p>
                  Our team combines expertise in blockchain technology, financial analysis, and user experience design to create a platform that simplifies the complex world of cryptocurrency investing.
                </p>
                <p>
                  We believe that financial freedom should be accessible to everyone, and our mission is to provide the tools and knowledge needed to navigate the exciting but often challenging crypto landscape.
                </p>
                <div className="pt-4">
                  <Button href="/about" variant="outline" className="flex items-center gap-2">
                    Learn more about our team
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-violet-600/10"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-500/20 to-purple-600/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

            <div className="relative grid md:grid-cols-5 items-center">
              <div className="md:col-span-3 px-8 py-16 md:p-16">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-white mr-2 animate-pulse"></span>
                  Limited Time Offer
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                  Start earning up to <span className="text-yellow-300">12% APY</span> on your crypto today
                </h2>
                <p className="text-xl text-indigo-100 mb-8 md:pr-12">
                  Join thousands of investors who are already growing their wealth with CryptoNested's secure staking platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    href="/auth/signup"
                    size="lg"
                    className="bg-white hover:bg-gray-100 text-indigo-600 hover:text-indigo-700 px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Create your free account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    href="/auth/signin"
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-medium"
                  >
                    Sign in
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-10 flex items-center gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span>Bank-level security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>5-minute setup</span>
                  </div>
                </div>
              </div>

              {/* Image/Illustration */}
              <div className="hidden md:block md:col-span-2 h-full">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-indigo-600/90 z-10"></div>
                  <Image
                    src="/dashboard.png"
                    alt="Crypto Investing"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-12 px-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center">
                <img src="/logo.png" alt="CryptoNested Logo" className="h-12 w-auto mr-3" />
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  CryptoNested
                </span>
              </Link>
              <p className="text-gray-600 dark:text-gray-300 mt-4 mb-6 max-w-md">
                The most comprehensive cryptocurrency portfolio management platform. Track, analyze, and optimize your investments all in one place.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Dashboard</Link>
                </li>
                <li>
                  <Link href="/portfolio" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Portfolio</Link>
                </li>
                <li>
                  <Link href="/market" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Market</Link>
                </li>
                <li>
                  <Link href="/news" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">News</Link>
                </li>
                <li>
                  <Link href="/profile" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Profile</Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">About Us</Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Careers</Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Blog</Link>
                </li>
                <li>
                  <Link href="/press" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Press</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Cookie Policy</Link>
                </li>
                <li>
                  <Link href="/security" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Security</Link>
                </li>
                <li>
                  <Link href="/compliance" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Compliance</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              &copy; 2025 CryptoNested. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Language:</span>
                <select className="text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Currency:</span>
                <select className="text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="gbp">GBP</option>
                  <option value="jpy">JPY</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </footer>
        {/* Scroll to Top Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <a
            href="#"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </a>
        </div>
      </div>
    </DashboardWrapper>
  );
}

const stakingPlans = [
  {
    title: 'Flexible Staking',
    apy: 4,
    description: 'Stake your crypto with no lock-up period and withdraw anytime.',
    icon: <CreditCard className="h-6 w-6" />,
    benefits: [
      'No minimum staking period',
      'Withdraw anytime',
      'Weekly rewards distribution',
      'Support for 15+ cryptocurrencies'
    ]
  },
  {
    title: 'Standard Staking',
    apy: 8,
    description: 'Lock your assets for 3 months and earn higher returns.',
    icon: <Percent className="h-6 w-6" />,
    benefits: [
      '3-month lock-up period',
      'Higher APY than flexible staking',
      'Daily rewards distribution',
      'Support for 20+ cryptocurrencies'
    ]
  },
  {
    title: 'Premium Staking',
    apy: 12,
    description: 'Maximum returns when you lock your assets for 12 months.',
    icon: <Lock className="h-6 w-6" />,
    benefits: [
      '12-month lock-up period',
      'Highest possible APY',
      'Daily rewards distribution',
      'Priority customer support'
    ]
  },
];

const howItWorks = [
  {
    title: 'Deposit Crypto',
    description: 'Transfer your crypto assets to your CryptoNested wallet from any exchange or wallet.'
  },
  {
    title: 'Choose a Staking Plan',
    description: 'Select from our flexible, standard, or premium staking plans based on your investment goals.'
  },
  {
    title: 'Earn Rewards',
    description: 'Start earning passive income immediately with rewards distributed daily or weekly.'
  }
];

const faqs = [
  {
    question: 'What is crypto staking?',
    answer: 'Crypto staking is a process where you lock up your cryptocurrency holdings to support the operations of a blockchain network and earn rewards in return.'
  },
  {
    question: 'How are staking rewards calculated?',
    answer: 'Staking rewards are calculated based on the amount staked, the duration of staking, and the APY rate of the selected plan. The longer you stake and the more you stake, the higher your rewards.'
  },
  {
    question: 'Is there a minimum amount required to stake?',
    answer: 'Yes, the minimum staking amount varies by cryptocurrency. For most major cryptocurrencies like Bitcoin and Ethereum, the minimum is equivalent to $100 USD.'
  },
  {
    question: 'Can I withdraw my staked assets before the lock-up period ends?',
    answer: 'For Flexible Staking, you can withdraw anytime. For Standard and Premium plans, early withdrawal is possible but will incur a fee and you may lose a portion of your accrued rewards.'
  },
  {
    question: 'Which cryptocurrencies can I stake?',
    answer: 'We support staking for major cryptocurrencies including Bitcoin, Ethereum, Cardano, Solana, Polkadot, and many more. The full list is available in your dashboard after signing up.'
  }
];

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
