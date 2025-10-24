import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { routeTree } from "./routeTree.gen";
import { queryClient } from "./lib/queryClient";
import { useAuthStore } from "./store/authStore";
import type { RouterContext } from "./router/context";

import "./styles.css";

// Register router type - MUSI BYĆ NA GÓRZE
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

// Create router z initial context
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    user: null,
    isInitialized: false,
  } as RouterContext,
});

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  // Initialize auth and render
  useAuthStore.getState().initializeAuth();

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}
