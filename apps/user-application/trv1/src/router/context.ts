import { QueryClient } from "@tanstack/react-query";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface RouterContext {
  queryClient: QueryClient;
  user: AuthUser | null;
  isInitialized: boolean;
}

export const queryClient = new QueryClient();
