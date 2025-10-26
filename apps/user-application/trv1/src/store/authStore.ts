import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;

  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        set({
          user,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
