import React, { useState } from 'react';
import { RompecabezasScreen } from './RompecabezasScreen';
import { GameScreen } from './GameScreen';
import { useApp } from './AppContext';

export function JuegosHub() {
  const [selectedGameMode, setSelectedGameMode] = useState(null); // null | 'rompecabezas' | 'silabas'
  const { formatText } = useApp();

  if (selectedGameMode === 'rompecabezas') {
    return <RompecabezasScreen onBack={() => setSelectedGameMode(null)} />;
  }

  if (selectedGameMode === 'silabas') {
    return (
      <div className="screen">
        <div style={{ padding: '12px 16px 0 16px', display: 'flex', alignItems: 'center' }}>
          <button
            className="btn-secondary"
            onClick={() => setSelectedGameMode(null)}
            style={{ width: 'auto', padding: '6px 14px', fontSize: 13 }}
          >
            ⬅️ Volver a Juegos
          </button>
        </div>
        <GameScreen
          level={{ id: 99, label: 'Práctica Libre', type: 'silaba', target: 'MA', status: 'current' }}
          onComplete={() => setSelectedGameMode(null)}
        />
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="scroll-area">
        <div className="juegos-hub-container">
          
          <div className="juegos-hub-header">
            <h1 className="juegos-hub-title">🎮 Zona de Juegos</h1>
            <p className="juegos-hub-subtitle">¡Elige tu juego favorito y diviértete aprendiendo!</p>
          </div>

          <div className="juegos-cards-grid">
            
            {/* Card 1: Rompecabezas Mágico */}
            <div
              className="juego-card rompecabezas-card"
              onClick={() => setSelectedGameMode('rompecabezas')}
              role="button"
              tabIndex={0}
              id="game-mode-rompecabezas"
            >
              <div className="juego-card-badge">¡NUEVO! 🦄👸</div>
              <div className="juego-card-icon">🧩</div>
              <div className="juego-card-body">
                <h2 className="juego-card-title">Rompecabezas Mágico</h2>
                <p className="juego-card-desc">
                  Arma divertidos rompecabezas de unicornios y princesas mágicas.
                </p>
                <div className="juego-card-tags">
                  <span className="tag-pill">🦄 Unicornios</span>
                  <span className="tag-pill">👸 Princesas</span>
                  <span className="tag-pill">⭐ 2x2 y 3x3</span>
                </div>
              </div>
              <button className="btn-primary juego-card-btn">
                ¡Jugar Rompecabezas! ▶
              </button>
            </div>

            {/* Card 2: Desafío de Palabras y Sílabas */}
            <div
              className="juego-card silabas-card"
              onClick={() => setSelectedGameMode('silabas')}
              role="button"
              tabIndex={0}
              id="game-mode-silabas"
            >
              <div className="juego-card-badge">🔤 APRENDIZAJE</div>
              <div className="juego-card-icon">🎯</div>
              <div className="juego-card-body">
                <h2 className="juego-card-title">Desafío de Palabras</h2>
                <p className="juego-card-desc">
                  Descubre las letras faltantes, adivina las palabras y habla por el micrófono.
                </p>
                <div className="juego-card-tags">
                  <span className="tag-pill">🎙️ Voz</span>
                  <span className="tag-pill">🔤 Sílabas</span>
                  <span className="tag-pill">⭐ Estrellas</span>
                </div>
              </div>
              <button className="btn-primary juego-card-btn btn-gold">
                ¡Jugar Desafío! ▶
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
