# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based social media application built with TanStack Router and TanStack Query. The app features a dashboard with posts, users, and settings sections, along with authentication flow using Zustand for state management.

## Development Commands

### Running the Application
```bash
npm run dev              # Start dev server with route watching (recommended)
npm run watch-routes     # Watch for route changes only
```

### Building
```bash
npm run build           # Generate routes and build for production
npm run generate-routes # Manually generate route tree
```

### Testing
```bash
npm run xtest          # Run Vitest tests
```

## Architecture

### Routing (TanStack Router - File-Based)

Routes are defined as files in `src/routes/` and automatically code-split. The router uses file-based routing with the following structure:

- `__root.tsx` - Root layout with auth logic, devtools, and toaster
- `index.tsx` - Login/landing page
- `dashboard.tsx` - Dashboard layout (authenticated, sidebar navigation)
- `dashboard.*.tsx` - Dashboard sub-routes (posts, users, settings)

**Important routing patterns:**
- Routes automatically generate from files via TanStack Router CLI
- Route tree is generated to `src/routeTree.gen.ts` (do not edit manually)
- Use `createFileRoute()` for route definitions
- Nested routes use dot notation: `dashboard.posts.$postId.index.tsx`
- Files prefixed with `-` are ignored by the route generator

**Route regeneration:**
The `dev` and `build` scripts automatically run `tsr` commands to regenerate routes. If routes are not updating, manually run `npm run generate-routes`.

### State Management (Zustand)

Authentication state is managed via Zustand store in `src/store/authStore.ts`:

```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}
```

The auth store uses Zustand's `persist` middleware to save to localStorage under the key `auth-storage`.

**Auth flow:**
- Root layout (`__root.tsx`) handles redirects based on authentication state
- Logged-in users on `/` redirect to `/dashboard`
- Unauthenticated users on `/dashboard/*` redirect to `/`
- Dashboard layout also has a guard that renders `<Navigate to="/" />` if not authenticated

### Data Fetching (TanStack Query)

Query client is configured in `src/lib/queryClient.ts` with:
- 5 minute stale time
- 1 hour garbage collection time
- 1 retry on failure

The QueryClientProvider wraps the entire app in `src/main.tsx`.

**API Layer:**
- Base API client: `src/lib/api.ts`
- API URL from env: `VITE_API_URL` (defaults to `http://localhost:3001/api`)
- Custom hooks in `src/hooks/` (e.g., `usePostsQuery.ts`)

### Path Aliases

The `@/*` alias maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.json`).

Example: `import { useAuthStore } from "@/store/authStore"`

### TypeScript Configuration

Strict mode enabled with:
- No unused locals/parameters
- No fallthrough cases
- Bundler module resolution
- No emit (Vite handles bundling)

### Styling

Uses Tailwind CSS v4 via `@tailwindcss/vite` plugin. Styles are imported in `__root.tsx` via `../styles.css`.

### UI Components

- Icons: `lucide-react`
- Toasts: `sonner` (configured in root layout with top-right position)
- Devtools: TanStack Router and Query devtools (development only)

## Key Files

- `src/main.tsx` - App entry point, router and query client setup
- `src/routes/__root.tsx` - Root layout with auth redirects
- `src/store/authStore.ts` - Authentication state (Zustand with persistence)
- `src/lib/queryClient.ts` - TanStack Query configuration
- `src/lib/api.ts` - API client setup
- `src/router/context.ts` - Router context types
- `src/types/index.ts` - Shared TypeScript types (User, Post, Comment)
- `tanstack.json` - TanStack Router CLI configuration

## Common Patterns

### Adding a New Route

1. Create a new file in `src/routes/` (e.g., `dashboard.profile.tsx`)
2. The route tree regenerates automatically if `npm run dev` is running
3. Use `createFileRoute()` to define the route
4. Access route params via `Route.useParams()`, loaders via `Route.useLoaderData()`

### Adding a New API Endpoint

1. Add method to `src/lib/api.ts` apiClient object
2. Create a custom hook in `src/hooks/` using `useQuery` or `useMutation`
3. Use the hook in route components

### Working with Authentication

Access auth state anywhere via:
```typescript
import { useAuthStore } from "@/store/authStore";

const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);
const logout = useAuthStore((state) => state.logout);
```

## Notes

- Demo files can be safely deleted (not explicitly marked but referenced in README)
- React 19 is used with StrictMode enabled
- Development runs on port 3000 (via vite --port 3000)
- TypeScript strict mode is enabled
