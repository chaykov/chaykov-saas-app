import {
  deleteMockPost,
  fetchMockComments,
  fetchMockPost,
} from "@/lib/mockApi";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/posts/$postId/")({
  component: PostDetailIndex,
});

function PostDetailIndex() {
  const { postId } = useParams({ from: "/dashboard/posts/$postId" });
  const navigate = useNavigate();
  const currentUserId = useAuthStore((state) => state.user?.id);

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => fetchMockPost(postId),
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => fetchMockComments(postId),
  });

  //   Delete post
  const deletePostMutation = useMutation({
    mutationFn: async () => deleteMockPost(postId),
    onSuccess: () => {
      navigate({ to: "/dashboard/posts" });
    },
  });

  const authedUser = currentUserId === post?.authorId;

  if (isLoading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Post Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-600">
          Author: {post.authorId} • {post.createdAt}
        </p>
      </div>
      <div>
        {authedUser && (
          <button
            className="flex-1 bg-red-600 px-4 py-2 text-white rounded hover:bg-red-700 disabled:opacity-50"
            onClick={() => deletePostMutation.mutate()}
          >
            {deletePostMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="prose prose-sm max-w-none">{post.content}</div>
      </div>

      {/* Comments Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({comments?.length || 0})
        </h2>

        {/* Add comment form */}

        {/* Comments list */}
        <div className="space-y-4">
          {comments?.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <strong>{comment.authorId}</strong>
                <span className="text-sm text-gray-500">
                  {comment.createdAt}
                </span>
              </div>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Post Stats */}
      <div className="bg-white p-6 rounded-lg shadow flex gap-6">
        <div>
          <p className="text-gray-600 text-sm">Likes</p>
          <p className="text-2xl font-bold">{post.likesCount}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Comments</p>
          <p className="text-2xl font-bold">{post.commentsCount}</p>
        </div>
      </div>
    </div>
  );
}
