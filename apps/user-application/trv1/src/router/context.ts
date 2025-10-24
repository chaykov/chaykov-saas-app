import { QueryClient } from "@tanstack/react-query";
import type { AuthUser } from "@/store/authStore";

export interface RouterContext {
  queryClient: QueryClient;
  user: AuthUser | null;
  isInitialized: boolean;
}
