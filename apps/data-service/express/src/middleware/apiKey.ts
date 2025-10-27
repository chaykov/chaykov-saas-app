import { Request, Response, NextFunction } from "express";

/**
 * Middleware to verify API key from request headers
 * Expects 'x-api-key' header to match API_KEY env variable
 */
export const verifyApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.API_KEY;

  // Skip API key check if not configured (for backward compatibility)
  if (!validApiKey) {
    return next();
  }

  if (!apiKey) {
    res.status(401).json({
      error: "Unauthorized",
      message: "API key is required",
    });
    return;
  }

  if (apiKey !== validApiKey) {
    res.status(403).json({
      error: "Forbidden",
      message: "Invalid API key",
    });
    return;
  }

  next();
};
