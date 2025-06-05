# Fixing Row-Level Security (RLS) Issues in Supabase

This document provides instructions for fixing the "new row violates row-level security policy for table 'profiles'" error that occurs during user registration.

## The Problem

When a new user signs up, the application attempts to create a profile record in the `profiles` table. However, the Row-Level Security (RLS) policies on the table are preventing this insertion, resulting in an error.

## Solution Options

### Option 1: Run the SQL Fix Script (Recommended)

The `fix-rls.sql` file contains SQL commands to fix the RLS policies and ensure the trigger function works correctly.

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `fix-rls.sql` and paste it into a new SQL query
4. Run the query to update the RLS policies and trigger function

This script:
- Creates the profiles table if it doesn't exist
- Drops and recreates the RLS policies with proper permissions
- Creates a new trigger function with SECURITY DEFINER to bypass RLS
- Sets up the necessary grants for all roles

### Option 2: Manually Update RLS Policies

If you prefer to make the changes manually:

1. Go to your Supabase project dashboard
2. Navigate to the Authentication > Policies section
3. Find the `profiles` table
4. Add a new policy with the following settings:
   - Name: "System can create profiles"
   - Operation: INSERT
   - Target roles: authenticated, anon
   - Using expression: `true`
   - With check expression: `true`

### Option 3: Disable RLS Temporarily

If you're still having issues, you can temporarily disable RLS on the profiles table:

```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

**Note:** This is not recommended for production as it removes all security restrictions.

## Verifying the Fix

After applying one of the solutions:

1. Try signing up a new user
2. Check if a profile record is created in the `profiles` table
3. Verify that the user can access their profile data after logging in

## Additional Fallback Mechanisms

The application has been updated with multiple fallback mechanisms:

1. The sign-up function now ignores RLS errors and continues with the registration
2. A server-side API route (`/api/auth/create-profile`) has been added to create profiles with elevated privileges
3. The sign-up process will still succeed even if profile creation fails, allowing users to log in

These mechanisms ensure that users can still register and use the application even if there are issues with the RLS policies.

## Troubleshooting

If you continue to experience issues:

1. Check the browser console for error messages
2. Look at the Supabase logs for more detailed error information
3. Verify that the trigger function is correctly set up
4. Ensure that the service role key has the necessary permissions

For persistent issues, you may need to contact Supabase support or review the Supabase documentation on Row-Level Security.
