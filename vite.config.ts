import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: true
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('maplibre-gl')) {
              return 'maplibre-gl';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})

