interface CacheEntry {
  response: string;
  timestamp: number;
}

const cache: { [key: string]: CacheEntry } = {};
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

export function cacheResponse(prompt: string, response: string): void {
  cache[prompt] = {
    response,
    timestamp: Date.now(),
  };
}

export function getCachedResponse(prompt: string): string | null {
  const entry = cache[prompt];
  if (entry && Date.now() - entry.timestamp < CACHE_EXPIRY) {
    return entry.response;
  }
  return null;
}