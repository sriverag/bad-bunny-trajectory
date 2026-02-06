/**
 * Cache utility layer - no-op when Redis env vars not provided.
 * Ready for Upstash Redis when UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are set.
 */

interface CacheOptions {
  ttl?: number; // seconds
}

class CacheClient {
  private enabled: boolean;

  constructor() {
    this.enabled = !!(
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
    );
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled) return null;
    // TODO: Implement Upstash Redis get
    return null;
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    if (!this.enabled) return;
    // TODO: Implement Upstash Redis set with TTL
  }

  async del(key: string): Promise<void> {
    if (!this.enabled) return;
    // TODO: Implement Upstash Redis del
  }
}

export const cache = new CacheClient();
