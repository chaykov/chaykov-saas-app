import { fetchMockPosts } from "@/lib/mockApi";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/posts/")({
  component: PostIndex,
});

function PostIndex() {
  const navigate = useNavigate();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchMockPosts,
  });

  if (isLoading) return <div>Loading posts...</div>;

  return (
    <div className="space-y-4">
      {/* Create post */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => navigate({ to: "/dashboard/posts/create" })}
        >
          New post
        </button>
      </div>

      {/* Posts list */}
      <div className="space-x-2 space-y-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-md shadow-xs hover:shadow-md cursor-pointer transition"
            onClick={() => navigate({ to: `/dashboard/posts/${post.id}` })}
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <span className="text-sm text-gray-500">{post.createdAt}</span>
            </div>
            <p className="text-gray-700 mb-3">{post.content}</p>
            <p className="text-sm text-gray-500">Author: {post.authorId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
