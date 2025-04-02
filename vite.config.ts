import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'vue', 'vue-router'],
          supabase: ['@supabase/supabase-js'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'vue', 'vue-router', '@supabase/supabase-js']
  }
})
