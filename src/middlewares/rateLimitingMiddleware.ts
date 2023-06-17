import rateLimit from "express-rate-limit"

export const rateLimitingMiddleware = rateLimit({
	windowMs: 1000 * 10,
	max: 6,
	message: "Too many attempts",
	standardHeaders: true,
	legacyHeaders: false,
});
