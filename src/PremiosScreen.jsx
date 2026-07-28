import React from 'react';
import { useApp } from './AppContext';

const ALL_MEDALS = [
  { id: 'primera', label: 'Primera Letra', sub: '¡Completaste A!', emoji: '🅰️' },
  { id: 'estrella', label: 'Súper Estrella', sub: '3 estrellas seguidas', emoji: '⭐' },
  { id: 'rapido', label: 'Veloz', sub: 'Sin errores en un nivel', emoji: '⚡' },
  { id: 'silaba', label: 'Silábico', sub: 'Aprende 5 sílabas', emoji: '🔤' },
  { id: 'lector', label: 'Lector', sub: 'Completa 3 niveles', emoji: '📖' },
  { id: 'explorador', label: 'Explorador', sub: 'Completa 5 niveles', emoji: '🧭' },
  { id: 'misterio', label: 'Misterio', sub: 'Sigue jugando...', emoji: '🔒' },
  { id: 'maestro', label: 'Maestro', sub: 'Completa todos los niveles', emoji: '🎓' },
  { id: 'campeon', label: 'Campeón', sub: 'Máximas estrellas', emoji: '🏆' },
];

export function PremiosScreen({ onGoToMap }) {
  const { medals, getXpPercent, getPlayerLevel, xp, levels } = useApp();
  const earnedIds = medals.filter(m => m.earned).map(m => m.id);
  const completedLevels = levels.filter(l => l.status === 'completed').length;
  const playerLevel = getPlayerLevel();
  const xpPercent = getXpPercent();

  return (
    <div className="screen">
      <div className="scroll-area">
        <div className="premios-content">

          {/* Level & XP card */}
          <div className="nivel-card">
            <div className="nivel-card-star" aria-hidden="true">⭐</div>
            <h2 className="nivel-card-title">
              Nivel {playerLevel} <span style={{ color: '#F5C800' }}>⭐</span>
            </h2>
            <p className="nivel-card-desc">
              {xpPercent < 50
                ? '¡Sigue explorando para ganar más estrellas!'
                : '¡Casi llegas al siguiente nivel!'}
            </p>
            <div className="xp-bar" role="progressbar" aria-valuenow={Math.round(xpPercent)} aria-valuemax={100} aria-label="Progreso de experiencia">
              <div className="xp-fill" style={{ width: `${xpPercent}%` }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 700 }}>
              {xp} XP · {completedLevels} niveles completados
            </p>
          </div>

          {/* Medals */}
          <h2 className="medallas-title">Mis Medallas</h2>

          <div className="medallas-grid">
            {ALL_MEDALS.map(medal => {
              const earned = earnedIds.includes(medal.id);
              return (
                <div key={medal.id} className="medalla-item" id={`medal-${medal.id}`}>
                  <div
                    className={`medalla-circle ${earned ? 'earned' : 'locked'}`}
                    role="img"
                    aria-label={earned ? `Medalla obtenida: ${medal.label}` : `Medalla bloqueada: ${medal.label}`}
                  >
                    <span>{earned ? medal.emoji : '🔒'}</span>
                  </div>
                  <div>
                    <p className="medalla-label">{medal.label}</p>
                    <p className="medalla-sub">{medal.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Back to map */}
          <button
            id="volver-mapa-btn"
            className="volver-btn"
            onClick={onGoToMap}
            aria-label="Volver al Mapa"
          >
            🗺️ Volver al Mapa
          </button>

        </div>
      </div>
    </div>
  );
}
