import  { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Fix Leaflet icon issues
      'leaflet/dist/images/': '/node_modules/leaflet/dist/images/',
    },
  },
});
 