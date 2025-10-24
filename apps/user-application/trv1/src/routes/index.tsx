import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("jan_kowalski");
  const [password, setPassword] = useState("password");

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      // Error już set w store
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Polytalko</h1>
          <p className="text-gray-600 mt-2">Mini Social Media</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Login form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jan_kowalski"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Help text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p className="font-semibold mb-2">Mock credentials:</p>
          <p>
            Username:{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">jan_kowalski</code>
          </p>
          <p>
            Password:{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">password</code>
          </p>
          <p className="mt-2 text-xs text-gray-600">
            Try other users from mock-data
          </p>
        </div>
      </div>
    </div>
  );
}
