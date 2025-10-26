import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import { formatDate } from "@/lib/formatters";
import { MessageSquare, Calendar, Mail } from "@/components/icons";

export const Route = createFileRoute("/dashboard/users/$userId/")({
  component: UserDetailIndex,
});

function UserDetailIndex() {
  const { userId } = useParams({ from: "/dashboard/users/$userId" });
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => apiClient.getUser(userId),
  });

  if (isLoading) return <div className="p-4">Loading user profile...</div>;
  if (error)
    return <div className="p-4 text-red-600">Error: {error.message}</div>;
  if (!user) return <div className="p-4">User not found</div>;

  const posts = user?.posts || [];
  const comments = user?.comments || [];

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <div className="bg-white p-8 rounded-lg shadow">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.username}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar size={14} />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        {user.bio && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Bio</h3>
            <p className="text-gray-600">{user.bio}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{posts.length}</p>
            <p className="text-gray-600 text-sm">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{comments.length}</p>
            <p className="text-gray-600 text-sm">Comments</p>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare size={24} />
          Posts ({posts.length})
        </h2>

        {posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post: any) => (
              <div
                key={post.id}
                className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                onClick={() => navigate({ to: `/dashboard/posts/${post.id}` })}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {post.comments?.length || 0} comments
                  </span>
                </div>
                <p className="text-gray-800 line-clamp-3">{post.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No posts yet</p>
        )}
      </div>

      {/* User Comments */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">
          Recent Comments ({comments.length})
        </h2>

        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.slice(0, 10).map((comment: any) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                  <button
                    onClick={() => navigate({ to: `/dashboard/posts/${comment.postId}` })}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View post
                  </button>
                </div>
                <p className="text-gray-800">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No comments yet</p>
        )}
      </div>
    </div>
  );
}
