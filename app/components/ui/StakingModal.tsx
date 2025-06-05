"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Clock, Percent, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { StakingPlanWithDetails } from '../../services/stakingService';
import { getTopCryptos, SimpleCryptoCoin } from '../../services/cryptoService';

interface StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStake: (planId: string, coinId: string, amount: number) => Promise<void>;
  selectedPlan?: StakingPlanWithDetails;
}

export function StakingModal({ isOpen, onClose, onStake, selectedPlan }: StakingModalProps) {
  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [availableCoins, setAvailableCoins] = useState<SimpleCryptoCoin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && selectedPlan) {
      loadAvailableCoins();
    }
  }, [isOpen, selectedPlan]);

  const loadAvailableCoins = async () => {
    try {
      const coins = await getTopCryptos(50);
      // Filter coins that are supported by the selected plan
      const supportedCoins = coins.filter(coin => 
        selectedPlan?.supported_coins.includes(coin.id)
      );
      setAvailableCoins(supportedCoins);
    } catch (error) {
      console.error('Error loading coins:', error);
      setError('Failed to load available cryptocurrencies');
    }
  };

  const handleStake = async () => {
    if (!selectedPlan || !selectedCoin || !amount) {
      setError('Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (numAmount < selectedPlan.minimum_amount) {
      setError(`Minimum staking amount is $${selectedPlan.minimum_amount}`);
      return;
    }

    if (selectedPlan.maximum_amount && numAmount > selectedPlan.maximum_amount) {
      setError(`Maximum staking amount is $${selectedPlan.maximum_amount}`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onStake(selectedPlan.id, selectedCoin, numAmount);
      onClose();
      // Reset form
      setSelectedCoin('');
      setAmount('');
    } catch (error: any) {
      setError(error.message || 'Failed to start staking');
    } finally {
      setLoading(false);
    }
  };

  const selectedCoinData = availableCoins.find(coin => coin.id === selectedCoin);
  const estimatedTokens = selectedCoinData && amount ? parseFloat(amount) / selectedCoinData.current_price : 0;
  const projectedAnnualReward = selectedPlan && amount ? (parseFloat(amount) * selectedPlan.apy) / 100 : 0;

  if (!selectedPlan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <motion.div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Modal panel */}
            <motion.div
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Start Staking - {selectedPlan.title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Plan details */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">APY</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{selectedPlan.apy}%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Lock Period</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {selectedPlan.lock_period_days === 0 ? 'Flexible' : `${selectedPlan.lock_period_days} days`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Minimum</span>
                  <span className="text-sm text-gray-900 dark:text-white">${selectedPlan.minimum_amount}</span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Cryptocurrency selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Cryptocurrency
                  </label>
                  <select
                    value={selectedCoin}
                    onChange={(e) => setSelectedCoin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Choose a cryptocurrency</option>
                    {availableCoins.map((coin) => (
                      <option key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol.toUpperCase()}) - ${coin.current_price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (USD)
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Minimum $${selectedPlan.minimum_amount}`}
                    min={selectedPlan.minimum_amount}
                    max={selectedPlan.maximum_amount}
                  />
                  {selectedCoinData && estimatedTokens > 0 && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      ≈ {estimatedTokens.toFixed(6)} {selectedCoinData.symbol.toUpperCase()}
                    </p>
                  )}
                </div>

                {/* Projections */}
                {projectedAnnualReward > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-300">
                        Projected Annual Reward
                      </span>
                    </div>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      ${projectedAnnualReward.toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Based on {selectedPlan.apy}% APY
                    </p>
                  </div>
                )}

                {/* Warning for locked staking */}
                {selectedPlan.lock_period_days > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                          Lock Period Notice
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                          Your funds will be locked for {selectedPlan.lock_period_days} days. 
                          Early withdrawal may incur penalties.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStake}
                  className="flex-1"
                  disabled={loading || !selectedCoin || !amount}
                >
                  {loading ? 'Starting...' : 'Start Staking'}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
