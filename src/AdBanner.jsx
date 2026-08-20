import React, { useEffect } from 'react';
import { useApp } from './AppContext';

// Publisher ID de Google AdSense oficial
export const ADSENSE_CLIENT_ID = 'ca-pub-1816299161304717';
export const ADSENSE_SLOT_ID = '0000000000';

export function AdBanner({ slot = ADSENSE_SLOT_ID, format = 'auto' }) {
  const { isPremium } = useApp();

  if (isPremium) {
    return null;
  }

  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  const isPlaceholderSlot = !slot || slot === '0000000000' || ADSENSE_CLIENT_ID === 'ca-pub-0000000000000000';

  useEffect(() => {
    if (!isLocalhost && !isPlaceholderSlot && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense load error:', e);
      }
    }
  }, [isLocalhost, isPlaceholderSlot]);

  return (
    <div className="ad-banner-container" aria-label="Publicidad patrocinada">
      <div className="ad-banner-badge">{isLocalhost || isPlaceholderSlot ? 'Anuncio Demo' : 'Anuncio'}</div>

      {isLocalhost || isPlaceholderSlot ? (
        <div className="ad-banner-demo">
          <span className="ad-demo-icon">📢</span>
          <div className="ad-demo-text">
            <strong>¿Quieres aprender sin anuncios?</strong>
            <span>¡Hazte Premium y disfruta de la app 100% limpia!</span>
          </div>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '60px' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
