const cache = new Map<string, { data: any; expires: number }>();

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache(key: string, data: any, ttl = DEFAULT_TTL) {
  cache.set(key, { data, expires: Date.now() + ttl });
  if (cache.size > 200) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}

export async function cached<T>(key: string, fn: () => Promise<T>, ttl = DEFAULT_TTL): Promise<T> {
  const hit = getCached<T>(key);
  if (hit !== null) return hit;
  const result = await fn();
  setCache(key, result, ttl);
  return result;
}
