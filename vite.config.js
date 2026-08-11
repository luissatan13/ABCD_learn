import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: { enabled: true },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg}'],
      },
      manifest: {
        name: 'Aventura de Leer',
        short_name: 'Aventura',
        description: 'Aprende a leer jugando con vocales y sílabas.',
        theme_color: '#0F1035',
        background_color: '#0F1035',
        display: 'standalone',
        icons: [
          {
            src: '/owl_mascot.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
