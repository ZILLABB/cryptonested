// Cryptocurrency data service using CoinGecko API
// This service provides methods to fetch real-time cryptocurrency data

import { fetchData } from './apiService';

// Base URL for CoinGecko API
const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Add a timeout to axios requests to prevent hanging
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors gracefully
    if (error.message === 'Network Error') {
      console.error('Network error detected. Falling back to mock data.');
      return Promise.resolve({
        data: null,
        status: 'error',
        message: 'Network Error',
        config: error.config
      });
    }

    // Handle rate limiting
    if (error.response && error.response.status === 429) {
      console.error('Rate limit exceeded. Falling back to mock data.');
      return Promise.resolve({
        data: null,
        status: 'error',
        message: 'Rate Limit Exceeded',
        config: error.config
      });
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Falling back to mock data.');
      return Promise.resolve({
        data: null,
        status: 'error',
        message: 'Request Timeout',
        config: error.config
      });
    }

    return Promise.reject(error);
  }
);

// Mock data for fallback when API fails
const mockMarketData: MarketData = {
  totalMarketCap: 2345678901234,
  totalVolume: 123456789012,
  btcDominance: 42.5,
  ethDominance: 18.3
};

// Interface for cryptocurrency data
export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

// Interface for simplified cryptocurrency data
export interface SimpleCryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  marketCap: string;
  volume24h: string;
  change24h: number;
  sparkline?: number[];
}

// Interface for market data
export interface MarketData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
}

// Interface for top gainers/losers
export interface GainersLosers {
  gainers: SimpleCryptoCoin[];
  losers: SimpleCryptoCoin[];
}

// Interface for popular coins
export interface PopularCoins {
  popular: SimpleCryptoCoin[];
}

/**
 * Fetch top cryptocurrencies by market cap
 * @param limit Number of cryptocurrencies to fetch
 * @param currency Currency to display prices in (default: usd)
 * @returns Promise with array of cryptocurrency data
 */
export const getTopCryptos = async (limit = 50, currency = 'usd'): Promise<SimpleCryptoCoin[]> => {
  try {
    const data = await fetchData<CryptoCoin[]>(`${API_BASE_URL}/coins/markets`, {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: limit,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h'
    });

    return data.map((coin: CryptoCoin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      price: coin.current_price,
      marketCap: formatMarketCap(coin.market_cap),
      volume24h: formatMarketCap(coin.total_volume),
      change24h: parseFloat(coin.price_change_percentage_24h.toFixed(2))
    }));
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    throw error;
  }
};

/**
 * Fetch data for a specific cryptocurrency
 * @param id Cryptocurrency ID (e.g., 'bitcoin')
 * @param currency Currency to display prices in (default: usd)
 * @returns Promise with cryptocurrency data
 */
export const getCryptoById = async (id: string, currency = 'usd'): Promise<any> => {
  try {
    console.log(`Fetching data for ${id} from CoinGecko...`);
    const response = await axiosInstance.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    });

    // Check if we got a network error response from the interceptor
    if (response.status === 'error') {
      console.log(`API error: ${response.message}. Using mock data for ${id}.`);
      return getMockCryptoById(id);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${id}:`, error);
    // Return mock data instead of throwing error
    return getMockCryptoById(id);
  }
};

/**
 * Get mock data for a specific cryptocurrency when API fails
 * @param id Cryptocurrency ID
 * @returns Mock cryptocurrency data
 */
const getMockCryptoById = (id: string): any => {
  // Find the coin in our mock data
  const mockCoins = getMockTopCryptos(50);
  const mockCoin = mockCoins.find(coin => coin.id === id);

  if (mockCoin) {
    return {
      id: mockCoin.id,
      symbol: mockCoin.symbol.toLowerCase(),
      name: mockCoin.name,
      image: {
        large: mockCoin.image,
        small: mockCoin.image,
        thumb: mockCoin.image
      },
      market_data: {
        current_price: {
          usd: mockCoin.price
        },
        market_cap: {
          usd: parseFloat(mockCoin.marketCap.replace(/[^0-9.]/g, '')) * (mockCoin.marketCap.includes('B') ? 1000000000 : mockCoin.marketCap.includes('M') ? 1000000 : 1)
        },
        total_volume: {
          usd: parseFloat(mockCoin.volume24h.replace(/[^0-9.]/g, '')) * (mockCoin.volume24h.includes('B') ? 1000000000 : mockCoin.volume24h.includes('M') ? 1000000 : 1)
        },
        price_change_percentage_24h: mockCoin.change24h,
        price_change_percentage_7d_in_currency: {
          usd: mockCoin.change24h * 1.5 // Simulate 7d change
        },
        price_change_percentage_30d_in_currency: {
          usd: mockCoin.change24h * 2 // Simulate 30d change
        },
        price_change_percentage_1y_in_currency: {
          usd: mockCoin.change24h * 5 // Simulate 1y change
        },
        circulating_supply: Math.random() * 100000000,
        total_supply: Math.random() * 200000000,
        max_supply: Math.random() * 300000000
      },
      description: {
        en: `This is a mock description for ${mockCoin.name} generated because the API request failed.`
      },
      links: {
        homepage: ["https://example.com"],
        blockchain_site: ["https://example.com"],
        official_forum_url: ["https://example.com"],
        chat_url: ["https://example.com"],
        twitter_screen_name: "example",
        facebook_username: "example",
        telegram_channel_identifier: "example",
        subreddit_url: "https://reddit.com/r/example"
      }
    };
  }

  // If we don't have this coin in our mock data, create a generic one
  return {
    id: id,
    symbol: id.substring(0, 3).toUpperCase(),
    name: id.charAt(0).toUpperCase() + id.slice(1),
    image: {
      large: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      small: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      thumb: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png"
    },
    market_data: {
      current_price: {
        usd: 100.00
      },
      market_cap: {
        usd: 1000000000
      },
      total_volume: {
        usd: 50000000
      },
      price_change_percentage_24h: 1.5,
      price_change_percentage_7d_in_currency: {
        usd: 2.5
      },
      price_change_percentage_30d_in_currency: {
        usd: 5.0
      },
      price_change_percentage_1y_in_currency: {
        usd: 10.0
      },
      circulating_supply: 10000000,
      total_supply: 20000000,
      max_supply: 30000000
    },
    description: {
      en: `This is a mock description for ${id} generated because the API request failed.`
    },
    links: {
      homepage: ["https://example.com"],
      blockchain_site: ["https://example.com"],
      official_forum_url: ["https://example.com"],
      chat_url: ["https://example.com"],
      twitter_screen_name: "example",
      facebook_username: "example",
      telegram_channel_identifier: "example",
      subreddit_url: "https://reddit.com/r/example"
    }
  };
};

/**
 * Get top gainers and losers in the last 24 hours
 * @param limit Number of gainers/losers to fetch
 * @param currency Currency to display prices in (default: usd)
 * @returns Promise with gainers and losers data
 */
export const getGainersLosers = async (limit = 5, currency = 'usd'): Promise<GainersLosers> => {
  try {
    console.log('Fetching gainers/losers...');
    // Fetch top 100 coins to have a good sample for gainers/losers
    const coins = await getTopCryptos(100, currency);

    // If we got no coins, return mock data
    if (!coins || coins.length === 0) {
      console.log('No coins returned for gainers/losers. Using mock data.');
      return getMockGainersLosers(limit);
    }

    // Sort by price change percentage
    const sortedByChange = [...coins].sort((a, b) => b.change24h - a.change24h);

    return {
      gainers: sortedByChange.slice(0, limit),
      losers: sortedByChange.slice(-limit).reverse()
    };
  } catch (error) {
    console.error('Error fetching gainers/losers:', error);

    // Return mock data instead of throwing error
    console.log('Using mock gainers/losers data as fallback');
    return getMockGainersLosers(limit);
  }
};

/**
 * Get mock data for gainers and losers when API fails
 * @param limit Number of gainers/losers to return
 * @returns Mock gainers and losers data
 */
const getMockGainersLosers = (limit: number = 5): GainersLosers => {
  return {
    gainers: [
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        price: 123.45,
        marketCap: '$53.21B',
        volume24h: '$2.34B',
        change24h: 8.76
      },
      {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
        price: 0.54,
        marketCap: '$19.87B',
        volume24h: '$765.43M',
        change24h: 5.43
      },
      {
        id: 'avalanche-2',
        symbol: 'AVAX',
        name: 'Avalanche',
        image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
        price: 34.21,
        marketCap: '$12.43B',
        volume24h: '$765.43M',
        change24h: 4.87
      },
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        price: 65432.10,
        marketCap: '$1.23T',
        volume24h: '$45.67B',
        change24h: 3.45
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        price: 3456.78,
        marketCap: '$415.67B',
        volume24h: '$23.45B',
        change24h: 2.34
      }
    ].slice(0, limit),
    losers: [
      {
        id: 'dogecoin',
        symbol: 'DOGE',
        name: 'Dogecoin',
        image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
        price: 0.12,
        marketCap: '$17.65B',
        volume24h: '$876.54M',
        change24h: -3.21
      },
      {
        id: 'polkadot',
        symbol: 'DOT',
        name: 'Polkadot',
        image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
        price: 6.78,
        marketCap: '$9.87B',
        volume24h: '$432.10M',
        change24h: -2.34
      },
      {
        id: 'chainlink',
        symbol: 'LINK',
        name: 'Chainlink',
        image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
        price: 12.34,
        marketCap: '$6.54B',
        volume24h: '$321.09M',
        change24h: -1.98
      },
      {
        id: 'uniswap',
        symbol: 'UNI',
        name: 'Uniswap',
        image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
        price: 5.67,
        marketCap: '$4.32B',
        volume24h: '$210.98M',
        change24h: -1.76
      },
      {
        id: 'binancecoin',
        symbol: 'BNB',
        name: 'BNB',
        image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
        price: 341.27,
        marketCap: '$52.4B',
        volume24h: '$1.9B',
        change24h: -0.87
      }
    ].slice(0, limit)
  };
};

/**
 * Get global market data
 * @returns Promise with market data
 */
export const getMarketData = async (): Promise<MarketData> => {
  try {
    console.log('Fetching market data from CoinGecko...');
    const response = await axiosInstance.get('/global');

    // Check if we got a network error response from the interceptor
    if (response.status === 'error') {
      console.log(`API error: ${response.message}. Using mock data.`);
      return mockMarketData;
    }

    const data = response.data.data;

    return {
      totalMarketCap: data.total_market_cap.usd,
      totalVolume: data.total_volume.usd,
      btcDominance: parseFloat(data.market_cap_percentage.btc.toFixed(2)),
      ethDominance: parseFloat(data.market_cap_percentage.eth.toFixed(2))
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    console.log('Using mock market data as fallback');
    // Return mock data instead of throwing error
    return mockMarketData;
  }
};

/**
 * Get popular cryptocurrencies
 * @param limit Number of popular coins to fetch
 * @param currency Currency to display prices in (default: usd)
 * @returns Promise with popular coins data
 */
export const getPopularCoins = async (limit = 6, currency = 'usd'): Promise<SimpleCryptoCoin[]> => {
  // List of popular coin IDs
  const popularCoinIds = [
    'bitcoin',
    'ethereum',
    'binancecoin',
    'ripple',
    'cardano',
    'solana',
    'polkadot',
    'dogecoin',
    'avalanche-2',
    'tron',
    'chainlink',
    'uniswap'
  ];

  try {
    // Fetch data for these specific coins
    console.log('Fetching popular coins from CoinGecko...');
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: currency,
        ids: popularCoinIds.join(','),
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });

    // Check if we got a network error response from the interceptor
    if (response.status === 'error') {
      console.log(`API error: ${response.message}. Using mock data.`);
      return getMockPopularCoins(limit);
    }

    // Process the successful response
    return response.data.map((coin: CryptoCoin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      price: coin.current_price,
      marketCap: formatMarketCap(coin.market_cap),
      volume24h: formatMarketCap(coin.total_volume),
      change24h: parseFloat(coin.price_change_percentage_24h.toFixed(2))
    }));
  } catch (error) {
    console.error('Error fetching popular coins:', error);

    // Return mock data as fallback
    return getMockPopularCoins(limit);
  }
};

/**
 * Get mock data for popular coins when API fails
 * @param limit Number of cryptocurrencies to return
 * @returns Mock cryptocurrency data
 */
const getMockPopularCoins = (limit: number = 6): SimpleCryptoCoin[] => {
  const mockCoins = [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      price: 35938.21,
      marketCap: '$689.4B',
      volume24h: '$28.3B',
      change24h: 3.2
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      price: 2341.23,
      marketCap: '$281.3B',
      volume24h: '$18.9B',
      change24h: 1.8
    },
    {
      id: 'binancecoin',
      symbol: 'BNB',
      name: 'Binance Coin',
      image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
      price: 341.27,
      marketCap: '$52.4B',
      volume24h: '$1.9B',
      change24h: -0.8
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      price: 94.82,
      marketCap: '$39.8B',
      volume24h: '$3.1B',
      change24h: 5.6
    },
    {
      id: 'ripple',
      symbol: 'XRP',
      name: 'XRP',
      image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      price: 0.51,
      marketCap: '$27.3B',
      volume24h: '$1.2B',
      change24h: -1.2
    },
    {
      id: 'cardano',
      symbol: 'ADA',
      name: 'Cardano',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      price: 0.44,
      marketCap: '$15.6B',
      volume24h: '$0.9B',
      change24h: -2.1
    },
    {
      id: 'dogecoin',
      symbol: 'DOGE',
      name: 'Dogecoin',
      image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
      price: 0.12,
      marketCap: '$17.65B',
      volume24h: '$876.54M',
      change24h: -3.21
    },
    {
      id: 'polkadot',
      symbol: 'DOT',
      name: 'Polkadot',
      image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
      price: 6.78,
      marketCap: '$9.87B',
      volume24h: '$432.10M',
      change24h: -2.34
    }
  ];

  return mockCoins.slice(0, limit);
};

/**
 * Format market cap value
 * @param value Market cap value
 * @returns Formatted market cap string
 */
export const formatMarketCap = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
};
