import React, { useEffect } from 'react';
import { useApp } from './AppContext';

// Publisher ID de Google AdSense oficial
export const ADSENSE_CLIENT_ID = 'ca-pub-1816299161304717';
export const ADSENSE_SLOT_ID = '0000000000';

export function AdBanner({ slot = ADSENSE_SLOT_ID, format = 'auto' }) {
  const { isPremium } = useApp();

  // Si el usuario es Premium, NO se muestra ningún anuncio
  if (isPremium) {
    return null;
  }

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && ADSENSE_CLIENT_ID !== 'ca-pub-0000000000000000') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('AdSense load error:', e);
    }
  }, []);

  return (
    <div className="ad-banner-container" aria-label="Publicidad patrocinada">
      <div className="ad-banner-badge">Anuncio</div>

      {ADSENSE_CLIENT_ID !== 'ca-pub-0000000000000000' ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '60px' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        /* Demo Banner mientras activas tu cuenta de Google AdSense */
        <div className="ad-banner-demo">
          <span className="ad-demo-icon">📢</span>
          <div className="ad-demo-text">
            <strong>¿Quieres aprender sin anuncios?</strong>
            <span>¡Hazte Premium y disfruta de la app 100% limpia!</span>
          </div>
        </div>
      )}
    </div>
  );
}
