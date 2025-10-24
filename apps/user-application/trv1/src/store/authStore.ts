import { create } from "zustand";
import { mockUsers } from "@/mocks/mockUsers";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 800));

          const mockUser = mockUsers.find((user) => user.username === username);

          if (!mockUser) {
            throw new Error("User not found");
          }

          if (password !== "password") {
            throw new Error("Error password");
          }

          set({
            user: {
              id: mockUser.id,
              username: mockUser.username,
              email: mockUser.email,
              avatar: mockUser.avatar,
            },
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed login",
          });

          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          error: null,
          isInitialized: true,
        });
      },

      setUser: (user) => {
        set({
          user: user,
        });
      },

      initializeAuth: () => {
        set({ isInitialized: true });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
