import React, { useState, useRef } from 'react';
import { LecturaSilabica } from './LecturaSilabica';
import { LecturaCuentos } from './LecturaCuentos';
import { useApp } from './AppContext';

const VOCAL_DATA = [
  { letter: 'A', emoji: '✈️', word: 'AVIÓN', color: 'vocal-a', example: 'A de Avión' },
  { letter: 'E', emoji: '🐘', word: 'ELEFANTE', color: 'vocal-e', example: 'E de Elefante' },
  { letter: 'I', emoji: '🦎', word: 'IGUANA', color: 'vocal-i', example: 'I de Iguana' },
  { letter: 'O', emoji: '🐻', word: 'OSO', color: 'vocal-o', example: 'O de Oso' },
  { letter: 'U', emoji: '🦄', word: 'UNICORNIO', color: 'vocal-u', example: 'U de Unicornio' },
];

const CONSONANTES = ['B', 'C', 'D', 'F', 'G', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
const VOCALES = ['A', 'E', 'I', 'O', 'U'];

const getSilabasForConsonante = (consonant) => {
  if (consonant === 'Q') {
    return ['QUE', 'QUI'];
  }
  return VOCALES.map(v => consonant + v);
};

export function LetrasScreen() {
  const { speak, formatText } = useApp();
  const [activeTab, setActiveTab] = useState('cuentos'); // 'cuentos' | 'lectura' | 'vocales' | 'alfabeto'
  const [selectedVocal, setSelectedVocal] = useState(null);
  const [activeConsonant, setActiveConsonant] = useState('M');
  const navRef = useRef(null);

  const handleVocalClick = (vocal) => {
    setSelectedVocal(vocal);
    speak(vocal.example);
  };

  const handleSilabaClick = (silaba) => {
    speak(silaba);
  };

  const scrollNav = (direction) => {
    if (navRef.current) {
      navRef.current.scrollBy({
        left: direction === 'left' ? -150 : 150,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="screen">
      {/* Top Header Mode Toggle with Scroll Controls */}
      <div className="letras-top-nav-wrapper">
        <button
          className="nav-scroll-arrow left"
          onClick={() => scrollNav('left')}
          aria-label="Desplazar menú a la izquierda"
        >
          ◀
        </button>

        <div className="letras-top-nav" ref={navRef}>
          <button
            className={`letras-nav-btn ${activeTab === 'cuentos' ? 'active' : ''}`}
            onClick={() => setActiveTab('cuentos')}
          >
            📖 Oraciones y Cuentos
          </button>
          <button
            className={`letras-nav-btn ${activeTab === 'lectura' ? 'active' : ''}`}
            onClick={() => setActiveTab('lectura')}
          >
            🎙️ Lectura por Sílabas
          </button>
          <button
            className={`letras-nav-btn ${activeTab === 'vocales' ? 'active' : ''}`}
            onClick={() => setActiveTab('vocales')}
          >
            🔤 Vocales y Sílabas
          </button>
          <button
            className={`letras-nav-btn ${activeTab === 'alfabeto' ? 'active' : ''}`}
            onClick={() => setActiveTab('alfabeto')}
          >
            🔠 Alfabeto
          </button>
        </div>

        <button
          className="nav-scroll-arrow right"
          onClick={() => scrollNav('right')}
          aria-label="Desplazar menú a la derecha"
        >
          ▶
        </button>
      </div>

      <div className="scroll-area">
        <div className="letras-content">

          {/* MODE 1: LECTURA DE ORACIONES Y CUENTOS */}
          {activeTab === 'cuentos' && (
            <LecturaCuentos />
          )}

          {/* MODE 2: LECTURA POR SÍLABAS & MICRÓFONO */}
          {activeTab === 'lectura' && (
            <LecturaSilabica />
          )}

          {/* MODE 3: VOCALES Y SÍLABAS */}
          {activeTab === 'vocales' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                      {formatText(v.letter, 'letter')}
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
                      {formatText(selectedVocal.letter, 'letter')}
                    </span>
                    <div className="vocal-example">
                      <span style={{ fontSize: 32 }}>{selectedVocal.emoji}</span>
                      <span>{formatText(selectedVocal.word, 'word')}</span>
                    </div>
                    <p className="vocal-sound-hint">🔊 Toca para escuchar</p>
                  </div>
                )}
              </div>

              {/* SÍLABAS SECTION */}
              <div className="card">
                <p className="letras-section-title">🔡 Explorador de Sílabas</p>

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
                      {formatText(c, 'letter')}
                    </button>
                  ))}
                </div>

                {/* Syllables for active consonant */}
                <div className="silabas-grid">
                  {getSilabasForConsonante(activeConsonant).map(silaba => (
                    <button
                      key={silaba}
                      id={`silaba-${silaba}`}
                      className="silaba-btn"
                      onClick={() => handleSilabaClick(silaba)}
                      aria-label={`Sílaba ${silaba}`}
                    >
                      {formatText(silaba, 'syllable')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE 4: ALFABETO */}
          {activeTab === 'alfabeto' && (
            <div className="card">
              <p className="letras-section-title">🔠 El Alfabeto Completo</p>
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
                    {formatText(letter, 'letter')}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
