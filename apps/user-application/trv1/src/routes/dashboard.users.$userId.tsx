import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/users/$userId")({
  component: UserDetailLayout,
});

function UserDetailLayout() {
  return (
    <div className="max-w-4xl mx-auto">
      <Outlet />
    </div>
  );
}
