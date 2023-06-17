import rateLimit from "express-rate-limit"

export const rateLimitingMiddleware = rateLimit({
	windowMs: 1000 * 5,
	max: 5,
	message: "Too many attempts",
	standardHeaders: true,
	legacyHeaders: false,
});
