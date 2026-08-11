import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './AppContext.jsx'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker with instant auto-reload on new versions
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Automatically apply update when a new build is deployed
    updateSW(true);
  },
  onOfflineReady() {
    console.log('App lista para trabajar sin conexión');
  },
});

// Automatically check for updates whenever the app is reopened or focused
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      updateSW(true);
    }
  });

  window.addEventListener('focus', () => {
    updateSW(true);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
