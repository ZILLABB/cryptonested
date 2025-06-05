"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardWrapper from '../components/DashboardWrapper';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StakingModal } from '../components/ui/StakingModal';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getStakingPlansWithDetails, 
  getUserStakingPositionsWithDetails, 
  getStakingSummary,
  startStaking,
  withdrawStaking,
  StakingPlanWithDetails,
  StakingPositionWithDetails,
  StakingSummary
} from '../services/stakingService';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Award,
  CreditCard,
  Percent,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Coins
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function StakingPage() {
  const { user } = useAuth();
  const [stakingPlans, setStakingPlans] = useState<StakingPlanWithDetails[]>([]);
  const [stakingPositions, setStakingPositions] = useState<StakingPositionWithDetails[]>([]);
  const [stakingSummary, setStakingSummary] = useState<StakingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'plans' | 'positions'>('overview');
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [selectedPlanForStaking, setSelectedPlanForStaking] = useState<StakingPlanWithDetails | undefined>();

  useEffect(() => {
    if (user) {
      loadStakingData();
    }
  }, [user]);

  const loadStakingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [plans, positions, summary] = await Promise.all([
        getStakingPlansWithDetails(),
        getUserStakingPositionsWithDetails(user!.id),
        getStakingSummary(user!.id)
      ]);

      setStakingPlans(plans);
      setStakingPositions(positions);
      setStakingSummary(summary);
    } catch (err: any) {
      console.error('Error loading staking data:', err);
      setError('Failed to load staking data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartStaking = async (planId: string, coinId: string, amount: number) => {
    try {
      const result = await startStaking(user!.id, planId, coinId, amount);

      if (result.success) {
        // Reload data to show new position
        await loadStakingData();
        // Show success message
        alert('Staking position created successfully!');
      } else {
        throw new Error(result.error || 'Failed to start staking');
      }
    } catch (error: any) {
      throw error; // Re-throw to be handled by the modal
    }
  };

  const openStakingModal = (plan: StakingPlanWithDetails) => {
    setSelectedPlanForStaking(plan);
    setShowStakingModal(true);
  };

  const closeStakingModal = () => {
    setShowStakingModal(false);
    setSelectedPlanForStaking(undefined);
  };

  const handleWithdraw = async (positionId: string, isEarlyWithdrawal: boolean = false) => {
    try {
      const result = await withdrawStaking(user!.id, positionId, isEarlyWithdrawal);
      
      if (result.success) {
        // Reload data to show updated position
        await loadStakingData();
        // Show success message
        alert('Withdrawal completed successfully!');
      } else {
        alert(result.error || 'Failed to withdraw');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to withdraw');
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCard className="h-6 w-6" />;
      case 'Percent':
        return <Percent className="h-6 w-6" />;
      case 'Lock':
        return <Lock className="h-6 w-6" />;
      default:
        return <DollarSign className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <DashboardWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardWrapper>
    );
  }

  if (error) {
    return (
      <DashboardWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadStakingData}>Try Again</Button>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Staking Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Earn passive income by staking your cryptocurrency
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'plans', label: 'Staking Plans' },
              { id: 'positions', label: 'My Positions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && stakingSummary && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Staked</p>
                    <p className="text-2xl font-bold">${stakingSummary.total_staked.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Coins className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rewards</p>
                    <p className="text-2xl font-bold text-green-600">${stakingSummary.total_rewards.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Positions</p>
                    <p className="text-2xl font-bold">{stakingSummary.active_positions}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average APY</p>
                    <p className="text-2xl font-bold">{stakingSummary.average_apy.toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <Percent className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Staking Plans Tab */}
        {selectedTab === 'plans' && (
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8">
            {stakingPlans.map((plan, index) => (
              <Card key={plan.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white mb-4">
                    {getIconComponent(plan.icon)}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{plan.apy}%</span>
                    <span className="text-gray-600 dark:text-gray-300 ml-1">APY</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={index === 1 ? "primary" : "outline"}
                    className="w-full"
                    onClick={() => openStakingModal(plan)}
                  >
                    Start Staking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Positions Tab */}
        {selectedTab === 'positions' && (
          <motion.div variants={itemVariants}>
            {stakingPositions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coins className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Staking Positions</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You haven't started staking yet. Choose a plan to begin earning rewards.
                  </p>
                  <Button onClick={() => setSelectedTab('plans')}>
                    View Staking Plans
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {stakingPositions.map((position) => (
                  <Card key={position.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {position.coin_symbol}
                          </div>
                          <div>
                            <h3 className="font-semibold">{position.coin_name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {position.staking_plan?.name} • {position.staking_plan?.apy}% APY
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Staked Amount</p>
                            <p className="font-semibold">{position.amount.toLocaleString()} {position.coin_symbol}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Current Value</p>
                            <p className="font-semibold">${position.current_value?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Rewards</p>
                            <p className="font-semibold text-green-600">${position.total_rewards.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              position.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {position.status}
                            </span>
                          </div>
                        </div>

                        {position.status === 'active' && (
                          <div className="flex space-x-2">
                            {position.can_withdraw ? (
                              <Button
                                size="sm"
                                onClick={() => handleWithdraw(position.id)}
                              >
                                Withdraw
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (confirm('Early withdrawal will incur a penalty. Continue?')) {
                                    handleWithdraw(position.id, true);
                                  }
                                }}
                              >
                                Early Withdraw
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Staking Modal */}
        <StakingModal
          isOpen={showStakingModal}
          onClose={closeStakingModal}
          onStake={handleStartStaking}
          selectedPlan={selectedPlanForStaking}
        />
      </motion.div>
    </DashboardWrapper>
  );
}
