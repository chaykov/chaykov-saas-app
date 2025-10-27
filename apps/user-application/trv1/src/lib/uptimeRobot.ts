import type { UptimeRobotResponse, MonitorStatus } from '../types/uptime';
import { MONITOR_STATUS } from '../types/uptime';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch monitor statuses from UptimeRobot API via our backend proxy
 */
export async function fetchMonitorStatuses(monitorIds: string[]): Promise<MonitorStatus[]> {
  if (!API_URL) {
    console.error('API URL is not configured');
    return [];
  }

  console.log('[UptimeRobot] Starting fetch for monitors:', monitorIds);
  const startTime = Date.now();

  try {
    // Use our backend proxy endpoint to avoid CORS issues
    const url = `${API_URL}/status/monitors?monitors=${monitorIds.join('-')}`;

    console.log('[UptimeRobot] Sending request to backend:', url);

    // Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // 35 second timeout (UptimeRobot API is slow)

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[UptimeRobot] Response received:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UptimeRobotResponse = await response.json();

    console.log('[UptimeRobot] Data parsed:', data);

    if (data.stat !== 'ok') {
      throw new Error(`UptimeRobot API returned error status: ${JSON.stringify(data)}`);
    }

    const duration = Date.now() - startTime;
    console.log(`[UptimeRobot] Fetch completed in ${duration}ms`);

    if (!data.monitors || data.monitors.length === 0) {
      console.warn('[UptimeRobot] No monitors returned from API');
      return [];
    }

    return data.monitors.map((monitor) => {
      let status: MonitorStatus['status'] = 'unknown';

      switch (monitor.status) {
        case MONITOR_STATUS.UP:
          status = 'up';
          break;
        case MONITOR_STATUS.DOWN:
        case MONITOR_STATUS.SEEMS_DOWN:
          status = 'down';
          break;
        case MONITOR_STATUS.PAUSED:
          status = 'paused';
          break;
        default:
          status = 'unknown';
      }

      // Get response time from average_response_time field
      // UptimeRobot returns it as a string (e.g., "123.456")
      const responseTime = monitor.average_response_time
        ? parseFloat(monitor.average_response_time)
        : undefined;

      // Only include responseTime if it's a valid number > 0
      const validResponseTime = responseTime && responseTime > 0 ? responseTime : undefined;

      return {
        id: monitor.id.toString(),
        name: monitor.friendly_name,
        url: monitor.url,
        status,
        uptime: monitor.custom_uptime_ratio || monitor.all_time_uptime_ratio,
        responseTime: validResponseTime,
      };
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[UptimeRobot] Request timed out after ${duration}ms`);
    } else {
      console.error(`[UptimeRobot] Failed to fetch monitor statuses after ${duration}ms:`, error);
    }
    return [];
  }
}

/**
 * Get configured monitor IDs from environment
 */
export function getConfiguredMonitors(): string[] {
  const monitors = [
    import.meta.env.VITE_UPTIME_ROBOT_MONITOR_HOMEPAGE,
    import.meta.env.VITE_UPTIME_ROBOT_MONITOR_API,
    import.meta.env.VITE_UPTIME_ROBOT_MONITOR_WWW,
    import.meta.env.VITE_UPTIME_ROBOT_MONITOR_BACKEND_HEALTH,
  ];

  return monitors.filter(Boolean);
}
