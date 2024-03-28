// Importing the Ratelimit class from @upstash/ratelimit package for rate limiting functionality.
import { Ratelimit } from "@upstash/ratelimit"
// Importing the Redis class from @upstash/redis package to interact with the Redis data store.
import { Redis } from "@upstash/redis"

// Asynchronously enforce a rate limit for a particular identifier (e.g., user IP or user ID).
export async function rateLimit(identifier: string) {
	// Create an instance of Ratelimit with the desired configuration.
	const ratelimit = new Ratelimit({
		// Initialize Redis client with environment variables configuration.
		redis: Redis.fromEnv(),
		// Set up the rate limiter with a sliding window algorithm allowing 10 requests per 10 seconds.
		limiter: Ratelimit.slidingWindow(10, "10 s"),
		// Enable analytics to track rate limiting events.
		analytics: true,
		// Configure a prefix for the Redis keys to avoid collisions with other keys.
		prefix: "@upstash/ratelimit",
	})

	// Perform the actual rate limiting check for the identifier and return the result.
	// The result indicates if the current request is allowed or if the rate limit has been exceeded.
	return await ratelimit.limit(identifier)
}
