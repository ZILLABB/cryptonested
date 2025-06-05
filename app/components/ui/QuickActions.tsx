"use client";

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Plus, Wallet, LineChart, Settings, Bell } from 'lucide-react';
import Link from 'next/link';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}

function QuickAction({ icon, title, description, href, color }: QuickActionProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-xl p-5 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all duration-300"
    >
      <Link href={href} className="flex items-start">
        <div className={`p-4 rounded-xl ${color} text-white mr-4 shadow-lg`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-base">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export function QuickActions() {
  const actions = [
    {
      icon: <ArrowDownLeft className="h-6 w-6" />,
      title: 'Buy Crypto',
      description: 'Purchase cryptocurrencies with fiat',
      href: '/market/buy',
      color: 'bg-green-500'
    },
    {
      icon: <ArrowUpRight className="h-6 w-6" />,
      title: 'Sell Crypto',
      description: 'Convert your crypto to fiat',
      href: '/market/sell',
      color: 'bg-red-500'
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: 'Swap Tokens',
      description: 'Exchange between cryptocurrencies',
      href: '/market/swap',
      color: 'bg-blue-500'
    },
    {
      icon: <Plus className="h-6 w-6" />,
      title: 'Add Portfolio',
      description: 'Create a new portfolio',
      href: '/portfolio/new',
      color: 'bg-purple-500'
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      title: 'Deposit',
      description: 'Add funds to your account',
      href: '/wallet/deposit',
      color: 'bg-indigo-500'
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: 'Analytics',
      description: 'View detailed performance metrics',
      href: '/analytics',
      color: 'bg-amber-500'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'Settings',
      description: 'Configure your account preferences',
      href: '/settings',
      color: 'bg-gray-500'
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Alerts',
      description: 'Manage price and portfolio alerts',
      href: '/alerts',
      color: 'bg-teal-500'
    }
  ];

  return (
    <motion.div
      className="premium-card p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <h2 className="text-2xl font-semibold mb-8">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {actions.map((action, index) => (
          <QuickAction
            key={index}
            icon={action.icon}
            title={action.title}
            description={action.description}
            href={action.href}
            color={action.color}
          />
        ))}
      </div>
    </motion.div>
  );
}
