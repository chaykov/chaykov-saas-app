// UptimeRobot API Types

export interface UptimeRobotMonitor {
  id: number;
  friendly_name: string;
  url: string;
  status: number; // 0=paused, 1=not checked yet, 2=up, 8=seems down, 9=down
  all_time_uptime_ratio: string; // e.g., "99.98"
  custom_uptime_ratio: string; // e.g., "100.00"
  average_response_time: string; // e.g., "123" (in milliseconds)
  response_times: Array<{
    datetime: number;
    value: number;
  }>;
}

export interface UptimeRobotResponse {
  stat: string; // "ok" or "fail"
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  monitors: UptimeRobotMonitor[];
}

export interface MonitorStatus {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'paused' | 'unknown';
  uptime: string;
  responseTime?: number;
}

export const MONITOR_STATUS = {
  PAUSED: 0,
  NOT_CHECKED_YET: 1,
  UP: 2,
  SEEMS_DOWN: 8,
  DOWN: 9,
} as const;
