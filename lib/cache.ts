// Simple in-memory cache implementation without external dependencies
interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private maxSize: number;

  constructor(maxSize: number = 500) {
    this.maxSize = maxSize;
  }

  set(key: string, value: T, ttl: number = 300000): void { // default 5 minutes
    // Remove expired items and enforce size limit
    this.cleanup();
    
    if (this.cache.size >= this.maxSize) {
      // Remove oldest item
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) {
      return undefined;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  size(): number {
    this.cleanup();
    return this.cache.size;
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

// Create cache instances for different data types
const venueCache = new SimpleCache<any>(500);
const listingCache = new SimpleCache<any>(1000);
const searchCache = new SimpleCache<any>(200);

export { venueCache, listingCache, searchCache };

// In-memory request deduplication
const pendingRequests = new Map<string, Promise<any>>();

export function withDeduplication<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = fn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}
