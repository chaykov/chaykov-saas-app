import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/posts/$postId")({
  component: PostDetailLayout,
});

function PostDetailLayout() {
  return (
    <div className="max-w-3xl mx-auto">
      <Outlet />
    </div>
  );
}
