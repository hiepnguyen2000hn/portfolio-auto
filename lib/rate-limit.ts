interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
}

export class MemoryRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(options: RateLimitOptions = {}) {
    this.maxRequests = options.maxRequests ?? 5;
    this.windowMs = options.windowMs ?? 10 * 60 * 1000; // 10 minutes default
  }

  check(key: string): { success: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      const resetTime = now + this.windowMs;
      this.store.set(key, { count: 1, resetTime });
      return {
        success: true,
        remaining: this.maxRequests - 1,
        resetTime,
      };
    }

    if (record.count >= this.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    record.count += 1;
    return {
      success: true,
      remaining: this.maxRequests - record.count,
      resetTime: record.resetTime,
    };
  }

  reset(): void {
    this.store.clear();
  }

  // Helper for tests or manual IP clear
  clearKey(key: string): void {
    this.store.delete(key);
  }
}

// Global in-memory rate limiter for contact form (5 reqs / 10 minutes)
export const contactRateLimiter = new MemoryRateLimiter({
  maxRequests: 5,
  windowMs: 10 * 60 * 1000,
});
