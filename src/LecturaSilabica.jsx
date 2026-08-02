import React, { useState, useEffect } from 'react';
import { SpeechMicButton } from './SpeechMicButton';
import { useApp } from './AppContext';

// Words dataset decomposed into syllables
const WORDS_BY_SYLLABLES = [
  { id: 'mama', word: 'MAMÁ', syllables: ['MA', 'MÁ'], emoji: '👩', category: 'Fácil' },
  { id: 'mesa', word: 'MESA', syllables: ['ME', 'SA'], emoji: '🪑', category: 'Fácil' },
  { id: 'mono', word: 'MONO', syllables: ['MO', 'NO'], emoji: '🐒', category: 'Fácil' },
  { id: 'sapo', word: 'SAPO', syllables: ['SA', 'PO'], emoji: '🐸', category: 'Fácil' },
  { id: 'luna', word: 'LUNA', syllables: ['LU', 'NA'], emoji: '🌙', category: 'Fácil' },
  { id: 'perro', word: 'PERRO', syllables: ['PE', 'RRO'], emoji: '🐶', category: 'Media' },
  { id: 'gato', word: 'GATO', syllables: ['GA', 'TO'], emoji: '🐱', category: 'Fácil' },
  { id: 'barco', word: 'BARCO', syllables: ['BAR', 'CO'], emoji: '⛵', category: 'Media' },
  { id: 'casa', word: 'CASA', syllables: ['CA', 'SA'], emoji: '🏠', category: 'Fácil' },
  { id: 'dado', word: 'DADO', syllables: ['DA', 'DO'], emoji: '🎲', category: 'Fácil' },
  { id: 'pelota', word: 'PELOTA', syllables: ['PE', 'LO', 'TA'], emoji: '⚽', category: 'Avanzada' },
  { id: 'conejo', word: 'CONEJO', syllables: ['CO', 'NE', 'JO'], emoji: '🐰', category: 'Avanzada' },
  { id: 'zapato', word: 'ZAPATO', syllables: ['ZA', 'PA', 'TO'], emoji: '👞', category: 'Avanzada' },
  { id: 'tomate', word: 'TOMATE', syllables: ['TO', 'MA', 'TE'], emoji: '🍅', category: 'Avanzada' },
];

const CONSONANTS = ['M', 'P', 'S', 'L', 'B', 'C', 'D', 'F', 'G', 'T', 'R', 'V'];
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

export function LecturaSilabica() {
  const { completeLevel, speak } = useApp();
  const speakSyllable = (text, slow = true) => speak(text, slow);
  const [activeTab, setActiveTab] = useState('taller'); // 'taller' | 'construye' | 'microfono'

  // State for Taller (Consonant + Vowel grid)
  const [selectedConsonant, setSelectedConsonant] = useState('M');
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [activeSyllableHighlight, setActiveSyllableHighlight] = useState(null);

  // State for "Construye la Palabra"
  const [buildIndex, setBuildIndex] = useState(0);
  const [userBuiltSyllables, setUserBuiltSyllables] = useState([]);
  const [buildFeedback, setBuildFeedback] = useState(null);

  // State for "Micrófono por Sílabas"
  const [micWordIndex, setMicWordIndex] = useState(0);
  const [micStep, setMicStep] = useState(0); // Syllable index in word
  const [micFeedback, setMicFeedback] = useState(null);
  const [micScore, setMicScore] = useState(0);

  // Active word in Taller
  const currentTallerWord = WORDS_BY_SYLLABLES[selectedWordIndex];

  // Active word in Construye
  const currentBuildWord = WORDS_BY_SYLLABLES[buildIndex];

  // Distractor syllables for Construye
  const buildOptions = React.useMemo(() => {
    if (!currentBuildWord) return [];
    const correct = currentBuildWord.syllables;
    const extra = ['PA', 'SO', 'MA', 'LO', 'TA', 'BA', 'CA', 'RI', 'TE', 'NU']
      .filter(s => !correct.includes(s))
      .sort(() => 0.5 - Math.random())
      .slice(0, 4 - correct.length);
    return [...correct, ...extra].sort(() => 0.5 - Math.random());
  }, [currentBuildWord]);

  // Active word in Micrófono
  const currentMicWord = WORDS_BY_SYLLABLES[micWordIndex];
  const targetMicSyllable = currentMicWord ? currentMicWord.syllables[micStep] : '';

  // ----------------------------------------------------
  // HANDLERS FOR CONSTRUYE LA PALABRA
  // ----------------------------------------------------
  const handleSelectBuildSyllable = (syllable) => {
    if (buildFeedback === 'correct') return;
    speak(syllable, true);

    const nextBuilt = [...userBuiltSyllables, syllable];
    setUserBuiltSyllables(nextBuilt);

    const targetSyllables = currentBuildWord.syllables;

    // Check if the partial selection matches target prefix
    for (let i = 0; i < nextBuilt.length; i++) {
      if (nextBuilt[i] !== targetSyllables[i]) {
        setBuildFeedback('wrong');
        speakSyllable('Intenta de nuevo');
        setTimeout(() => {
          setUserBuiltSyllables([]);
          setBuildFeedback(null);
        }, 1000);
        return;
      }
    }

    // If completed full word
    if (nextBuilt.length === targetSyllables.length) {
      setBuildFeedback('correct');
      setTimeout(() => {
        speakSyllable(`¡Muy bien! ¡${currentBuildWord.word}!`, false);
      }, 300);

      setTimeout(() => {
        if (buildIndex < WORDS_BY_SYLLABLES.length - 1) {
          setBuildIndex(i => i + 1);
          setUserBuiltSyllables([]);
          setBuildFeedback(null);
        } else {
          setBuildIndex(0);
          setUserBuiltSyllables([]);
          setBuildFeedback(null);
        }
      }, 1800);
    }
  };

  const handleResetBuild = () => {
    setUserBuiltSyllables([]);
    setBuildFeedback(null);
  };

  // ----------------------------------------------------
  // HANDLERS FOR MICRÓFONO POR SÍLABAS
  // ----------------------------------------------------
  const handleMicResult = (result) => {
    if (result.success) {
      setMicFeedback('correct');
      speakSyllable(`¡Excelente! ${targetMicSyllable}`);
      setMicScore(s => s + 10);

      setTimeout(() => {
        if (micStep < currentMicWord.syllables.length - 1) {
          setMicStep(s => s + 1);
          setMicFeedback(null);
        } else {
          // Completed all syllables of this word!
          speakSyllable(`¡Leíste ${currentMicWord.word}! ¡Felicitaciones!`, false);
          setTimeout(() => {
            if (micWordIndex < WORDS_BY_SYLLABLES.length - 1) {
              setMicWordIndex(i => i + 1);
              setMicStep(0);
              setMicFeedback(null);
            } else {
              setMicWordIndex(0);
              setMicStep(0);
              setMicFeedback(null);
            }
          }, 1500);
        }
      }, 1000);
    } else {
      setMicFeedback('wrong');
      speakSyllable(`Intenta decir: ${targetMicSyllable}`, true);
      setTimeout(() => {
        setMicFeedback(null);
      }, 1200);
    }
  };

  return (
    <div className="lectura-silabica-container">
      {/* Sub-Navigation Tabs */}
      <div className="silabica-tabs" role="tablist">
        <button
          className={`silabica-tab-btn ${activeTab === 'taller' ? 'active' : ''}`}
          onClick={() => setActiveTab('taller')}
          role="tab"
          aria-selected={activeTab === 'taller'}
        >
          📖 Taller de Sílabas
        </button>
        <button
          className={`silabica-tab-btn ${activeTab === 'construye' ? 'active' : ''}`}
          onClick={() => setActiveTab('construye')}
          role="tab"
          aria-selected={activeTab === 'construye'}
        >
          🧩 Construye Palabras
        </button>
        <button
          className={`silabica-tab-btn ${activeTab === 'microfono' ? 'active' : ''}`}
          onClick={() => setActiveTab('microfono')}
          role="tab"
          aria-selected={activeTab === 'microfono'}
        >
          🎙️ Lectura con Micrófono
        </button>
      </div>

      {/* ================= TAB 1: TALLER DE SÍLABAS ================= */}
      {activeTab === 'taller' && (
        <div className="silabica-card card">
          <h2 className="silabica-title">🔤 Aprende a Formar Sílabas</h2>
          <p className="silabica-desc">Toca una consonante y escucha cómo suena al unirse con cada vocal:</p>

          {/* Consonant Selector */}
          <div className="consonant-scroll">
            {CONSONANTS.map(c => (
              <button
                key={c}
                id={`taller-consonant-${c}`}
                className={`consonant-pill ${selectedConsonant === c ? 'active' : ''}`}
                onClick={() => {
                  setSelectedConsonant(c);
                  speakSyllable(`La letra ${c}`);
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Combined Syllables Row */}
          <div className="syllable-combo-grid">
            {VOWELS.map(v => {
              const syl = selectedConsonant + v;
              return (
                <button
                  key={syl}
                  id={`combo-${syl}`}
                  className="syllable-combo-card"
                  onClick={() => {
                    setActiveSyllableHighlight(syl);
                    speakSyllable(`${selectedConsonant} con ${v}... ¡${syl}!`, true);
                    setTimeout(() => setActiveSyllableHighlight(null), 1200);
                  }}
                >
                  <span className="combo-formula">{selectedConsonant} + {v}</span>
                  <span className="combo-result">{syl}</span>
                  <span className="combo-speaker">🔊</span>
                </button>
              );
            })}
          </div>

          <hr className="silabica-divider" />

          {/* Word Decomposition Section */}
          <h3 className="silabica-subtitle">📖 Lectura de Palabras por Sílabas</h3>
          <p className="silabica-desc">Toca cada ficha para pronunciar su sílaba:</p>

          <div className="word-decom-card">
            <div className="word-decom-emoji">{currentTallerWord.emoji}</div>

            {/* Interactive Syllable Chips */}
            <div className="syllable-chips-row">
              {currentTallerWord.syllables.map((syllable, idx) => (
                <button
                  key={idx}
                  id={`taller-syllable-chip-${idx}`}
                  className="syllable-chip"
                  onClick={() => speakSyllable(syllable, true)}
                  aria-label={`Sílaba ${syllable}`}
                >
                  {syllable}
                </button>
              ))}
            </div>

            <button
              className="btn-primary btn-read-whole"
              onClick={() => speakSyllable(currentTallerWord.word, false)}
            >
              🔊 Escuchar Palabra Completa: {currentTallerWord.word}
            </button>
          </div>

          {/* Pagination for words */}
          <div className="word-nav-controls">
            <button
              className="btn-secondary"
              onClick={() => setSelectedWordIndex(i => (i > 0 ? i - 1 : WORDS_BY_SYLLABLES.length - 1))}
            >
              ⬅️ Anterior
            </button>
            <span className="word-count-label">Palabra {selectedWordIndex + 1} de {WORDS_BY_SYLLABLES.length}</span>
            <button
              className="btn-secondary"
              onClick={() => setSelectedWordIndex(i => (i < WORDS_BY_SYLLABLES.length - 1 ? i + 1 : 0))}
            >
              Siguiente ➡️
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 2: CONSTRUYE LA PALABRA ================= */}
      {activeTab === 'construye' && (
        <div className="silabica-card card">
          <h2 className="silabica-title">🧩 Juego: Armador de Palabras</h2>
          <p className="silabica-desc">Toca las sílabas en orden correcto para armar la palabra del dibujo:</p>

          <div className="build-game-board">
            <div className="build-image-frame">
              <span className="build-emoji">{currentBuildWord.emoji}</span>
              <p className="build-hint">¿Qué es? Pista: {currentBuildWord.category}</p>
            </div>

            {/* Target Slots */}
            <div className="build-slots-container">
              {currentBuildWord.syllables.map((targetSyl, idx) => {
                const filledSyl = userBuiltSyllables[idx];
                return (
                  <div
                    key={idx}
                    className={`build-slot ${filledSyl ? 'filled' : ''} ${buildFeedback === 'correct' ? 'correct' : buildFeedback === 'wrong' ? 'wrong' : ''}`}
                  >
                    {filledSyl || '?'}
                  </div>
                );
              })}
            </div>

            {/* Feedback alert */}
            {buildFeedback === 'correct' && (
              <div className="build-feedback-msg correct">
                ¡Fantástico! Armaste <strong>{currentBuildWord.word}</strong> ⭐🎉
              </div>
            )}
            {buildFeedback === 'wrong' && (
              <div className="build-feedback-msg wrong">
                ¡Ups! Esas sílabas no forman la palabra. Reintentando... 💪
              </div>
            )}

            {/* Available Syllable Options */}
            <p className="silabica-desc" style={{ marginTop: 12 }}>Selecciona una sílaba:</p>
            <div className="build-options-grid">
              {buildOptions.map((syllable, idx) => (
                <button
                  key={idx}
                  id={`build-option-${idx}`}
                  className="build-syllable-btn"
                  onClick={() => handleSelectBuildSyllable(syllable)}
                  disabled={buildFeedback === 'correct'}
                >
                  {syllable}
                </button>
              ))}
            </div>

            {userBuiltSyllables.length > 0 && buildFeedback !== 'correct' && (
              <button className="btn-reset-build" onClick={handleResetBuild}>
                🔄 Borrar y empezar de nuevo
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: LECTURA CON MICRÓFONO ================= */}
      {activeTab === 'microfono' && (
        <div className="silabica-card card">
          <h2 className="silabica-title">🎙️ Desafío de Lectura con Voz</h2>
          <p className="silabica-desc">
            Observa la palabra dividida en sílabas y di por el micrófono la sílaba marcada en azul:
          </p>

          <div className="mic-game-board">
            <div className="mic-target-card">
              <span className="mic-card-emoji">{currentMicWord.emoji}</span>

              {/* Syllables row with active highlight */}
              <div className="mic-syllables-display">
                {currentMicWord.syllables.map((syl, idx) => (
                  <span
                    key={idx}
                    className={`mic-syllable-box ${idx === micStep ? 'active-target' : idx < micStep ? 'completed' : ''}`}
                  >
                    {syl}
                  </span>
                ))}
              </div>

              <p className="mic-instruction-text">
                Paso {micStep + 1} de {currentMicWord.syllables.length}: Di la sílaba &quot;<strong>{targetMicSyllable}</strong>&quot;
              </p>
            </div>

            {/* Speech Microphone Button Component */}
            <SpeechMicButton
              targetText={targetMicSyllable}
              onResult={handleMicResult}
            />

            {/* Feedback */}
            {micFeedback === 'correct' && (
              <div className="mic-feedback-banner success">
                🌟 ¡Pronunciaste perfectamente &quot;{targetMicSyllable}&quot;!
              </div>
            )}
            {micFeedback === 'wrong' && (
              <div className="mic-feedback-banner error">
                💪 Inténtalo de nuevo. Di claro: &quot;{targetMicSyllable}&quot;
              </div>
            )}

            {/* Manual fallback button for hearing the target */}
            <button
              className="btn-secondary"
              style={{ marginTop: 12 }}
              onClick={() => speakSyllable(targetMicSyllable, true)}
            >
              🔊 Escuchar cómo se pronuncia &quot;{targetMicSyllable}&quot;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
