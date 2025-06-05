"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { updateHolding, deleteHolding, addTransaction } from '../../services/portfolioService';
import { useAuth } from '../../../contexts/AuthContext';

interface Holding {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  price: number;
  value: number;
  averageBuyPrice: number;
  totalCost: number;
  profit: number;
  profitPercentage: number;
  change24h: number;
  allocation: number;
  image?: string;
}

interface EditHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  holding: Holding | null;
  onHoldingUpdated?: () => void;
  onHoldingDeleted?: () => void;
}

export function EditHoldingModal({ 
  isOpen, 
  onClose, 
  holding, 
  onHoldingUpdated, 
  onHoldingDeleted 
}: EditHoldingModalProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<'edit' | 'delete'>('edit');
  const [submitting, setSubmitting] = useState(false);
  
  // Form states
  const [quantity, setQuantity] = useState('');
  const [averagePrice, setAveragePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');

  // Initialize form when holding changes
  useEffect(() => {
    if (holding) {
      setQuantity(holding.quantity.toString());
      setAveragePrice(holding.averageBuyPrice.toString());
      setPurchaseDate(new Date().toISOString().split('T')[0]); // Default to today
      setMode('edit');
    }
  }, [holding]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMode('edit');
      setQuantity('');
      setAveragePrice('');
      setPurchaseDate('');
    }
  }, [isOpen]);

  const handleUpdateHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holding || !user) return;

    try {
      setSubmitting(true);

      const quantityNum = parseFloat(quantity);
      const priceNum = parseFloat(averagePrice);

      if (isNaN(quantityNum) || isNaN(priceNum) || quantityNum <= 0 || priceNum <= 0) {
        alert('Please enter valid quantity and price values');
        return;
      }

      // Update the holding
      const result = await updateHolding(
        holding.id,
        quantityNum,
        priceNum,
        purchaseDate
      );

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update holding');
      }

      // Create a transaction record for the adjustment
      const quantityDiff = quantityNum - holding.quantity;
      if (quantityDiff !== 0) {
        await addTransaction(
          user.id,
          quantityDiff > 0 ? 'buy' : 'sell',
          holding.symbol.toLowerCase(),
          Math.abs(quantityDiff),
          priceNum,
          0,
          `Holding adjustment - ${holding.name}`,
          purchaseDate
        );
      }

      onClose();
      onHoldingUpdated?.();
    } catch (error: any) {
      console.error('Error updating holding:', error);
      alert(error.message || 'Failed to update holding');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHolding = async () => {
    if (!holding || !user) return;

    try {
      setSubmitting(true);

      // Delete the holding
      const result = await deleteHolding(holding.id);

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete holding');
      }

      // Create a sell transaction record
      await addTransaction(
        user.id,
        'sell',
        holding.symbol.toLowerCase(),
        holding.quantity,
        holding.price,
        0,
        `Holding removed - ${holding.name}`,
        new Date().toISOString()
      );

      onClose();
      onHoldingDeleted?.();
    } catch (error: any) {
      console.error('Error deleting holding:', error);
      alert(error.message || 'Failed to delete holding');
    } finally {
      setSubmitting(false);
    }
  };

  if (!holding) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">
                {mode === 'edit' ? 'Edit Holding' : 'Delete Holding'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Asset Info */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
                {holding.image && (
                  <img
                    src={holding.image}
                    alt={holding.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">{holding.name}</div>
                  <div className="text-sm text-gray-500">{holding.symbol}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="font-medium">${holding.price.toLocaleString()}</div>
                  <div className={`text-sm ${holding.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {holding.change24h >= 0 ? '+' : ''}{holding.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Current Holdings Info */}
              <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Current Quantity</div>
                    <div className="font-medium">{holding.quantity.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Current Value</div>
                    <div className="font-medium">${holding.value.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Avg. Buy Price</div>
                    <div className="font-medium">${holding.averageBuyPrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Total P&L</div>
                    <div className={`font-medium ${holding.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${holding.profit.toLocaleString()} ({holding.profitPercentage.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </Card>

              {/* Mode Selector */}
              <div className="flex space-x-2 mb-6">
                <Button
                  variant={mode === 'edit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('edit')}
                  className="flex-1"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant={mode === 'delete' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('delete')}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>

              {/* Edit Form */}
              {mode === 'edit' && (
                <form onSubmit={handleUpdateHolding} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      step="any"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Average Buy Price (USD)
                    </label>
                    <Input
                      type="number"
                      step="any"
                      value={averagePrice}
                      onChange={(e) => setAveragePrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Purchase Date
                    </label>
                    <Input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Holding'
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* Delete Confirmation */}
              {mode === 'delete' && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-800 dark:text-red-200">
                        Delete Holding
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-300 mt-1">
                        This will permanently remove this holding from your portfolio and create a sell transaction record. This action cannot be undone.
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeleteHolding}
                      disabled={submitting}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Holding'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
