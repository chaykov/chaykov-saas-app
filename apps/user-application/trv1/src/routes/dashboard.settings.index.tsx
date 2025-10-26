import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api";

export const Route = createFileRoute("/dashboard/settings/")({
  component: SettingsIndex,
});

function SettingsIndex() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("");

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not found");
      return apiClient.updateProfile(user.id, { username, email, bio });
    },
    onSuccess: (data) => {
      // Update user in auth store
      setUser({
        id: String(data.id),
        username: data.username,
        email: data.email,
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email) {
      toast.error("Username and email are required");
      return;
    }

    updateProfileMutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={updateProfileMutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={updateProfileMutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={updateProfileMutation.isPending}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 px-6 py-3 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Account Information</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">User ID:</span> {user?.id}
          </p>
          <p>
            <span className="font-medium">Current Username:</span> {user?.username}
          </p>
          <p>
            <span className="font-medium">Current Email:</span> {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}
