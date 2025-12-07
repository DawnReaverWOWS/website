// Simple in-memory cache for API responses

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const cache = new SimpleCache();

// Cache duration constants (in milliseconds)
export const CACHE_DURATION = {
  CLAN_INFO: 30 * 60 * 1000,      // 30 minutes
  MEMBER_LIST: 15 * 60 * 1000,    // 15 minutes
  PLAYER_STATS: 5 * 60 * 1000,    // 5 minutes
  STATIC_DATA: 24 * 60 * 60 * 1000, // 24 hours
};
