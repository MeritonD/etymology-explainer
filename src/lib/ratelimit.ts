import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 60 seconds
export const ratelimit = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "60 s"),
        analytics: true,
        prefix: "@upstash/ratelimit",
    })
    : null;

/**
 * Helper to check rate limit. 
 * If no env vars are set (development), it allows everything.
 */
export async function checkRateLimit(identifier: string) {
    if (!ratelimit) {
        console.warn("Rate Limiting is disabled (Missing UPSTASH Environment Variables)");
        return { success: true };
    }

    return ratelimit.limit(identifier);
}
