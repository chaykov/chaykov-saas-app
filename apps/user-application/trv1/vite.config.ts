import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    viteReact({
      jsxRuntime: 'automatic',
    }),
    tailwindcss(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }) as any,
  ],
  define: {
    '__DEV__': mode !== 'production',
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep React, ReactDOM, and jsx-runtime together (they have circular dependencies)
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('/react/jsx-runtime') ||
              id.includes('/react/jsx-dev-runtime')) {
            return 'react-vendor';
          }

          // TanStack Router
          if (id.includes('@tanstack/react-router')) {
            return 'router-vendor';
          }

          // TanStack Query
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }

          // Lucide icons
          if (id.includes('lucide-react')) {
            return 'icons';
          }

          // Zustand
          if (id.includes('zustand')) {
            return 'state';
          }

          // Sonner (toaster)
          if (id.includes('sonner')) {
            return 'toaster';
          }

          // Split route tree into separate chunk
          if (id.includes('routeTree.gen')) {
            return 'route-tree';
          }

          // Split lib/api into separate chunk
          if (id.includes('/lib/api')) {
            return 'api';
          }

          // Split auth store
          if (id.includes('/store/auth')) {
            return 'auth';
          }
        },
      },
    },
    // Optimize chunk size - smaller chunks for better caching and less unused code
    chunkSizeWarningLimit: 500,
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Use esbuild for minification (safer with React than terser)
    minify: 'esbuild',
    // Source maps for debugging (optional, increases bundle size)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router', '@tanstack/react-query'],
  },
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
    open: false,
  },
}));
