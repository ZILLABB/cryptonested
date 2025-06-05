import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { userId, email, name } = requestData;

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    // Create a direct Supabase client without cookies
    const supabase = createClient(
      'https://ewivnbozikdxexaowiid.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aXZuYm96aWtkeGV4YW93aWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMDQzMjksImV4cCI6MjA2MTg4MDMyOX0.u6F4nZNRh1hJZBN6Di3DSA1RJdeDOSjzOeGzQyQcz58'
    );

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      return NextResponse.json({ success: true, profile: existingProfile });
    }

    // Create profile if it doesn't exist
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        name: name || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return NextResponse.json(
        { error: `Failed to create profile: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error('Server error creating profile:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
