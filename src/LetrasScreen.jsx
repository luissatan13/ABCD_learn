import React, { useState } from 'react';

function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'es-ES';
    utt.rate = 0.75;
    utt.pitch = 1.2;
    window.speechSynthesis.speak(utt);
  }
}

const VOCAL_DATA = [
  { letter: 'A', emoji: '✈️', word: 'AVIÓN', color: 'vocal-a', example: 'A de Avión' },
  { letter: 'E', emoji: '🐘', word: 'ELEFANTE', color: 'vocal-e', example: 'E de Elefante' },
  { letter: 'I', emoji: '🦎', word: 'IGUANA', color: 'vocal-i', example: 'I de Iguana' },
  { letter: 'O', emoji: '🐻', word: 'OSO', color: 'vocal-o', example: 'O de Oso' },
  { letter: 'U', emoji: '🦄', word: 'UNICORNIO', color: 'vocal-u', example: 'U de Unicornio' },
];

const CONSONANTES = ['M', 'P', 'S', 'L', 'N', 'F', 'D', 'T', 'V', 'B', 'R', 'C', 'G', 'J'];
const VOCALES = ['A', 'E', 'I', 'O', 'U'];

export function LetrasScreen() {
  const [selectedVocal, setSelectedVocal] = useState(null);
  const [activeConsonant, setActiveConsonant] = useState('M');

  const handleVocalClick = (vocal) => {
    setSelectedVocal(vocal);
    speak(vocal.example);
  };

  const handleSilabaClick = (silaba) => {
    speak(silaba);
  };

  return (
    <div className="screen">
      <div className="scroll-area">
        <div className="letras-content">

          {/* VOCALES SECTION */}
          <div className="card">
            <p className="letras-section-title">🔤 Las Vocales</p>
            <div className="vocales-grid">
              {VOCAL_DATA.map(v => (
                <button
                  key={v.letter}
                  id={`vocal-btn-${v.letter}`}
                  className={`vocal-card ${v.color}`}
                  onClick={() => handleVocalClick(v)}
                  aria-label={v.example}
                  style={{
                    transform: selectedVocal?.letter === v.letter ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.2s',
                  }}
                >
                  {v.letter}
                  <span className="vocal-emoji">{v.emoji}</span>
                </button>
              ))}
            </div>

            {/* Detail card for selected vocal */}
            {selectedVocal && (
              <div
                className="vocal-detail-card"
                style={{ marginTop: 16 }}
                onClick={() => speak(selectedVocal.example)}
                role="button"
                aria-label={`Escuchar ${selectedVocal.example}`}
                id="vocal-detail-card"
              >
                <span
                  className="vocal-big-letter"
                  style={{
                    color: selectedVocal.color === 'vocal-a' ? '#FF6B6B'
                      : selectedVocal.color === 'vocal-e' ? '#FF9F43'
                      : selectedVocal.color === 'vocal-i' ? '#1DD1A1'
                      : selectedVocal.color === 'vocal-o' ? '#54A0FF'
                      : '#A29BFE'
                  }}
                >
                  {selectedVocal.letter}
                </span>
                <div className="vocal-example">
                  <span style={{ fontSize: 32 }}>{selectedVocal.emoji}</span>
                  <span>{selectedVocal.word}</span>
                </div>
                <p className="vocal-sound-hint">🔊 Toca para escuchar</p>
              </div>
            )}
          </div>

          {/* SÍLABAS SECTION */}
          <div className="card">
            <p className="letras-section-title">🔡 Sílabas</p>

            {/* Consonant tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {CONSONANTES.map(c => (
                <button
                  key={c}
                  id={`consonant-tab-${c}`}
                  onClick={() => setActiveConsonant(c)}
                  style={{
                    background: activeConsonant === c ? 'var(--primary-blue)' : 'var(--bg)',
                    color: activeConsonant === c ? 'white' : 'var(--text-dark)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '6px 14px',
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  aria-label={`Consonante ${c}`}
                  aria-pressed={activeConsonant === c}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Syllables for active consonant */}
            <div className="silabas-grid">
              {VOCALES.map(v => {
                const silaba = activeConsonant + v;
                return (
                  <button
                    key={silaba}
                    id={`silaba-${silaba}`}
                    className="silaba-btn"
                    onClick={() => handleSilabaClick(silaba)}
                    aria-label={`Sílaba ${silaba}`}
                  >
                    {silaba}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ALPHABET SECTION */}
          <div className="card">
            <p className="letras-section-title">🔠 El Alfabeto</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').map(letter => (
                <button
                  key={letter}
                  id={`alphabet-${letter}`}
                  onClick={() => speak(letter)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-card)',
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: 16,
                    fontWeight: 800,
                    color: 'var(--text-dark)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  aria-label={`Letra ${letter}`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
