/**
 * Simple in-memory cache for API responses
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number; // Expiry time in milliseconds
}

class Cache {
  private cache: Record<string, CacheItem<any>> = {};
  
  /**
   * Get an item from the cache
   * @param key Cache key
   * @returns Cached data or null if not found or expired
   */
  get<T>(key: string): T | null {
    const item = this.cache[key];
    
    if (!item) {
      return null;
    }
    
    // Check if the item has expired
    if (Date.now() > item.timestamp + item.expiry) {
      this.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  /**
   * Set an item in the cache
   * @param key Cache key
   * @param data Data to cache
   * @param expiry Expiry time in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, expiry: number = 5 * 60 * 1000): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      expiry
    };
  }
  
  /**
   * Delete an item from the cache
   * @param key Cache key
   */
  delete(key: string): void {
    delete this.cache[key];
  }
  
  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache = {};
  }
  
  /**
   * Get a cached value or fetch it if not available
   * @param key Cache key
   * @param fetchFn Function to fetch the data if not in cache
   * @param expiry Expiry time in milliseconds (default: 5 minutes)
   * @returns Cached or fetched data
   */
  async getOrFetch<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    expiry: number = 5 * 60 * 1000
  ): Promise<T> {
    // Try to get from cache first
    const cachedData = this.get<T>(key);
    if (cachedData !== null) {
      console.log(`Cache hit for ${key}`);
      return cachedData;
    }
    
    // Not in cache, fetch it
    console.log(`Cache miss for ${key}, fetching...`);
    const data = await fetchFn();
    
    // Store in cache
    this.set(key, data, expiry);
    
    return data;
  }
}

// Create a singleton instance
export const cache = new Cache();
