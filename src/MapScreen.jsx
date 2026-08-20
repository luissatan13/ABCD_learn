import React, { useEffect, useRef } from 'react';
import { useApp } from './AppContext';
import { AdBanner } from './AdBanner';

export function MapScreen({ onPlayLevel }) {
  const { levels, isPremium, setShowPaywall } = useApp();
  const currentLevel = levels.find(l => l.status === 'current');
  const lastCompleted = [...levels].reverse().find(l => l.status === 'completed');
  const targetLevelId = currentLevel ? currentLevel.id : (lastCompleted ? lastCompleted.id : levels[0]?.id);

  const targetNodeRef = useRef(null);

  const handleLevelClick = (level) => {
    if (level.status === 'locked') return;
    if (level.id >= 7 && !isPremium) {
      setShowPaywall(true);
      return;
    }
    onPlayLevel(level);
  };

  useEffect(() => {
    // Scroll únicamente dentro de .scroll-area sin mover ni desplazar la ventana u otros contenedores
    const scrollToNivel = (behavior = 'auto') => {
      if (targetNodeRef.current) {
        const scrollArea = targetNodeRef.current.closest('.scroll-area');
        if (scrollArea) {
          const containerRect = scrollArea.getBoundingClientRect();
          const targetRect = targetNodeRef.current.getBoundingClientRect();
          const targetOffset = (targetRect.top - containerRect.top) + scrollArea.scrollTop - (containerRect.height / 2) + (targetRect.height / 2);
          scrollArea.scrollTo({ top: Math.max(0, targetOffset), behavior });
        }
      }
    };

    scrollToNivel('auto');
    const timer = setTimeout(() => {
      scrollToNivel('smooth');
    }, 350);

    return () => clearTimeout(timer);
  }, [targetLevelId]);

  return (
    <div className="screen">
      <div className="scroll-area">
        <div className="map-content">
          {/* Render levels in reverse (top = locked, bottom = done) */}
          {[...levels].reverse().map((level, index, arr) => {
            const isTarget = level.id === targetLevelId;
            const isPremiumLocked = level.id >= 7 && !isPremium;

            return (
              <React.Fragment key={level.id}>
                {/* Level node */}
                <div
                  className="map-level-node"
                  ref={isTarget ? targetNodeRef : null}
                >
                  <div
                    className={`level-circle ${level.status} ${isPremiumLocked ? 'premium-locked' : ''}`}
                    id={`level-node-${level.id}`}
                    onClick={() => handleLevelClick(level)}
                    role={level.status !== 'locked' ? 'button' : undefined}
                    aria-label={`Nivel ${level.id}: ${level.label}`}
                  >
                    {isPremiumLocked && <span className="level-lock-icon" style={{ color: '#FCD34D' }}>👑</span>}
                    {!isPremiumLocked && level.status === 'locked' && <span className="level-lock-icon">🔒</span>}
                    {level.status === 'completed' && <span className="level-check-icon">✓</span>}
                    {!isPremiumLocked && level.status === 'current' && (
                      <>
                        <span className="level-play-icon">▶</span>
                        <div className="level-stars-decoration">
                          <span className="star-deco red">★</span>
                          <span className="star-deco blue">★</span>
                        </div>
                      </>
                    )}
                  </div>

                  <span className="level-label">
                    {isPremiumLocked ? `👑 ${level.label}` : level.status === 'locked' ? `Nivel ${level.id}: ${level.label}` : level.label}
                  </span>

                  {level.status === 'completed' && (
                    <div className="level-stars" aria-label={`${level.stars} estrellas`}>
                      {[1, 2, 3].map(s => (
                        <span key={s} style={{ color: s <= level.stars ? '#F5C800' : '#D4CDB8' }}>★</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Play button for current level */}
                {level.status === 'current' && (
                  <button
                    id="map-play-btn"
                    className="map-play-btn"
                    onClick={() => handleLevelClick(level)}
                    aria-label={`Jugar nivel ${level.label}`}
                  >
                    {isPremiumLocked ? '👑 Desbloquear Premium' : '¡Jugar Ahora!'}
                  </button>
                )}

                {/* Connector */}
                {index < arr.length - 1 && (
                  <div className="map-level-connector" aria-hidden="true" />
                )}
              </React.Fragment>
            );
          })}

          {/* Treehouse at bottom */}
          <div className="map-level-connector" aria-hidden="true" />
          <div className="map-treehouse" aria-label="Casa del árbol - inicio de la aventura">
            <img src="/treehouse_map.png" alt="Casa del árbol" />
          </div>

          {/* Ad Banner for non-premium users */}
          <AdBanner />
        </div>
      </div>
    </div>
  );
}
