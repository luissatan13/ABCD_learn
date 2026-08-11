import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from './AppContext';
import { PUZZLES } from './puzzleData';

function StarRain() {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 0.8,
    emoji: ['⭐', '🌟', '✨', '🦄', '👸', '🔥'][Math.floor(Math.random() * 6)],
  }));

  return (
    <div className="star-rain" aria-hidden="true">
      {stars.map(s => (
        <span
          key={s.id}
          className="star-particle"
          style={{
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  );
}

export function RompecabezasScreen({ onBack }) {
  const { speak, setXp } = useApp();
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState(0);
  const [gridSize, setGridSize] = useState(2); // 2=2x2 (4pzs), 3=3x3 (9pzs), 4=4x4 (16pzs), 5=5x5 (25pzs)

  const activePuzzle = PUZZLES[selectedPuzzleIndex] || PUZZLES[0];
  const totalPieces = gridSize * gridSize;

  // Board state: array of piece indices placed in board slots (length = totalPieces)
  const [board, setBoard] = useState(() => Array(totalPieces).fill(null));
  // Tray state: array of piece indices currently available in tray
  const [tray, setTray] = useState([]);
  // Currently selected piece (from tray or board slot)
  const [selectedPiece, setSelectedPiece] = useState(null); // { source: 'tray'|'board', index: number, pieceId: number }
  
  const [showPreview, setShowPreview] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize and shuffle puzzle pieces
  const startPuzzle = useCallback(() => {
    const pieces = Array.from({ length: totalPieces }, (_, i) => i);
    // Shuffle pieces for tray
    const shuffled = [...pieces].sort(() => Math.random() - 0.5);
    setBoard(Array(totalPieces).fill(null));
    setTray(shuffled);
    setSelectedPiece(null);
    setIsCompleted(false);
  }, [totalPieces]);

  useEffect(() => {
    startPuzzle();
  }, [startPuzzle, selectedPuzzleIndex, gridSize]);

  // Check victory condition
  useEffect(() => {
    if (board.length === totalPieces && board.every((piece, idx) => piece === idx)) {
      if (!isCompleted) {
        setIsCompleted(true);
        const xpEarned = gridSize === 2 ? 30 : gridSize === 3 ? 50 : gridSize === 4 ? 80 : 120;
        if (typeof setXp === 'function') {
          setXp(prev => prev + xpEarned);
        }
        if (typeof speak === 'function') {
          speak(`¡Fantástico! ¡Armaste el rompecabezas de ${activePuzzle.title}!`, false);
        }
      }
    }
  }, [board, totalPieces, isCompleted, activePuzzle, gridSize, setXp, speak]);

  // Next puzzle handler
  const handleNextPuzzle = () => {
    setSelectedPuzzleIndex(prev => (prev + 1) % PUZZLES.length);
  };

  // Select piece from tray
  const handleSelectTrayPiece = (pieceId) => {
    if (isCompleted) return;
    if (typeof speak === 'function') speak('Pieza');
    if (selectedPiece?.source === 'tray' && selectedPiece.pieceId === pieceId) {
      setSelectedPiece(null); // Deselect
    } else {
      setSelectedPiece({ source: 'tray', pieceId });
    }
  };

  // Click on board slot
  const handleSlotClick = (slotIdx) => {
    if (isCompleted) return;

    // Case 1: A piece from tray or board is selected, place it in this slot
    if (selectedPiece) {
      const { source, pieceId, index: fromSlotIdx } = selectedPiece;

      setBoard(prevBoard => {
        const nextBoard = [...prevBoard];
        const currentSlotPiece = nextBoard[slotIdx];

        if (source === 'tray') {
          // Remove pieceId from tray
          setTray(prevTray => prevTray.filter(p => p !== pieceId));
          // Place pieceId in slot
          nextBoard[slotIdx] = pieceId;
          // If slot already had a piece, return it to tray
          if (currentSlotPiece !== null) {
            setTray(prevTray => [...prevTray, currentSlotPiece]);
          }
        } else if (source === 'board') {
          // Swap pieces between fromSlotIdx and slotIdx
          nextBoard[fromSlotIdx] = currentSlotPiece;
          nextBoard[slotIdx] = pieceId;
        }

        return nextBoard;
      });

      setSelectedPiece(null);
      if (typeof speak === 'function') speak('¡Colocada!');
    } else {
      // Case 2: No piece selected, but slot has a piece -> pick it up or return to tray
      const pieceInSlot = board[slotIdx];
      if (pieceInSlot !== null) {
        setSelectedPiece({ source: 'board', index: slotIdx, pieceId: pieceInSlot });
        if (typeof speak === 'function') speak('Pieza');
      }
    }
  };

  // Double click or tap return piece to tray
  const handleReturnToTray = (slotIdx) => {
    if (isCompleted) return;
    const pieceInSlot = board[slotIdx];
    if (pieceInSlot !== null) {
      setBoard(prev => {
        const next = [...prev];
        next[slotIdx] = null;
        return next;
      });
      setTray(prev => [...prev, pieceInSlot]);
      setSelectedPiece(null);
    }
  };

  // Render tile background snippet
  const getTileStyle = (pieceId, boardSize = 280) => {
    if (pieceId === null || pieceId === undefined) return {};
    const tileSize = boardSize / gridSize;
    const col = pieceId % gridSize;
    const row = Math.floor(pieceId / gridSize);
    return {
      backgroundImage: `url(${activePuzzle.src})`,
      backgroundSize: `${boardSize}px ${boardSize}px`,
      backgroundPosition: `${-col * tileSize}px ${-row * tileSize}px`,
      backgroundRepeat: 'no-repeat',
    };
  };

  const getXpForGrid = (g) => {
    if (g === 2) return 30;
    if (g === 3) return 50;
    if (g === 4) return 80;
    return 120;
  };

  return (
    <div className="screen">
      {isCompleted && <StarRain />}

      <div className="scroll-area">
        <div className="puzzle-screen-content">
          
          {/* Top Bar */}
          <div className="puzzle-top-bar">
            {onBack && (
              <button className="btn-secondary" onClick={onBack} style={{ padding: '8px 14px', width: 'auto' }}>
                ⬅️ Atrás
              </button>
            )}
            <h1 className="puzzle-screen-title">🧩 Rompecabezas Mágico</h1>
          </div>

          {/* Puzzle selector tabs */}
          <div className="puzzle-selector-row">
            {PUZZLES.map((p, idx) => (
              <button
                key={p.id}
                className={`puzzle-select-card ${selectedPuzzleIndex === idx ? 'active' : ''}`}
                onClick={() => setSelectedPuzzleIndex(idx)}
                style={{ borderColor: selectedPuzzleIndex === idx ? p.color : 'transparent' }}
              >
                <span className="puzzle-select-emoji">{p.emoji}</span>
                <span className="puzzle-select-name">{p.title}</span>
              </button>
            ))}
          </div>

          {/* Difficulty & Helper Controls */}
          <div className="puzzle-controls-bar" style={{ flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
            <div className="difficulty-pills" style={{ overflowX: 'auto', paddingBottom: 4 }}>
              <button
                className={`diff-pill ${gridSize === 2 ? 'active' : ''}`}
                onClick={() => setGridSize(2)}
              >
                🌟 Fácil (4 pzs)
              </button>
              <button
                className={`diff-pill ${gridSize === 3 ? 'active' : ''}`}
                onClick={() => setGridSize(3)}
              >
                ⚡ Normal (9 pzs)
              </button>
              <button
                className={`diff-pill ${gridSize === 4 ? 'active' : ''}`}
                onClick={() => setGridSize(4)}
              >
                🔥 Difícil (16 pzs)
              </button>
              <button
                className={`diff-pill ${gridSize === 5 ? 'active' : ''}`}
                onClick={() => setGridSize(5)}
              >
                🏆 Experto (25 pzs)
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="puzzle-hint-btn"
                onClick={() => setShowPreview(p => !p)}
                title="Ver imagen completa"
              >
                👁️ {showPreview ? 'Ocultar Pista' : 'Ver Pista'}
              </button>
            </div>
          </div>

          {/* Image Preview Overlay Modal */}
          {showPreview && (
            <div className="puzzle-preview-modal" onClick={() => setShowPreview(false)}>
              <div className="puzzle-preview-card" onClick={e => e.stopPropagation()}>
                <img src={activePuzzle.src} alt={activePuzzle.title} />
                <p>{activePuzzle.description}</p>
                <button className="btn-primary" onClick={() => setShowPreview(false)}>
                  Entendido 👍
                </button>
              </div>
            </div>
          )}

          {/* Main Board Grid */}
          <div className="puzzle-board-container">
            <div
              className={`puzzle-board grid-${gridSize} ${isCompleted ? 'completed' : ''}`}
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {board.map((pieceId, slotIdx) => {
                const isSelected = selectedPiece?.source === 'board' && selectedPiece.index === slotIdx;
                const isCorrect = pieceId === slotIdx;

                return (
                  <div
                    key={slotIdx}
                    className={`puzzle-slot ${pieceId !== null ? 'filled' : 'empty'} ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''}`}
                    onClick={() => handleSlotClick(slotIdx)}
                    onDoubleClick={() => handleReturnToTray(slotIdx)}
                    style={pieceId !== null ? getTileStyle(pieceId, 280) : {}}
                  >
                    {pieceId === null && (
                      <span className="slot-number-guide" style={{ fontSize: gridSize >= 4 ? 11 : 14 }}>
                        {slotIdx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Celebration Overlay Card when completed */}
          {isCompleted ? (
            <div className="celebration-overlay" role="dialog" aria-label="¡Rompecabezas completado!">
              <div className="celebration-card" style={{ maxWidth: 320 }}>
                <div className="celebration-emoji">🎉🔥</div>
                <h2 className="celebration-title">¡Increíble!</h2>
                <p className="celebration-desc">
                  ¡Armaste el rompecabezas de <strong>{activePuzzle.title}</strong> en modo {gridSize === 2 ? 'Fácil' : gridSize === 3 ? 'Normal' : gridSize === 4 ? 'Difícil 🔥' : 'Experto 🏆'}!<br />
                  <span style={{ color: 'var(--gold-light)', fontWeight: 800, fontSize: 18, marginTop: 8, display: 'block' }}>
                    + {getXpForGrid(gridSize)} XP ⭐
                  </span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                  <button className="btn-primary" onClick={handleNextPuzzle}>
                    ➡️ Siguiente Rompecabezas
                  </button>
                  <button className="btn-secondary" onClick={startPuzzle}>
                    🔄 Armar de Nuevo
                  </button>
                  {onBack && (
                    <button className="btn-secondary" onClick={onBack}>
                      ⬅️ Volver a Juegos
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Piece Tray / Carousel */
            <div className="puzzle-tray-section">
              <p className="tray-instruction">
                👇 Toca una pieza de abajo y luego toca la casilla del tablero:
              </p>

              <div className="puzzle-tray-grid">
                {tray.length === 0 ? (
                  <div className="tray-empty">¡Todas las piezas están en el tablero!</div>
                ) : (
                  tray.map(pieceId => {
                    const isSelected = selectedPiece?.source === 'tray' && selectedPiece.pieceId === pieceId;
                    const itemSize = gridSize >= 4 ? 52 : 70;
                    const tileSize = 280 / gridSize;
                    const scale = itemSize / tileSize;

                    return (
                      <button
                        key={pieceId}
                        className={`tray-piece-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectTrayPiece(pieceId)}
                        style={{
                          width: itemSize,
                          height: itemSize,
                          backgroundImage: `url(${activePuzzle.src})`,
                          backgroundSize: `${280 * scale}px ${280 * scale}px`,
                          backgroundPosition: `${-(pieceId % gridSize) * tileSize * scale}px ${-Math.floor(pieceId / gridSize) * tileSize * scale}px`,
                        }}
                        aria-label={`Pieza ${pieceId + 1}`}
                      />
                    );
                  })
                )}
              </div>

              <button className="btn-secondary" onClick={startPuzzle} style={{ marginTop: 12 }}>
                🔄 Reiniciar Piezas
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
