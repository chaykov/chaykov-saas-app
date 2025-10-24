import { useEffect } from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/store/authStore";
import type { RouterContext } from "@/router/context";

const RootLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Redirect logic
  useEffect(() => {
    if (!isInitialized) return;

    const path = window.location.pathname;

    // Jeśli zalogowany na login page → go to dashboard
    if (user && path === "/") {
      navigate({ to: "/dashboard", replace: true });
    }

    // Jeśli niezalogowany na dashboard → go to login
    if (!user && path.startsWith("/dashboard")) {
      navigate({ to: "/", replace: true });
    }
  }, [isInitialized, user, navigate]);

  // Loading state
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-blue-600 to-blue-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">
            Ładowanie aplikacji...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Outlet />

      {process.env.NODE_ENV === "development" && (
        <>
          <TanStackRouterDevtools />
          <ReactQueryDevtools initialIsOpen={false} />
        </>
      )}
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
