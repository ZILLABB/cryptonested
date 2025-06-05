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

-- Create portfolio snapshots table for historical tracking
CREATE TABLE IF NOT EXISTS portfolio_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    total_value DECIMAL(20, 8) NOT NULL DEFAULT 0,
    total_cost DECIMAL(20, 8) NOT NULL DEFAULT 0,
    profit_loss DECIMAL(20, 8) NOT NULL DEFAULT 0,
    profit_percentage DECIMAL(10, 4) NOT NULL DEFAULT 0,
    snapshot_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staking plans table
CREATE TABLE IF NOT EXISTS staking_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    apy DECIMAL(5, 2) NOT NULL,
    lock_period_days INTEGER NOT NULL DEFAULT 0,
    minimum_amount DECIMAL(20, 8) NOT NULL DEFAULT 0,
    maximum_amount DECIMAL(20, 8),
    supported_coins TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staking positions table
CREATE TABLE IF NOT EXISTS staking_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    staking_plan_id UUID REFERENCES staking_plans(id) ON DELETE CASCADE NOT NULL,
    coin_id TEXT NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT CHECK (status IN ('active', 'completed', 'withdrawn', 'cancelled')) NOT NULL DEFAULT 'active',
    total_rewards DECIMAL(20, 8) NOT NULL DEFAULT 0,
    last_reward_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staking rewards table
CREATE TABLE IF NOT EXISTS staking_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    staking_position_id UUID REFERENCES staking_positions(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    reward_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    apy_rate DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_portfolio_date
ON portfolio_snapshots(portfolio_id, snapshot_date);

CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_date
ON portfolio_snapshots(snapshot_date);

-- Enable RLS for portfolio snapshots
ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolio snapshots
CREATE POLICY "Users can view snapshots of their portfolios"
ON portfolio_snapshots FOR SELECT
USING (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view snapshots of public portfolios"
ON portfolio_snapshots FOR SELECT
USING (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE is_public = true
  )
);

CREATE POLICY "Users can create snapshots for their portfolios"
ON portfolio_snapshots FOR INSERT
WITH CHECK (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete snapshots of their portfolios"
ON portfolio_snapshots FOR DELETE
USING (
  portfolio_id IN (
    SELECT id FROM portfolios WHERE user_id = auth.uid()
  )
);

-- Create indexes for staking tables
CREATE INDEX IF NOT EXISTS idx_staking_positions_user_id ON staking_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_staking_positions_status ON staking_positions(status);
CREATE INDEX IF NOT EXISTS idx_staking_positions_coin_id ON staking_positions(coin_id);
CREATE INDEX IF NOT EXISTS idx_staking_rewards_position_id ON staking_rewards(staking_position_id);
CREATE INDEX IF NOT EXISTS idx_staking_rewards_date ON staking_rewards(reward_date);

-- Enable RLS for staking tables
ALTER TABLE staking_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies for staking plans (public read access)
CREATE POLICY "Anyone can view active staking plans"
ON staking_plans FOR SELECT
USING (is_active = true);

-- Create policies for staking positions
CREATE POLICY "Users can view their own staking positions"
ON staking_positions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own staking positions"
ON staking_positions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own staking positions"
ON staking_positions FOR UPDATE
USING (auth.uid() = user_id);

-- Create policies for staking rewards
CREATE POLICY "Users can view rewards for their staking positions"
ON staking_rewards FOR SELECT
USING (
  staking_position_id IN (
    SELECT id FROM staking_positions WHERE user_id = auth.uid()
  )
);

CREATE POLICY "System can create staking rewards"
ON staking_rewards FOR INSERT
WITH CHECK (true); -- This will be restricted to service role in practice

-- Insert default staking plans
INSERT INTO staking_plans (name, apy, lock_period_days, minimum_amount, supported_coins) VALUES
('Flexible Staking', 4.00, 0, 100, ARRAY['bitcoin', 'ethereum', 'cardano', 'solana', 'polkadot', 'chainlink', 'litecoin', 'stellar', 'dogecoin', 'polygon', 'avalanche', 'cosmos', 'algorand', 'tezos', 'uniswap']),
('Standard Staking', 8.00, 90, 100, ARRAY['bitcoin', 'ethereum', 'cardano', 'solana', 'polkadot', 'chainlink', 'litecoin', 'stellar', 'dogecoin', 'polygon', 'avalanche', 'cosmos', 'algorand', 'tezos', 'uniswap', 'aave', 'compound', 'maker', 'synthetix', 'yearn-finance']),
('Premium Staking', 12.00, 365, 100, ARRAY['bitcoin', 'ethereum', 'cardano', 'solana', 'polkadot', 'chainlink', 'litecoin', 'stellar', 'dogecoin', 'polygon', 'avalanche', 'cosmos', 'algorand', 'tezos', 'uniswap', 'aave', 'compound', 'maker', 'synthetix', 'yearn-finance'])
ON CONFLICT DO NOTHING;
