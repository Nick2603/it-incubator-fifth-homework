import rateLimit from "express-rate-limit"

export const createRateLimitingMiddleware = (windowMs: number, max: number) => rateLimit({
	windowMs,
	max,
	message: "Too many attempts",
	standardHeaders: true,
	legacyHeaders: false,
});
