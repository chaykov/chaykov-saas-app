import { useState } from "react";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/formatters";

export const Route = createFileRoute("/dashboard/posts/$postId/")({
  component: PostDetailIndex,
});

function PostDetailIndex() {
  const { postId } = useParams({ from: "/dashboard/posts/$postId" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => apiClient.getPost(postId),
  });

  //   Delete post
  const deletePostMutation = useMutation({
    mutationFn: async () => apiClient.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate({ to: "/dashboard/posts" });
    },
  });

  // Update post
  const updatePostMutation = useMutation({
    mutationFn: async (content: string) => apiClient.updatePost(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsEditing(false);
      toast.success("Post updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update post");
    },
  });

  if (isLoading) return <div className="p-4">Loading post...</div>;
  if (error)
    return <div className="p-4 text-red-600">Error: {error.message}</div>;
  if (!post) return <div className="p-4">Post not found</div>;

  const authedUser = user?.id === String(post?.authorId);
  const comments = post?.comments || [];
  const author = post?.author;

  // Parse title and content from post.content
  // If content contains "\n\n", split it into title and content
  const contentParts = post.content.split('\n\n');
  const title = contentParts.length > 1 ? contentParts[0] : null;
  const content = contentParts.length > 1 ? contentParts.slice(1).join('\n\n') : post.content;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Post Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {title && (
              <h1 className="text-3xl font-bold mb-4">{title}</h1>
            )}
            <p className="text-gray-600 text-sm">
              Author: {author?.username || `User ${post.authorId}`} •{" "}
              {formatDate(post.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            {authedUser && (
              <>
                <button
                  className="bg-blue-600 px-4 py-2 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => {
                    setEditContent(post.content);
                    setIsEditing(true);
                  }}
                  disabled={deletePostMutation.isPending}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  onClick={() => deletePostMutation.mutate()}
                  disabled={deletePostMutation.isPending}
                >
                  {deletePostMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
              placeholder="Edit your post content..."
              disabled={updatePostMutation.isPending}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => updatePostMutation.mutate(editContent)}
                className="bg-blue-600 px-4 py-2 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={updatePostMutation.isPending}
              >
                {updatePostMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 px-4 py-2 text-gray-800 rounded hover:bg-gray-400"
                disabled={updatePostMutation.isPending}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({comments.length})
        </h2>

        {/* Add comment form */}

        {/* Comments list */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment: any) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <strong>
                    {comment.author?.username || `User ${comment.authorId}`}
                  </strong>
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-800">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        )}
      </div>

      {/* Post Stats */}
      <div className="bg-white p-6 rounded-lg shadow flex gap-6">
        <div>
          <p className="text-gray-600 text-sm">Comments</p>
          <p className="text-2xl font-bold">{comments.length}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Created</p>
          <p className="text-sm font-semibold">{formatDate(post.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
