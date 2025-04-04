import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    strictPort: true,
    port: 5173, // Change port if needed
    headers: {
      'Content-Type': 'application/javascript', // Ensure correct MIME type
    },
  },
  build: {
    outDir: 'dist', // Output folder
    assetsDir: 'assets', // Static assets folder
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude problematic dependencies if needed
  },
  resolve: {
    alias: {
      '@': '/src', // Short alias for src directory
    },
  },
});
