// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'vue',
            'vue-router',
            'date-fns',
            '@supabase/supabase-js'
          ],
          'auth': [
            './src/composables/useAuth.ts',
            './src/composables/useSupabaseService.ts'
          ],
          'ui-components': [
            './src/components/ui'
          ],
          'weweb-components': [
            './src/weweb-integration/components'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
