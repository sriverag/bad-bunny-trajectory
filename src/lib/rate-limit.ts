const rateMap = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

// Auto-cleanup expired entries every 60s
setInterval(() => {
  const now = Date.now();
  rateMap.forEach((value, key) => {
    if (now > value.resetAt) {
      rateMap.delete(key);
    }
  });
}, 60_000).unref?.();

export function rateLimit(ip: string): {
  success: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + WINDOW_MS;
    rateMap.set(ip, { count: 1, resetAt });
    return { success: true, remaining: MAX_REQUESTS - 1, resetAt };
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return {
    success: true,
    remaining: MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
  };
}
