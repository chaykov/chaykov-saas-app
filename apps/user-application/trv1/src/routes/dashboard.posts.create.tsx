import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { toast } from "sonner";

import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/dashboard/posts/create")({
  component: CreatePost,
});

function CreatePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    if (!user?.id) {
      toast.error("You must be logged in to create a post");
      return;
    }

    try {
      setIsLoading(true);

      // Combine title and content for the backend (which only has content field)
      const postContent = title.trim()
        ? `${title.trim()}\n\n${content.trim()}`
        : content.trim();

      const authorId = parseInt(user.id);

      const newPost = await apiClient.createPost(postContent, authorId);

      toast.success("Post has been created!", {
        description: `ID: ${newPost.id}`,
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });

      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate({ to: "/dashboard/posts" });
    } catch (error) {
      toast.error("Error while creating a new post");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      // Jeśli user wpisał coś, pokaż warning
      if (
        window.confirm("Na pewno chcesz anulować? Zmiany zostaną utracone.")
      ) {
        navigate({ to: "/dashboard/posts" });
      }
    } else {
      navigate({ to: "/dashboard/posts" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dodaj nowy post</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Tytuł</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Wpisz tytuł postu"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Zawartość</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Wpisz zawartość postu"
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">{content.length}/5000</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
            disabled={isLoading}
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Tworzenie..." : "Dodaj post"}
          </button>
        </div>
      </form>
    </div>
  );
}
