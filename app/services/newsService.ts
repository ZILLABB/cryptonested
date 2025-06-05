// Cryptocurrency news service using Crypto Compare News API
// This service provides methods to fetch real-time cryptocurrency news

import { fetchData } from './apiService';

// Base URL for news API
const API_BASE_URL = 'https://api.news.example.com';

// News article interface
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  date: string;
  source: string;
  url: string;
}

// Interface for simplified news article
export interface SimpleNewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string;
  source: string;
  date: string;
  categories: string[];
}

/**
 * Fetch latest cryptocurrency news
 * @param limit Number of news articles to fetch
 * @param categories Categories to filter by (e.g., 'BTC', 'ETH')
 * @returns Promise with array of news articles
 */
export const getLatestNews = async (): Promise<NewsArticle[]> => {
  try {
    const data = await fetchData<NewsArticle[]>(`${API_BASE_URL}/latest`);
    return data;
  } catch (error) {
    console.error('Error fetching latest news:', error);
    throw error;
  }
};

/**
 * Filter news by category
 * @param category Category to filter by (e.g., 'Bitcoin', 'Ethereum', 'DeFi')
 * @param limit Number of news articles to fetch
 * @returns Promise with filtered news articles
 */
export const getNewsByCategory = async (category: string, limit = 20): Promise<SimpleNewsArticle[]> => {
  try {
    // Map common categories to their API equivalents
    const categoryMap: Record<string, string> = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'defi': 'DEFI',
      'nft': 'NFT',
      'regulation': 'Regulation',
      'altcoin': 'Altcoin'
    };

    const apiCategory = categoryMap[category.toLowerCase()] || category;
    return getLatestNews(limit, [apiCategory]);
  } catch (error) {
    console.error(`Error fetching news for category ${category}:`, error);
    throw error;
  }
};

/**
 * Search news by keyword
 * @param query Search query
 * @param limit Number of news articles to fetch
 * @returns Promise with search results
 */
export const searchNews = async (query: string, limit = 20): Promise<SimpleNewsArticle[]> => {
  try {
    // First fetch a larger set of news
    const allNews = await getLatestNews();

    // Then filter by the search query
    const searchTerms = query.toLowerCase().split(' ');

    const filteredNews = allNews.filter(article => {
      const titleLower = article.title.toLowerCase();
      const summaryLower = article.content.toLowerCase();

      return searchTerms.some(term =>
        titleLower.includes(term) || summaryLower.includes(term)
      );
    });

    return filteredNews.slice(0, limit);
  } catch (error) {
    console.error(`Error searching news for "${query}":`, error);
    throw error;
  }
};
