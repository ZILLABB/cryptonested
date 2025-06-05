-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE
);

-- Create holdings table
CREATE TABLE IF NOT EXISTS holdings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  coin_id TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  purchase_price DECIMAL,
  purchase_date TIMESTAMP WITH TIME ZONE
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('buy', 'sell', 'transfer')) NOT NULL,
  coin_id TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  price DECIMAL NOT NULL,
  fee DECIMAL,
  notes TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  coin_id TEXT NOT NULL,
  UNIQUE(user_id, coin_id)
);

-- Create storage bucket for user content
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-content', 'user-content', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for user content
CREATE POLICY "User content is publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'user-content');

CREATE POLICY "Users can upload their own content" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'user-content' AND 
  auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can update their own content" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'user-content' AND 
  auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can delete their own content" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'user-content' AND 
  auth.uid() = (storage.foldername(name))[1]::uuid
);

-- Set up RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create policies for portfolios
CREATE POLICY "Users can view their own portfolios" 
ON portfolios FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public portfolios" 
ON portfolios FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can create their own portfolios" 
ON portfolios FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios" 
ON portfolios FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios" 
ON portfolios FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for holdings
CREATE POLICY "Users can view holdings in their portfolios" 
ON holdings FOR SELECT 
USING (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view holdings in public portfolios" 
ON holdings FOR SELECT 
USING (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE is_public = true
  )
);

CREATE POLICY "Users can create holdings in their portfolios" 
ON holdings FOR INSERT 
WITH CHECK (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update holdings in their portfolios" 
ON holdings FOR UPDATE 
USING (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete holdings in their portfolios" 
ON holdings FOR DELETE 
USING (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
);

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON transactions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON transactions FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for watchlist
CREATE POLICY "Users can view their own watchlist" 
ON watchlist FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own watchlist" 
ON watchlist FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist" 
ON watchlist FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (new.id, new.email, now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
