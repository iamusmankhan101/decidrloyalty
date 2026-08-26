import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectRegister: 'auto',
      manifest: {
        name: 'Decidr Loyalty',
        short_name: 'Decidr',
        description: 'Digital stamp cards for cafes — earn free rewards with every visit.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ff0000',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        // Must be the www host: the apex 308-redirects here, and the browser drops
        // the Authorization header across that origin hop — which logged the user
        // out on every refresh.
        target: 'https://www.trydecidr.xyz',
        changeOrigin: true,
      },
    },
  },
});
