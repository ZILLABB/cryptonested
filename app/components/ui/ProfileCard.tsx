"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Camera, Check, X, LogOut } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../../../contexts/AuthContext';
import { updateUserProfile, uploadAvatar } from '../../../lib/profile';

interface ProfileCardProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
  onSignOut?: () => void;
}

export function ProfileCard({ name = 'User', email = 'user@example.com', avatarUrl, onSignOut }: ProfileCardProps) {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(name);
  const [isUploading, setIsUploading] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(avatarUrl);

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
    } else {
      await signOut();
      window.location.href = '/auth/signin';
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setDisplayName(name);
      setTempAvatarUrl(avatarUrl);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await updateUserProfile(user.id, {
        name: displayName
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;

    const file = e.target.files[0];

    // Create a temporary URL for preview
    const objectUrl = URL.createObjectURL(file);
    setTempAvatarUrl(objectUrl);

    try {
      setIsUploading(true);
      const result = await uploadAvatar(user.id, file);
      if (result.success && result.data) {
        // Update the avatar URL with the one from the server
        setTempAvatarUrl(result.data.path);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      className="premium-card p-8 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative mb-6">
        <div className="relative">
          {tempAvatarUrl ? (
            <img
              src={tempAvatarUrl}
              alt={displayName}
              className="h-28 w-28 rounded-full object-cover border-4 border-[var(--card-border)] shadow-lg"
            />
          ) : (
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white border-4 border-[var(--card-border)] shadow-lg">
              <User className="h-14 w-14" />
            </div>
          )}

          {isEditing && (
            <label className="absolute bottom-0 right-0 p-2 bg-[var(--primary-500)] rounded-full text-white cursor-pointer shadow-md hover:bg-[var(--primary-600)] transition-colors">
              <Camera className="h-5 w-5" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
            </label>
          )}
        </div>
      </div>

      <div className="text-center mb-8 w-full">
        {isEditing ? (
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="text-2xl font-bold text-center w-full bg-transparent border-b border-[var(--primary-400)] focus:outline-none focus:border-[var(--primary-600)] px-3 py-2"
          />
        ) : (
          <h3 className="text-2xl font-bold">{displayName}</h3>
        )}
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">{email}</p>
      </div>

      <div className="flex gap-4 w-full">
        {isEditing ? (
          <>
            <Button
              onClick={handleSaveProfile}
              className="flex-1 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white py-2.5 text-base"
            >
              <Check className="h-5 w-5 mr-2" />
              Save
            </Button>
            <Button
              onClick={handleEditToggle}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2.5 text-base"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleEditToggle}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2.5 text-base"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Profile
            </Button>
            <Button
              onClick={handleSignOut}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 text-base"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
