"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Edit3, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio } from '../../services/portfolioService';
import { useAuth } from '../../../contexts/AuthContext';

interface Portfolio {
  id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface PortfolioSelectorProps {
  currentPortfolioId: string | null;
  onPortfolioChange: (portfolioId: string) => void;
  onPortfolioCreated?: () => void;
}

export function PortfolioSelector({ 
  currentPortfolioId, 
  onPortfolioChange, 
  onPortfolioCreated 
}: PortfolioSelectorProps) {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
  const [newPortfolioPublic, setNewPortfolioPublic] = useState(false);

  // Load portfolios
  useEffect(() => {
    loadPortfolios();
  }, [user]);

  const loadPortfolios = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const result = await getPortfolios(user.id);
      if (result.success && result.data) {
        setPortfolios(result.data);
      }
    } catch (error) {
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentPortfolio = portfolios.find(p => p.id === currentPortfolioId);

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPortfolioName.trim()) return;

    try {
      setSubmitting(true);
      const result = await createPortfolio(
        user.id,
        newPortfolioName.trim(),
        newPortfolioDescription.trim() || undefined,
        newPortfolioPublic
      );

      if (result.success && result.data) {
        await loadPortfolios();
        onPortfolioChange(result.data.id);
        setShowCreateModal(false);
        resetForm();
        onPortfolioCreated?.();
      } else {
        alert(result.error?.message || 'Failed to create portfolio');
      }
    } catch (error: any) {
      console.error('Error creating portfolio:', error);
      alert(error.message || 'Failed to create portfolio');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortfolio || !newPortfolioName.trim()) return;

    try {
      setSubmitting(true);
      const result = await updatePortfolio(
        editingPortfolio.id,
        newPortfolioName.trim(),
        newPortfolioDescription.trim() || undefined,
        newPortfolioPublic
      );

      if (result.success) {
        await loadPortfolios();
        setShowEditModal(false);
        setEditingPortfolio(null);
        resetForm();
      } else {
        alert(result.error?.message || 'Failed to update portfolio');
      }
    } catch (error: any) {
      console.error('Error updating portfolio:', error);
      alert(error.message || 'Failed to update portfolio');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePortfolio = async (portfolio: Portfolio) => {
    if (portfolios.length <= 1) {
      alert('You must have at least one portfolio');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${portfolio.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setSubmitting(true);
      const result = await deletePortfolio(portfolio.id);

      if (result.success) {
        await loadPortfolios();
        
        // If we deleted the current portfolio, switch to the first available one
        if (portfolio.id === currentPortfolioId) {
          const remainingPortfolios = portfolios.filter(p => p.id !== portfolio.id);
          if (remainingPortfolios.length > 0) {
            onPortfolioChange(remainingPortfolios[0].id);
          }
        }
      } else {
        alert(result.error?.message || 'Failed to delete portfolio');
      }
    } catch (error: any) {
      console.error('Error deleting portfolio:', error);
      alert(error.message || 'Failed to delete portfolio');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setNewPortfolioName(portfolio.name);
    setNewPortfolioDescription(portfolio.description || '');
    setNewPortfolioPublic(portfolio.is_public);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setNewPortfolioName('');
    setNewPortfolioDescription('');
    setNewPortfolioPublic(false);
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full md:w-auto justify-between min-w-[200px]"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className="truncate">
                {currentPortfolio?.name || 'Select Portfolio'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <Card className="p-2 shadow-lg border">
                <div className="space-y-1">
                  {portfolios.map((portfolio) => (
                    <div
                      key={portfolio.id}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                        portfolio.id === currentPortfolioId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div
                        className="flex-1 min-w-0"
                        onClick={() => {
                          onPortfolioChange(portfolio.id);
                          setIsOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-medium truncate">{portfolio.name}</span>
                          {portfolio.is_public ? (
                            <Eye className="w-3 h-3 text-green-500" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                        {portfolio.description && (
                          <p className="text-sm text-gray-500 truncate">{portfolio.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(portfolio);
                          }}
                          className="p-1 h-auto"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        {portfolios.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePortfolio(portfolio);
                            }}
                            className="p-1 h-auto text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCreateModal(true);
                      setIsOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Portfolio
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Portfolio Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Create New Portfolio</h2>
                
                <form onSubmit={handleCreatePortfolio} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Portfolio Name</label>
                    <Input
                      type="text"
                      value={newPortfolioName}
                      onChange={(e) => setNewPortfolioName(e.target.value)}
                      placeholder="My Portfolio"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                    <Input
                      type="text"
                      value={newPortfolioDescription}
                      onChange={(e) => setNewPortfolioDescription(e.target.value)}
                      placeholder="Portfolio description..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="public"
                      checked={newPortfolioPublic}
                      onChange={(e) => setNewPortfolioPublic(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="public" className="text-sm">Make portfolio public</label>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || !newPortfolioName.trim()}
                      className="flex-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Portfolio'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Portfolio Modal */}
      <AnimatePresence>
        {showEditModal && editingPortfolio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Portfolio</h2>
                
                <form onSubmit={handleEditPortfolio} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Portfolio Name</label>
                    <Input
                      type="text"
                      value={newPortfolioName}
                      onChange={(e) => setNewPortfolioName(e.target.value)}
                      placeholder="My Portfolio"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                    <Input
                      type="text"
                      value={newPortfolioDescription}
                      onChange={(e) => setNewPortfolioDescription(e.target.value)}
                      placeholder="Portfolio description..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="editPublic"
                      checked={newPortfolioPublic}
                      onChange={(e) => setNewPortfolioPublic(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="editPublic" className="text-sm">Make portfolio public</label>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingPortfolio(null);
                        resetForm();
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || !newPortfolioName.trim()}
                      className="flex-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Portfolio'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
