import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import { formatDate } from "@/lib/formatters";

export const Route = createFileRoute("/dashboard/posts/")({
  component: PostIndex,
});

function PostIndex() {
  const navigate = useNavigate();
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: apiClient.getPosts,
  });

  if (isLoading) return <div className="p-4">Loading posts...</div>;
  if (error)
    return (
      <div className="p-4 text-red-600">
        Error loading posts: {error.message}
      </div>
    );
  if (!posts || posts.length === 0)
    return <div className="p-4">No posts found</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>
        <div className="gap-2 flex">
          {/* Refresh posts */}
          {/* <button
            className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 flex gap-2 items-center"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw
              size={18}
              className={`${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </button> */}

          {/* Create post */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => navigate({ to: "/dashboard/posts/create" })}
          >
            New post
          </button>
        </div>
      </div>

      {/* Posts list */}
      <div className="space-x-2 space-y-2">
        {posts?.map((post: any) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-md shadow-xs hover:shadow-md cursor-pointer transition"
            onClick={() => navigate({ to: `/dashboard/posts/${post.id}` })}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">
                {formatDate(post.createdAt)}
              </span>
            </div>
            <p className="text-gray-700 mb-3">{post.content}</p>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">
                Author: {post.author?.username || `User ${post.authorId}`}
              </p>
              <p className="text-sm text-gray-500">
                Comments: {post.comments?.length || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
