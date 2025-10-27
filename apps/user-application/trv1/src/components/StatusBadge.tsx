import { useQuery } from '@tanstack/react-query';
import { fetchMonitorStatuses, getConfiguredMonitors } from '../lib/uptimeRobot';

/**
 * Simple status badge showing system operational status
 * Displays on landing/login page
 */
export function StatusBadge() {
  const monitorIds = getConfiguredMonitors();

  const { data: monitors, isLoading } = useQuery({
    queryKey: ['status-badge'],
    queryFn: () => fetchMonitorStatuses(monitorIds),
    refetchInterval: 60000, // Refresh every 60 seconds
    enabled: monitorIds.length > 0,
    retry: false, // Don't retry on landing page to avoid spam
  });

  // Don't show anything while loading or if not configured
  if (isLoading || !monitors || monitors.length === 0) {
    return null;
  }

  const allUp = monitors.every((m) => m.status === 'up');
  const someDown = monitors.some((m) => m.status === 'down');

  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
          allUp
            ? 'bg-green-50 text-green-700 border border-green-200'
            : someDown
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            allUp ? 'bg-green-500' : someDown ? 'bg-red-500' : 'bg-yellow-500'
          } animate-pulse`}
        />
        <span className="font-medium">
          {allUp ? 'All Systems Operational' : someDown ? 'System Issues Detected' : 'Checking Status...'}
        </span>
      </div>
    </div>
  );
}
