import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './AppContext.jsx'
import { registerSW } from 'virtual:pwa-register'

// Unregister any stale service workers on localhost dev mode to prevent caching loops
if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

// Register Service Worker in production with instant auto-reload on new versions
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
  },
  onOfflineReady() {
    console.log('App lista para trabajar sin conexión');
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
