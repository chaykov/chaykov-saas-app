import { createFileRoute } from '@tanstack/react-router';
import { SystemStatus } from '../components/SystemStatus';

export const Route = createFileRoute('/dashboard/status')({
  component: StatusPage,
});

function StatusPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
        <p className="mt-2 text-gray-600">
          Real-time monitoring of all Polytalko services and infrastructure.
        </p>
      </div>

      {/* Status Component */}
      <SystemStatus />

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">About System Status</h3>
        <p className="text-sm text-blue-800">
          Our system status is monitored 24/7 by UptimeRobot. Checks run every 5 minutes to ensure
          all services are operational. You'll see real-time uptime percentages and average response
          times for each service.
        </p>
      </div>
    </div>
  );
}
