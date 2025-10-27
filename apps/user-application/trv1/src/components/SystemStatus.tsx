import { useQuery } from '@tanstack/react-query';
import { fetchMonitorStatuses, getConfiguredMonitors } from '../lib/uptimeRobot';
import type { MonitorStatus } from '../types/uptime';

interface StatusBadgeProps {
  status: MonitorStatus['status'];
}

function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<MonitorStatus['status'], { bg: string; text: string; dot: string }> = {
    up: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      dot: 'bg-green-500',
    },
    down: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500',
    },
    paused: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      dot: 'bg-yellow-500',
    },
    unknown: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      dot: 'bg-gray-500',
    },
  };

  const style = styles[status];
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
      {label}
    </span>
  );
}

interface MonitorCardProps {
  monitor: MonitorStatus;
}

function MonitorCard({ monitor }: MonitorCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">{monitor.name}</h3>
          <StatusBadge status={monitor.status} />
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="text-right">
          <p className="text-gray-500">Uptime (7d)</p>
          <p className="font-semibold text-gray-900">{monitor.uptime}%</p>
        </div>

        <div className="text-right">
          <p className="text-gray-500">Ping</p>
          <p className="font-semibold text-gray-900">
            {monitor.responseTime !== undefined && monitor.responseTime > 0
              ? `${Math.round(monitor.responseTime)}ms`
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SystemStatus() {
  const monitorIds = getConfiguredMonitors();

  const { data: monitors, isLoading, error } = useQuery({
    queryKey: ['system-status'],
    queryFn: () => fetchMonitorStatuses(monitorIds),
    refetchInterval: 60000, // Refresh every 60 seconds
    enabled: monitorIds.length > 0,
  });

  if (monitorIds.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">System status monitoring is not configured.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load system status. Please try again later.</p>
      </div>
    );
  }

  if (!monitors || monitors.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No monitors found.</p>
      </div>
    );
  }

  const allUp = monitors.every((m) => m.status === 'up');

  return (
    <div className="space-y-4">
      {/* Overall Status Header */}
      <div className={`p-4 rounded-lg border-2 ${allUp ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${allUp ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          <h2 className={`text-lg font-bold ${allUp ? 'text-green-900' : 'text-red-900'}`}>
            {allUp ? 'All Systems Operational' : 'Some Systems Experiencing Issues'}
          </h2>
        </div>
      </div>

      {/* Monitor Cards */}
      <div className="space-y-3">
        {monitors.map((monitor) => (
          <MonitorCard key={monitor.id} monitor={monitor} />
        ))}
      </div>

      {/* Last Updated */}
      <p className="text-xs text-gray-500 text-center">
        Last updated: {new Date().toLocaleTimeString()} • Auto-refreshes every minute
      </p>
    </div>
  );
}
