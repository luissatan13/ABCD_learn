import React, { useEffect } from 'react';
import { useApp } from './AppContext';

// Publisher ID y Slot ID de Google AdSense oficial
export const ADSENSE_CLIENT_ID = 'ca-pub-1816299161304717';
export const ADSENSE_SLOT_ID = '1076506381';

export function AdBanner({ slot = ADSENSE_SLOT_ID, format = 'auto' }) {
  const { isPremium } = useApp();

  if (isPremium) {
    return null;
  }

  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  useEffect(() => {
    if (!isLocalhost && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense load error:', e);
      }
    }
  }, [isLocalhost, slot]);

  // En entorno local (localhost), mostrar banner demo para no saturar consola con 400s
  if (isLocalhost) {
    return (
      <div className="ad-banner-container" aria-label="Publicidad patrocinada">
        <div className="ad-banner-badge">Anuncio Demo</div>
        <div className="ad-banner-demo">
          <span className="ad-demo-icon">📢</span>
          <div className="ad-demo-text">
            <strong>¿Quieres aprender sin anuncios?</strong>
            <span>¡Hazte Premium y disfruta de la app 100% limpia!</span>
          </div>
        </div>
      </div>
    );
  }

  // En producción (shiftcontrol.com.mx), renderizar etiqueta oficial de Google AdSense con el slot de anuncio 1076506381
  return (
    <div className="ad-banner-container" aria-label="Publicidad patrocinada">
      <div className="ad-banner-badge">Anuncio</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
