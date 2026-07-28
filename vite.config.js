import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'Aventura de Leer',
        short_name: 'Aventura',
        description: 'Aprende a leer jugando con vocales y sílabas.',
        theme_color: '#F2ECD8',
        background_color: '#F2ECD8',
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
