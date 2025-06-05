"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from 'next-themes';
import {
  User, Shield, Bell, Settings, LogOut, Camera, Edit2, Mail, Calendar,
  MapPin, Globe, CheckCircle, Lock, Key, Smartphone, AlertTriangle,
  DollarSign, TrendingUp, Activity, BarChart2, ChevronRight, ExternalLink,
  X, Save, Eye, EyeOff, QrCode
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { saveUserProfile, saveUserSettings, saveToLocalStorage, getUserProfile, getUserSettings } from '../services/dataService';
import { useToast } from '../components/ui/use-toast';





export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    bio: '',
    location: '',
    website: ''
  });
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    coverPhoto: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Crypto enthusiast and investor since 2017. Focused on DeFi and emerging blockchain technologies.',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    joinDate: 'March 2023',
    verificationStatus: 'verified',
    twoFactorEnabled: false,
    securityAlerts: true,
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    marketAlerts: true,
    newsDigest: false,
    portfolioUpdates: true,
    theme: 'system',
    currency: 'USD',
    language: 'en',
    timeFormat: '12h',
    publicProfile: true,
    showPortfolioValue: false,
    activityStatus: true,
    portfolioStats: {
      totalValue: 37892.45,
      totalGain: 4735.28,
      totalGainPercentage: 12.5,
      totalTransactions: 32,
      bestPerformer: {
        name: 'Ethereum',
        symbol: 'ETH',
        gain: 28.7
      },
      worstPerformer: {
        name: 'Solana',
        symbol: 'SOL',
        loss: -5.2
      }
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set the page context for the Header component
    document.body.setAttribute('data-page-context', 'dashboard');

    const loadUserProfile = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Try to get profile data from Supabase
        const { data: profileData, success: profileSuccess, error: profileError } = await getUserProfile(user.id);

        // Try to get settings from Supabase
        const { data: settingsData, success: settingsSuccess, error: settingsError } = await getUserSettings(user.id);

        // Merge data with defaults
        const updatedUserData = {
          ...userData,
          name: profileData?.name || user.email?.split('@')[0] || 'User',
          email: user.email || 'user@example.com',
          bio: profileData?.bio || userData.bio,
          location: profileData?.location || userData.location,
          website: profileData?.website || userData.website,
          avatar: profileData?.avatar_url || userData.avatar,
          joinDate: profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString() : userData.joinDate,
          // Apply settings if available
          ...(settingsSuccess ? settingsData : {})
        };

        setUserData(updatedUserData);

        // Initialize form values with user data
        setFormValues({
          name: updatedUserData.name,
          bio: updatedUserData.bio,
          location: updatedUserData.location,
          website: updatedUserData.website
        });

        // Sync theme with userData
        if (updatedUserData.theme) {
          setTheme(updatedUserData.theme);
        }

        // Log any errors for debugging
        if (profileError) {
          console.warn('Error fetching profile:', profileError);
        }

        if (settingsError) {
          console.warn('Error fetching settings:', settingsError);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);

        // Fallback to local data
        const updatedUserData = {
          ...userData,
          name: user.email?.split('@')[0] || 'User',
          email: user.email || 'user@example.com',
        };

        setUserData(updatedUserData);
        setFormValues({
          name: updatedUserData.name,
          bio: updatedUserData.bio,
          location: updatedUserData.location,
          website: updatedUserData.website
        });

        setLoading(false);
      }
    };

    loadUserProfile();

    // Clean up when component unmounts
    return () => {
      document.body.removeAttribute('data-page-context');
    };
  }, [user, setTheme]);

  // Profile editing functions
  const handleEditProfile = () => {
    setIsEditing(true);
    setFormValues({
      name: userData.name,
      bio: userData.bio,
      location: userData.location,
      website: userData.website
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);

    try {
      // Update local state first for immediate feedback
      setUserData({
        ...userData,
        name: formValues.name,
        bio: formValues.bio,
        location: formValues.location,
        website: formValues.website
      });

      // Save profile data to Supabase
      const profileData = {
        name: formValues.name,
        bio: formValues.bio,
        location: formValues.location,
        website: formValues.website,
        updated_at: new Date().toISOString()
      };

      const result = await saveUserProfile(user.id, profileData);

      if (result.success) {
        // Also save to local storage as a backup
        saveToLocalStorage(`profile_${user.id}`, profileData);

        toast({
          title: "Profile saved",
          description: "Your profile has been updated successfully.",
          variant: "default",
        });

        setIsEditing(false);
      } else {
        toast({
          title: "Error saving profile",
          description: result.error || "There was an error saving your profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: error.message || "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Avatar upload functions
  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      // In a real implementation, you would upload the avatar to storage
      // For demo purposes, we'll use a local URL
      const url = URL.createObjectURL(file);
      setUserData({...userData, avatar: url});
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  // Password change functions
  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordValues({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordValues({
      ...passwordValues,
      [name]: value
    });
  };

  const handleTogglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleSavePassword = () => {
    // Validate passwords
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordValues.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    // In a real implementation, you would call an API to change the password
    alert('Password changed successfully!');
    setShowPasswordModal(false);
  };

  // Two-factor authentication functions
  const handleToggleTwoFactor = () => {
    if (userData.twoFactorEnabled) {
      // If 2FA is already enabled, just disable it
      setUserData({
        ...userData,
        twoFactorEnabled: false
      });
      alert('Two-factor authentication disabled!');
    } else {
      // If 2FA is not enabled, show the setup modal
      setShowTwoFactorModal(true);
    }
  };

  const handleCloseTwoFactorModal = () => {
    setShowTwoFactorModal(false);
  };

  const handleEnableTwoFactor = () => {
    setUserData({
      ...userData,
      twoFactorEnabled: true
    });
    setShowTwoFactorModal(false);
    alert('Two-factor authentication enabled!');
  };

  // Toggle switch functions
  const handleToggleSwitch = async (setting: string) => {
    if (!user) return;

    // Get the new value (toggle the current value)
    const newValue = !userData[setting as keyof typeof userData];

    // Update local state first for immediate feedback
    setUserData({
      ...userData,
      [setting]: newValue
    });

    try {
      // Save setting to Supabase
      const result = await saveUserSettings(user.id, {
        [setting]: newValue
      });

      if (result.success) {
        // Also save to local storage as a backup
        saveToLocalStorage(`settings_${user.id}`, {
          [setting]: newValue
        });

        toast({
          title: `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')} ${newValue ? 'enabled' : 'disabled'}`,
          description: `Your preference has been saved.`,
          variant: "default",
        });
      } else {
        // Revert the local state if save failed
        setUserData({
          ...userData,
          [setting]: !newValue
        });

        toast({
          title: "Error saving setting",
          description: result.error || "There was an error saving your preference.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error saving setting:', error);

      // Revert the local state if save failed
      setUserData({
        ...userData,
        [setting]: !newValue
      });

      toast({
        title: "Error saving setting",
        description: error.message || "There was an error saving your preference.",
        variant: "destructive",
      });
    }
  };

  // Dropdown change functions
  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!user) return;

    const { name, value } = e.target;

    // Apply theme changes immediately
    if (name === 'theme') {
      setTheme(value);
    }

    // Update user data locally
    setUserData({
      ...userData,
      [name]: value
    });

    try {
      // Save settings to Supabase
      const settingsData = {
        ...userData,
        [name]: value,
        updated_at: new Date().toISOString()
      };

      const result = await saveUserSettings(user.id, {
        [name]: value
      });

      if (result.success) {
        // Also save to local storage as a backup
        saveToLocalStorage(`settings_${user.id}`, {
          [name]: value
        });

        toast({
          title: `${name.charAt(0).toUpperCase() + name.slice(1)} updated`,
          description: `Your ${name} preference has been saved.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error saving settings",
          description: result.error || `There was an error saving your ${name} preference.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: error.message || `There was an error saving your ${name} preference.`,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your account details and profile information</p>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={handleEditProfile}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-1.5"
                      onClick={handleSaveProfile}
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</p>
                      <p className="font-medium">{userData.name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</p>
                      <p className="font-medium flex items-center gap-2">
                        {userData.email}
                        {userData.verificationStatus === 'verified' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {userData.location}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member since</p>
                      <p className="font-medium flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {userData.joinDate}
                      </p>
                    </div>
                  </div>

                  {userData.bio && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bio</p>
                      <p className="text-gray-700 dark:text-gray-300">{userData.bio}</p>
                    </div>
                  )}

                  {userData.website && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Website</p>
                      <a
                        href={userData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                      >
                        <Globe className="h-4 w-4" />
                        {userData.website.replace(/^https?:\/\//, '')}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formValues.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</label>
                      <div className="flex items-center gap-2">
                        <input
                          id="email"
                          type="email"
                          value={userData.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                        />
                        {userData.verificationStatus === 'verified' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          id="location"
                          name="location"
                          type="text"
                          value={formValues.location}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="website" className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          id="website"
                          name="website"
                          type="url"
                          value={formValues.website}
                          onChange={handleInputChange}
                          placeholder="https://example.com"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formValues.bio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-medium mb-4">Portfolio Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Value</p>
                      <DollarSign className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="relative">
                      {userData.showPortfolioValue ? (
                        <p className="text-2xl font-bold">${userData.portfolioStats.totalValue.toLocaleString()}</p>
                      ) : (
                        <>
                          <p className="text-2xl font-bold blur-sm select-none">$XX,XXX.XX</p>
                          <button
                            className="absolute inset-0 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => handleToggleSwitch('showPortfolioValue')}
                          >
                            <EyeOff className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Gain</p>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="relative">
                      {userData.showPortfolioValue ? (
                        <>
                          <p className="text-2xl font-bold text-green-500">+{userData.portfolioStats.totalGainPercentage}%</p>
                          <p className="text-sm text-green-600">+${userData.portfolioStats.totalGain.toLocaleString()}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-green-500 blur-sm select-none">+XX.X%</p>
                          <p className="text-sm text-green-600 blur-sm select-none">+$X,XXX.XX</p>
                          <button
                            className="absolute inset-0 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => handleToggleSwitch('showPortfolioValue')}
                          >
                            <EyeOff className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transactions</p>
                      <Activity className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold">{userData.portfolioStats.totalTransactions}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Best Performer</p>
                      <BarChart2 className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="relative">
                      {userData.showPortfolioValue ? (
                        <>
                          <p className="text-xl font-bold">{userData.portfolioStats.bestPerformer.symbol}</p>
                          <p className="text-sm text-green-600">+{userData.portfolioStats.bestPerformer.gain}%</p>
                        </>
                      ) : (
                        <>
                          <p className="text-xl font-bold blur-sm select-none">XXX</p>
                          <p className="text-sm text-green-600 blur-sm select-none">+XX.X%</p>
                          <button
                            className="absolute inset-0 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => handleToggleSwitch('showPortfolioValue')}
                          >
                            <EyeOff className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 flex justify-center gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-1.5"
                  onClick={() => window.location.href = '/portfolio'}
                >
                  View Full Portfolio
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <button
                  className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-indigo-500 rounded-md shadow-md"
                  onClick={handleSignOut}
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-600 group-hover:translate-x-0 ease">
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-indigo-600 transition-all duration-300 transform group-hover:translate-x-full ease">
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </span>
                  <span className="relative invisible">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-1">Security Settings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account security and authentication methods</p>
            </div>

            <div className="space-y-4">
              <Card className="overflow-hidden border-none shadow-sm">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 py-4">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-indigo-500" />
                    <h4 className="font-medium">Password</h4>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Change your password regularly to keep your account secure</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last changed: 3 months ago</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5"
                      onClick={handleOpenPasswordModal}
                    >
                      <Key className="h-3.5 w-3.5" />
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-sm">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 py-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-indigo-500" />
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Add an extra layer of security to your account</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Protect your account with an additional verification step</p>
                    </div>
                    <Button
                      variant={userData.twoFactorEnabled ? "outline" : "primary"}
                      size="sm"
                      className="flex items-center gap-1.5"
                      onClick={handleToggleTwoFactor}
                    >
                      {userData.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-sm">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 py-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <h4 className="font-medium">Security Alerts</h4>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Get notified about important security events</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Receive alerts for suspicious activities, login attempts, and more</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400 mr-3">
                        {userData.securityAlerts ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => handleToggleSwitch('securityAlerts')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${userData.securityAlerts ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${userData.securityAlerts ? 'translate-x-6' : 'translate-x-1'}`}
                        ></span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="font-medium mb-4">Recent Login Activity</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Smartphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Chrome on Windows</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">San Francisco, CA • Today, 10:45 AM</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">Current</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Smartphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Safari on iPhone</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">San Francisco, CA • Yesterday, 8:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <div className="flex justify-between items-center p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg shadow-sm">
                <div>
                  <p className="font-medium text-red-800 dark:text-red-300">Sign Out of All Devices</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Log out of your account on all devices for security</p>
                </div>
                <button
                  className="relative px-5 py-2.5 overflow-hidden font-medium text-red-600 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-800 rounded-lg shadow-inner group"
                  onClick={() => {
                    handleSignOut();
                    alert('Signed out of all devices');
                  }}
                >
                  <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-300 border-t-2 border-red-600 group-hover:w-full ease"></span>
                  <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-300 border-b-2 border-red-600 group-hover:w-full ease"></span>
                  <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-red-600 group-hover:h-full ease"></span>
                  <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-red-600 group-hover:h-full ease"></span>
                  <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-red-700 opacity-0 group-hover:opacity-100"></span>
                  <span className="relative flex items-center justify-center transition-colors duration-300 delay-200 group-hover:text-white ease">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out Everywhere
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-1">Notification Preferences</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage how you receive notifications and alerts</p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Notification Channels</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleSwitch('emailNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${userData.emailNotifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${userData.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts on your device</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleSwitch('pushNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${userData.pushNotifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${userData.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive text messages for important alerts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleSwitch('smsNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${userData.smsNotifications ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${userData.smsNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-medium mb-4">Notification Types</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Market Alerts</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price changes, market movements, and trading opportunities</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Security Alerts</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Login attempts, account changes, and security events</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">News Digest</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Weekly summary of crypto news and market insights</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-700">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Portfolio Updates</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Daily summary of your portfolio performance</p>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-1">Account Settings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account preferences and display settings</p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Display Settings</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
                    </div>
                    <select
                      name="theme"
                      value={theme || userData.theme}
                      onChange={handleSelectChange}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System (Default)</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Currency</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Set your default currency</p>
                    </div>
                    <select
                      name="currency"
                      value={userData.currency}
                      onChange={handleSelectChange}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="BTC">BTC (₿)</option>
                      <option value="ETH">ETH (Ξ)</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred language</p>
                    </div>
                    <select
                      name="language"
                      value={userData.language}
                      onChange={handleSelectChange}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Time Format</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred time format</p>
                    </div>
                    <select
                      name="timeFormat"
                      value={userData.timeFormat}
                      onChange={handleSelectChange}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="12h">12-hour (AM/PM)</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-medium mb-4">Privacy Settings</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Public Profile</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow other users to see your profile</p>
                    </div>
                    <button
                      onClick={() => handleToggleSwitch('publicProfile')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${userData.publicProfile ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${userData.publicProfile ? 'translate-x-6' : 'translate-x-1'}`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Show Portfolio Value</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Display your portfolio value on your public profile</p>
                    </div>
                    <button
                      onClick={() => handleToggleSwitch('showPortfolioValue')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${userData.showPortfolioValue ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${userData.showPortfolioValue ? 'translate-x-6' : 'translate-x-1'}`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Activity Status</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Show when you're active on the platform</p>
                    </div>
                    <button
                      onClick={() => handleToggleSwitch('activityStatus')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${userData.activityStatus ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${userData.activityStatus ? 'translate-x-6' : 'translate-x-1'}`}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-medium mb-4">Account Actions</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg shadow-sm">
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-300">Sign Out</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Log out of your account on this device</p>
                    </div>
                    <button
                      className="relative inline-flex items-center justify-center p-4 px-6 py-2.5 overflow-hidden font-medium text-red-600 transition duration-300 ease-out border-2 border-red-500 rounded-full shadow-md group"
                      onClick={handleSignOut}
                    >
                      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 translate-y-full bg-red-600 group-hover:translate-y-0 ease">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </span>
                      <span className="absolute flex items-center justify-center w-full h-full text-red-600 transition-all duration-300 transform group-hover:translate-y-full ease">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </span>
                      <span className="relative invisible">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  className="flex items-center gap-1.5"
                  onClick={() => alert('Settings saved successfully!')}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="px-6 py-8 md:px-8 lg:px-10 max-w-7xl mx-auto">
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={handleClosePasswordModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword.current ? "text" : "password"}
                    value={passwordValues.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleTogglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.current ? (
                      <Eye className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    value={passwordValues.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleTogglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.new ? (
                      <Eye className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordValues.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleTogglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.confirm ? (
                      <Eye className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleClosePasswordModal}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePassword}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication Modal */}
      {showTwoFactorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={handleCloseTwoFactorModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-medium mb-4">Enable Two-Factor Authentication</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-2 rounded">
                    <div className="h-40 w-40 bg-gray-200 flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                  Scan this QR code with your authenticator app
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="verificationCode" className="text-sm font-medium">Verification Code</label>
                <input
                  id="verificationCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800"
                />
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    Store your backup codes in a safe place. You'll need them if you lose access to your device.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleCloseTwoFactorModal}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEnableTwoFactor}
              >
                Enable 2FA
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-500)]"></div>
          </div>
        )}

        {!loading && (
          <>
            {/* Cover Photo */}
            <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-16">
              <Image
                src={userData.coverPhoto}
                alt="Cover"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* Sign Out Button on Banner */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={handleSignOut}
                  className="group flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 dark:bg-black/30 dark:hover:bg-black/40 backdrop-blur-md rounded-full text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="relative overflow-hidden whitespace-nowrap w-16">
                    <span className="flex transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-full justify-center">
                      Account
                    </span>
                    <span className="absolute inset-0 flex transition-all duration-300 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 justify-center">
                      Sign Out
                    </span>
                  </span>
                  <LogOut className="h-4 w-4 transition-all duration-300 group-hover:text-red-300" />
                </button>
              </div>

              {/* Profile Avatar (positioned over the cover photo) */}
              <div className="absolute -bottom-12 left-6 flex items-end">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg group transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <Image
                      src={userData.avatar}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover transition-all duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                  </div>
                  <button
                    onClick={handleAvatarUpload}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-110"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>


            </div>

            {/* Profile Header Info */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-6 mb-8">
              <div>
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{userData.email}</span>
                </div>
                {userData.bio && (
                  <p className="mt-2 text-gray-700 dark:text-gray-300 max-w-2xl">{userData.bio}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-3">
                  {userData.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{userData.location}</span>
                    </div>
                  )}
                  {userData.website && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Globe className="h-4 w-4" />
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        {userData.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {userData.joinDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {userData.verificationStatus === 'verified' && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Verified
                  </div>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
              {/* Sidebar */}
              <div>
                <Card>
                  <CardContent className="p-0">
                    <nav className="space-y-1">
                      <button
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-medium ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-l-4 border-indigo-600 dark:border-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        onClick={() => setActiveTab('profile')}
                      >
                        <User className="h-5 w-5" />
                        Profile
                      </button>
                      <button
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-medium ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-l-4 border-indigo-600 dark:border-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        onClick={() => setActiveTab('security')}
                      >
                        <Shield className="h-5 w-5" />
                        Security
                      </button>
                      <button
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-medium ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-l-4 border-indigo-600 dark:border-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        onClick={() => setActiveTab('notifications')}
                      >
                        <Bell className="h-5 w-5" />
                        Notifications
                      </button>
                      <button
                        className={`flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-medium ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-l-4 border-indigo-600 dark:border-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        onClick={() => setActiveTab('settings')}
                      >
                        <Settings className="h-5 w-5" />
                        Settings
                      </button>
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div>
                <Card className="md:min-h-[600px]">
                  <CardContent className="p-6">
                    {renderTabContent()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
