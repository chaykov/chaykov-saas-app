import { createRootRoute, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useBfCache } from "@/hooks/useBfCache";

import "../styles.css";

// Lazy load Toaster to reduce initial bundle size
const Toaster = lazy(() =>
  import("sonner").then((mod) => ({ default: mod.Toaster }))
);

const RootLayout = () => {
  // Enable back/forward cache support
  useBfCache();

  return (
    <>
      <Outlet />
      <Suspense fallback={null}>
        <Toaster position="top-right" />
      </Suspense>
    </>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
