"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './Button';
import Image from 'next/image';
import { getTopCryptos, SimpleCryptoCoin } from '../../services/cryptoService';
import { addHolding, addTransaction } from '../../services/portfolioService';
import { useAuth } from '../../../contexts/AuthContext';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId?: string;
  onAssetAdded?: () => void;
}

export function AddAssetModal({ isOpen, onClose, portfolioId, onAssetAdded }: AddAssetModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptoList, setCryptoList] = useState<SimpleCryptoCoin[]>([]);
  const [filteredCryptoList, setFilteredCryptoList] = useState<SimpleCryptoCoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<SimpleCryptoCoin | null>(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Fetch crypto list
  useEffect(() => {
    const fetchCryptoList = async () => {
      try {
        setIsLoading(true);
        const data = await getTopCryptos(100);
        setCryptoList(data);
        setFilteredCryptoList(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching crypto list:', error);
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchCryptoList();
    }
  }, [isOpen]);
  
  // Filter crypto list based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCryptoList(cryptoList);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = cryptoList.filter(crypto => 
      crypto.name.toLowerCase().includes(searchLower) || 
      crypto.symbol.toLowerCase().includes(searchLower)
    );
    
    setFilteredCryptoList(filtered);
  }, [searchTerm, cryptoList]);
  
  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setSearchTerm('');
      setSelectedCrypto(null);
      setQuantity('');
      setPrice('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);
  
  // Handle crypto selection
  const handleSelectCrypto = (crypto: SimpleCryptoCoin) => {
    setSelectedCrypto(crypto);
    setPrice(crypto.price.toString());
    setStep('details');
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedCrypto || !quantity || !price || !date || !user || !portfolioId) return;

    try {
      setIsSubmitting(true);

      const quantityNum = parseFloat(quantity);
      const priceNum = parseFloat(price);

      if (isNaN(quantityNum) || isNaN(priceNum) || quantityNum <= 0 || priceNum <= 0) {
        alert('Please enter valid quantity and price values');
        return;
      }

      // Add holding to portfolio
      const holdingResult = await addHolding(
        portfolioId,
        selectedCrypto.id,
        quantityNum,
        priceNum,
        date
      );

      if (!holdingResult.success) {
        throw new Error(holdingResult.error?.message || 'Failed to add holding');
      }

      // Add transaction record
      await addTransaction(
        user.id,
        'buy',
        selectedCrypto.id,
        quantityNum,
        priceNum,
        0, // No fee for manual entry
        `Manual entry - ${selectedCrypto.name}`,
        date
      );

      // Reset form and close modal
      setStep('select');
      setSearchTerm('');
      setSelectedCrypto(null);
      setQuantity('');
      setPrice('');
      setDate(new Date().toISOString().split('T')[0]);

      onClose();
      onAssetAdded?.();
    } catch (error: any) {
      console.error('Error adding asset:', error);
      alert(error.message || 'Failed to add asset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {step === 'select' ? 'Add Asset' : 'Enter Details'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {step === 'select' ? (
                <>
                  {/* Search */}
                  <div className="relative mb-6">
                    <input
                      type="text"
                      placeholder="Search cryptocurrencies..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  
                  {/* Crypto List */}
                  {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-500)]"></div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                      {filteredCryptoList.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                          No cryptocurrencies found matching your search.
                        </div>
                      ) : (
                        filteredCryptoList.map((crypto) => (
                          <motion.div
                            key={crypto.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                            whileHover={{ y: -2 }}
                            onClick={() => handleSelectCrypto(crypto)}
                          >
                            <div className="flex items-center">
                              {crypto.image && (
                                <div className="w-8 h-8 mr-3">
                                  <Image
                                    src={crypto.image}
                                    alt={crypto.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{crypto.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="text-right mr-3">
                                <div className="font-medium">{formatCurrency(crypto.price)}</div>
                                <div className={`text-xs ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h}%
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Asset Details Form */}
                  {selectedCrypto && (
                    <div className="space-y-6">
                      <div className="flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        {selectedCrypto.image && (
                          <div className="w-10 h-10 mr-4">
                            <Image
                              src={selectedCrypto.image}
                              alt={selectedCrypto.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-lg">{selectedCrypto.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{selectedCrypto.symbol}</div>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="font-medium">{formatCurrency(selectedCrypto.price)}</div>
                          <div className={`text-xs ${selectedCrypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {selectedCrypto.change24h >= 0 ? '+' : ''}{selectedCrypto.change24h}%
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Quantity</label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                          placeholder="Enter quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          step="any"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Price per coin</label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                          placeholder="Enter price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          step="any"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Date of purchase</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      {quantity && price && (
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-500 dark:text-gray-400">Total Value:</span>
                            <span className="font-medium">{formatCurrency(parseFloat(quantity) * parseFloat(price))}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-4 pt-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setStep('select')}
                        >
                          Back
                        </Button>
                        <Button
                          className="flex-1 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
                          onClick={handleSubmit}
                          disabled={!quantity || !price || !date || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Portfolio
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
