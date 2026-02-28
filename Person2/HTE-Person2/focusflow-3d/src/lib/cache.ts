/**
 * 簡單 in-memory 預緩存，供 demo 使用（Person 2, 16-18h）
 * 可鍵值：ingest:<hash>, quiz:<concept>:<difficulty>, explain:<concept>:<mode>, session-summary:<hash>
 */
const store = new Map<string, { data: unknown; expires: number }>();
const TTL_MS = 1000 * 60 * 60; // 1 hour

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry || Date.now() > entry.expires) {
    if (entry) store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function cacheSet(key: string, data: unknown, ttlMs = TTL_MS): void {
  store.set(key, { data, expires: Date.now() + ttlMs });
}

export function cacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`;
}
