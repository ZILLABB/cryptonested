import { supabase } from '../../lib/supabase';

/**
 * Save user profile data to Supabase
 */
export async function saveUserProfile(userId: string, profileData: any) {
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking profile:', checkError);
      return { success: false, error: checkError.message };
    }

    // If profile exists, update it
    if (existingProfile) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return { success: false, error: updateError.message };
      }
    } else {
      // If profile doesn't exist, create it
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return { success: false, error: insertError.message };
      }
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error saving profile:', error);
    return { success: false, error: error.message || 'An unknown error occurred' };
  }
}

/**
 * Get user profile data from Supabase
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, error: null, data };
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return { success: false, error: error.message || 'An unknown error occurred', data: null };
  }
}

/**
 * Save user settings to Supabase
 */
export async function saveUserSettings(userId: string, settings: any) {
  try {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        settings,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving settings:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return { success: false, error: error.message || 'An unknown error occurred' };
  }
}

/**
 * Get user settings from Supabase
 */
export async function getUserSettings(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('settings')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, error: null, data: data?.settings || {} };
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return { success: false, error: error.message || 'An unknown error occurred', data: null };
  }
}

/**
 * Save data to local storage as a fallback
 */
export function saveToLocalStorage(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Get data from local storage
 */
export function getFromLocalStorage(key: string) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
}
