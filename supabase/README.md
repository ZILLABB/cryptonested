# Supabase Backend Setup for CryptoNested

This directory contains the necessary files to set up the Supabase backend for the CryptoNested application.

## Setup Instructions

### 1. Database Schema

The `schema.sql` file contains all the SQL commands needed to set up the database schema, including:

- Tables for user profiles, portfolios, holdings, transactions, and watchlists
- Row-level security policies for data protection
- Storage bucket configuration for user content
- Triggers for automatic user profile creation

To set up the database schema:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `schema.sql` and paste it into a new SQL query
4. Run the query to create all the necessary tables and policies

### 2. Authentication Setup

The application uses Supabase Auth for user authentication. Make sure the following settings are configured in your Supabase project:

1. **Email Authentication**:
   - Go to Authentication > Providers
   - Ensure Email provider is enabled
   - Configure email templates for confirmation, invitation, and password reset

2. **Security Settings**:
   - Set minimum password length to 6 characters
   - Enable email confirmations if desired

### 3. Storage Setup

The application uses Supabase Storage for storing user avatars and other content:

1. The `schema.sql` file already creates a `user-content` bucket with appropriate policies
2. Verify the bucket was created by going to Storage in your Supabase dashboard

### 4. Environment Variables

Make sure your application has the following environment variables set:

```
NEXT_PUBLIC_SUPABASE_URL=https://ewivnbozikdxexaowiid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aXZuYm96aWtkeGV4YW93aWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMDQzMjksImV4cCI6MjA2MTg4MDMyOX0.u6F4nZNRh1hJZBN6Di3DSA1RJdeDOSjzOeGzQyQcz58
```

For server-side operations that require elevated privileges, you may also need:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Structure

### Tables

1. **profiles**
   - User profile information
   - Created automatically when a new user signs up

2. **portfolios**
   - Cryptocurrency portfolios created by users
   - Can be public or private

3. **holdings**
   - Individual cryptocurrency holdings within portfolios
   - Tracks quantity, purchase price, and purchase date

4. **transactions**
   - Records of buy, sell, or transfer transactions
   - Includes price, quantity, and transaction date

5. **watchlist**
   - Cryptocurrencies that users are watching
   - Each entry links a user to a specific coin

## Security

The database uses Row Level Security (RLS) to ensure that users can only access their own data or public data. The policies are set up to:

- Allow users to view and edit only their own profiles
- Allow users to view and edit only their own portfolios (unless a portfolio is public)
- Allow users to view and edit only holdings in their own portfolios
- Allow users to view and edit only their own transactions
- Allow users to view and edit only their own watchlist

## API Functions

The application uses the following libraries to interact with the Supabase backend:

- `lib/auth.ts`: Authentication functions (sign up, sign in, sign out)
- `lib/profile.ts`: User profile management
- `lib/portfolio.ts`: Portfolio and holdings management
- `lib/watchlist.ts`: Watchlist management

Refer to these files for the available API functions and their usage.
