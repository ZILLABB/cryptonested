export const mockPortfolio = {
  totalValue: 37892.45,
  dailyChange: 2.34,
  weeklyChange: -1.23,
  monthlyChange: 8.56,
  allocation: [
    { name: 'Bitcoin', symbol: 'BTC', value: 15345.67, percentage: 40.5, color: '#F7931A' },
    { name: 'Ethereum', symbol: 'ETH', value: 9872.34, percentage: 26.0, color: '#627EEA' },
    { name: 'Solana', symbol: 'SOL', value: 5689.23, percentage: 15.0, color: '#00FFA3' },
    { name: 'USD Coin', symbol: 'USDC', value: 4102.34, percentage: 10.8, color: '#2775CA' },
    { name: 'Cardano', symbol: 'ADA', value: 2882.87, percentage: 7.7, color: '#0033AD' }
  ]
};

export const mockHoldings = [
  { id: 1, name: 'Bitcoin', symbol: 'BTC', quantity: 0.427, price: 35938.21, value: 15345.67, change: 3.2, allocation: 40.5 },
  { id: 2, name: 'Ethereum', symbol: 'ETH', price: 2341.23, quantity: 4.217, value: 9872.34, change: 1.8, allocation: 26.0 },
  { id: 3, name: 'Solana', symbol: 'SOL', price: 94.82, quantity: 60, value: 5689.23, change: 5.6, allocation: 15.0 },
  { id: 4, name: 'USD Coin', symbol: 'USDC', price: 1.00, quantity: 4102.34, value: 4102.34, change: 0.0, allocation: 10.8 },
  { id: 5, name: 'Cardano', symbol: 'ADA', price: 0.44, quantity: 6551.98, value: 2882.87, change: -2.1, allocation: 7.7 }
];

export const mockWatchlist = [
  { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 35938.21, change24h: 3.2, marketCap: '689.4B', volume24h: '28.3B' },
  { id: 2, name: 'Ethereum', symbol: 'ETH', price: 2341.23, change24h: 1.8, marketCap: '281.3B', volume24h: '18.9B' },
  { id: 3, name: 'Solana', symbol: 'SOL', price: 94.82, change24h: 5.6, marketCap: '39.8B', volume24h: '3.1B' },
  { id: 4, name: 'Binance Coin', symbol: 'BNB', price: 341.27, change24h: -0.8, marketCap: '52.4B', volume24h: '1.9B' },
  { id: 5, name: 'XRP', symbol: 'XRP', price: 0.51, change24h: -1.2, marketCap: '27.3B', volume24h: '1.2B' }
];

export const mockTransactions = [
  { id: 1, type: 'Buy', coin: 'Bitcoin', symbol: 'BTC', amount: 0.12, price: 34125.67, value: 4095.08, date: '2025-04-28T14:32:21Z', status: 'Completed' },
  { id: 2, type: 'Sell', coin: 'Ethereum', symbol: 'ETH', amount: 1.5, price: 2289.45, value: 3434.18, date: '2025-04-25T09:15:43Z', status: 'Completed' },
  { id: 3, type: 'Buy', coin: 'Solana', symbol: 'SOL', amount: 25, price: 89.32, value: 2233.00, date: '2025-04-20T18:45:12Z', status: 'Completed' },
  { id: 4, type: 'Transfer', coin: 'USD Coin', symbol: 'USDC', amount: 1000, price: 1.00, value: 1000.00, date: '2025-04-15T11:22:38Z', status: 'Completed' },
  { id: 5, type: 'Buy', coin: 'Cardano', symbol: 'ADA', amount: 2000, price: 0.42, value: 840.00, date: '2025-04-10T16:05:51Z', status: 'Completed' }
];

export const mockNews = [
  {
    id: 1,
    title: 'Bitcoin Reaches New All-Time High Above $70,000',
    summary: 'Bitcoin has surged past $70,000 for the first time in history as institutional adoption continues to increase.',
    source: 'CryptoNews',
    date: '2025-05-02T09:30:00Z',
    url: '#',
    imageUrl: 'https://placehold.co/600x400/png?text=Bitcoin+News'
  },
  {
    id: 2,
    title: 'Ethereum 2.0 Upgrade Completes Final Testnet',
    summary: 'The final testnet for Ethereum\'s transition to proof-of-stake has been successfully completed, with the mainnet upgrade scheduled for next month.',
    source: 'ETH Daily',
    date: '2025-05-01T14:15:00Z',
    url: '#',
    imageUrl: 'https://placehold.co/600x400/png?text=Ethereum+News'
  },
  {
    id: 3,
    title: 'SEC Approves Spot Ethereum ETF Applications',
    summary: 'The U.S. Securities and Exchange Commission has approved multiple spot Ethereum ETF applications, paving the way for institutional investment.',
    source: 'Regulatory Watch',
    date: '2025-04-29T11:45:00Z',
    url: '#',
    imageUrl: 'https://placehold.co/600x400/png?text=SEC+News'
  },
  {
    id: 4,
    title: 'Solana Ecosystem Expands with New DeFi Protocols',
    summary: 'The Solana ecosystem continues to grow with the launch of several new DeFi protocols focused on derivatives and structured products.',
    source: 'DeFi Pulse',
    date: '2025-04-27T16:20:00Z',
    url: '#',
    imageUrl: 'https://placehold.co/600x400/png?text=Solana+News'
  },
  {
    id: 5,
    title: 'Major Banks Launch Blockchain-Based Settlement Platform',
    summary: 'A consortium of global banks has announced the launch of a new blockchain-based settlement platform aimed at reducing cross-border transaction times and costs.',
    source: 'Banking Technology',
    date: '2025-04-25T08:10:00Z',
    url: '#',
    imageUrl: 'https://placehold.co/600x400/png?text=Banking+News'
  }
];

export const mockGainersLosers = {
  gainers: [
    { name: 'Solana', symbol: 'SOL', price: 94.82, change: 5.6 },
    { name: 'Bitcoin', symbol: 'BTC', price: 35938.21, change: 3.2 },
    { name: 'Ethereum', symbol: 'ETH', price: 2341.23, change: 1.8 }
  ],
  losers: [
    { name: 'Cardano', symbol: 'ADA', price: 0.44, change: -2.1 },
    { name: 'XRP', symbol: 'XRP', price: 0.51, change: -1.2 },
    { name: 'Binance Coin', symbol: 'BNB', price: 341.27, change: -0.8 }
  ]
};
