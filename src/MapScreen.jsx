import React from 'react';
import { useApp } from './AppContext';

export function MapScreen({ onPlayLevel }) {
  const { levels } = useApp();
  const currentLevel = levels.find(l => l.status === 'current');

  return (
    <div className="screen">
      <div className="scroll-area">
        <div className="map-content">
          {/* Render levels in reverse (top = locked, bottom = done) */}
          {[...levels].reverse().map((level, index, arr) => (
            <React.Fragment key={level.id}>
              {/* Level node */}
              <div className="map-level-node">
                <div
                  className={`level-circle ${level.status}`}
                  id={`level-node-${level.id}`}
                  onClick={() => level.status !== 'locked' && onPlayLevel(level)}
                  role={level.status !== 'locked' ? 'button' : undefined}
                  aria-label={`Nivel ${level.id}: ${level.label} - ${level.status === 'locked' ? 'Bloqueado' : level.status === 'completed' ? 'Completado' : 'Jugar ahora'}`}
                >
                  {level.status === 'locked' && <span className="level-lock-icon">🔒</span>}
                  {level.status === 'completed' && <span className="level-check-icon">✓</span>}
                  {level.status === 'current' && (
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
                  {level.status === 'locked' ? `Nivel ${level.id}: ${level.label}` : level.label}
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
                  onClick={() => onPlayLevel(level)}
                  aria-label={`Jugar nivel ${level.label}`}
                >
                  ¡Jugar Ahora!
                </button>
              )}

              {/* Connector */}
              {index < arr.length - 1 && (
                <div className="map-level-connector" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}

          {/* Treehouse at bottom */}
          <div className="map-level-connector" aria-hidden="true" />
          <div className="map-treehouse" aria-label="Casa del árbol - inicio de la aventura">
            <img src="/treehouse_map.png" alt="Casa del árbol" />
          </div>
        </div>
      </div>
    </div>
  );
}
