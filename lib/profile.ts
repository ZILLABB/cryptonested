import { supabase } from './supabase';
import { Database } from '../types/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type ApiResponse<T> = {
  success: boolean;
  error: { message: string } | null;
  data: T | null;
};

/**
 * Get a user's profile
 */
export async function getUserProfile(userId: string): Promise<ApiResponse<Profile>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return {
        success: false,
        error: { message: error.message },
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'An unknown error occurred' },
      data: null,
    };
  }
}

/**
 * Update a user's profile
 */
export async function updateUserProfile(
  userId: string,
  updates: {
    name?: string;
    avatar_url?: string;
  }
): Promise<ApiResponse<Profile>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { message: error.message },
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'An unknown error occurred' },
      data: null,
    };
  }
}

/**
 * Upload a profile avatar
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<ApiResponse<{ path: string }>> {
  try {
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(filePath, file);

    if (uploadError) {
      return {
        success: false,
        error: { message: uploadError.message },
        data: null,
      };
    }

    // Get the public URL
    const { data } = supabase.storage.from('user-content').getPublicUrl(filePath);

    // Update the user's profile with the new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: data.publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      return {
        success: false,
        error: { message: updateError.message },
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data: { path: data.publicUrl },
    };
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'An unknown error occurred' },
      data: null,
    };
  }
}
