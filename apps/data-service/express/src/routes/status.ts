import express, { Router } from 'express';

const router: Router = express.Router();

const UPTIME_ROBOT_API_KEY = process.env.UPTIME_ROBOT_API_KEY;
const UPTIME_ROBOT_API_URL = 'https://api.uptimerobot.com/v2/getMonitors';

// In-memory cache to reduce UptimeRobot API calls
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000; // 60 seconds cache

/**
 * GET /api/status/monitors
 * Proxy endpoint for UptimeRobot API to avoid CORS issues
 * Includes caching to reduce slow API calls
 */
router.get('/monitors', async (req, res) => {
  if (!UPTIME_ROBOT_API_KEY) {
    return res.status(500).json({
      error: 'UptimeRobot API key is not configured on the server',
    });
  }

  try {
    const monitorIds = req.query.monitors as string;

    if (!monitorIds) {
      return res.status(400).json({
        error: 'monitors query parameter is required',
      });
    }

    // Check cache first
    const cacheKey = monitorIds;
    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log('[Status API] Returning cached data (age: %dms)', now - cached.timestamp);
      return res.json(cached.data);
    }

    console.log('[Status API] Cache miss, fetching from UptimeRobot:', monitorIds);
    const startTime = Date.now();

    const formData = new URLSearchParams();
    formData.append('api_key', UPTIME_ROBOT_API_KEY);
    formData.append('format', 'json');
    formData.append('monitors', monitorIds);
    formData.append('custom_uptime_ratios', '7'); // Last 7 days
    formData.append('response_times', '1');
    formData.append('response_times_average', '180'); // Average over 3 hours

    const response = await fetch(UPTIME_ROBOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`UptimeRobot API returned status: ${response.status}`);
    }

    const data = await response.json();

    const duration = Date.now() - startTime;
    console.log(`[Status API] UptimeRobot responded in ${duration}ms`);

    // Store in cache
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    // Return the data to frontend
    res.json(data);
  } catch (error) {
    console.error('[Status API] Failed to fetch from UptimeRobot:', error);
    res.status(500).json({
      error: 'Failed to fetch monitor statuses',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
