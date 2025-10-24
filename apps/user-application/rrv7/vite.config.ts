import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    // visualizer({
    //   filename: 'dist/stats.html',
    //   template: 'treemap',
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: true,
  },

  // build: {
  //   // sourcemap: false,
  //   // minify: 'esbuild',
  //   rollupOptions: {
  //     output: {
  //       // entry chunks mają przewidywalną nazwę, reszta z hash → cache-friendly
  //       entryFileNames: '[name].js',
  //       chunkFileNames: '[name]-[hash].js',
  //       manualChunks(id: string) {
  //         if (id.includes('node_modules/react')) return 'react';
  //         if (id.includes('node_modules/react-dom')) return 'react-dom';
  //         if (id.includes('node_modules/@tanstack')) return 'tanstack';
  //         if (id.includes('node_modules/@heroicons')) return 'icons';
  //         if (id.includes('node_modules/lodash')) return 'lodash';

  //         if (
  //           id.includes(
  //             path.resolve(__dirname, 'src/components/layout/app-layout.tsx'),
  //           )
  //         )
  //           return 'app-layout';
  //         if (
  //           id.includes(path.resolve(__dirname, 'src/routes/landing-page.tsx'))
  //         )
  //           return 'landing-page';
  //         if (
  //           id.includes(path.resolve(__dirname, 'src/routes/app/app-page.tsx'))
  //         )
  //           return 'app-page';
  //         if (
  //           id.includes(
  //             path.resolve(__dirname, 'src/routes/app/users/users-page.tsx'),
  //           )
  //         )
  //           return 'users-page';
  //         if (
  //           id.includes(
  //             path.resolve(__dirname, 'src/routes/app/users/user-detail.tsx'),
  //           )
  //         )
  //           return 'user-detail';
  //         if (
  //           id.includes(
  //             path.resolve(__dirname, 'src/routes/app/forum-page.tsx'),
  //           )
  //         )
  //           return 'forum-page';
  //         if (
  //           id.includes(
  //             path.resolve(__dirname, 'src/routes/app/profile-page.tsx'),
  //           )
  //         )
  //           return 'profile-page';
  //         if (
  //           id.includes(
  //             path.resolve(__dirname, 'src/routes/app/settings-page.tsx'),
  //           )
  //         )
  //           return 'settings-page';
  //         if (
  //           id.includes(
  //             path.resolve(__dirname, 'src/routes/app/updates-page.tsx'),
  //           )
  //         )
  //           return 'updates-page';
  //         if (
  //           id.includes(path.resolve(__dirname, 'src/routes/auth/register.tsx'))
  //         )
  //           return 'register-page';
  //         if (id.includes(path.resolve(__dirname, 'src/routes/auth/login.tsx')))
  //           return 'login-page';
  //         if (id.includes(path.resolve(__dirname, 'src/routes/not-found.tsx')))
  //           return 'not-found';
  //       },
  //     },
  //   },
  // },
});
