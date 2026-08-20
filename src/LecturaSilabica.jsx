import React, { useState } from 'react';
import { SpeechMicButton } from './SpeechMicButton';
import { useApp } from './AppContext';
import { ALL_CONSONANTS, WORDS_BY_CONSONANT } from './syllableData';

const VOWELS = ['A', 'E', 'I', 'O', 'U'];

export function LecturaSilabica() {
  const { setXp, speak, formatText } = useApp();
  const speakSyllable = (text, slow = true) => speak(text, slow);

  const [activeTab, setActiveTab] = useState('taller'); // 'taller' | 'construye' | 'microfono'

  // State for Consonant and 25 Exercises per consonant
  const [selectedConsonant, setSelectedConsonant] = useState('B');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [activeSyllableHighlight, setActiveSyllableHighlight] = useState(null);

  // State for Microphone Validation Feedback
  const [micResultStatus, setMicResultStatus] = useState(null); // 'correct' | 'wrong' | null
  const [completedCount, setCompletedCount] = useState(0);

  // Active exercises for selected consonant (25 words)
  const currentConsonantWords = WORDS_BY_CONSONANT[selectedConsonant] || WORDS_BY_CONSONANT['B'];
  const currentWordObj = currentConsonantWords[exerciseIndex % currentConsonantWords.length];

  // State for "Construye la Palabra"
  const [buildIndex, setBuildIndex] = useState(0);
  const [userBuiltSyllables, setUserBuiltSyllables] = useState([]);
  const [buildFeedback, setBuildFeedback] = useState(null);

  const currentBuildWord = currentConsonantWords[buildIndex % currentConsonantWords.length];

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

  // Handle consonant selection
  const handleConsonantSelect = (consonant) => {
    setSelectedConsonant(consonant);
    setExerciseIndex(0);
    setBuildIndex(0);
    setUserBuiltSyllables([]);
    setBuildFeedback(null);
    setMicResultStatus(null);
    speakSyllable(`Letra ${consonant}`);
  };

  // Handle next / prev exercise
  const handleNextExercise = () => {
    setMicResultStatus(null);
    setExerciseIndex(prev => (prev < currentConsonantWords.length - 1 ? prev + 1 : 0));
  };

  const handlePrevExercise = () => {
    setMicResultStatus(null);
    setExerciseIndex(prev => (prev > 0 ? prev - 1 : currentConsonantWords.length - 1));
  };

  // Microphone Result Handler with Voice Validation
  const handleMicValidation = (result) => {
    if (result.success) {
      setMicResultStatus('correct');
      setCompletedCount(prev => prev + 1);
      if (typeof setXp === 'function') {
        setXp(prev => prev + 15);
      }
      speakSyllable(`¡Fantástico! Pronunciaste muy bien ${currentWordObj.word}`, false);

      // Auto advance to next exercise after 1.8s celebration
      setTimeout(() => {
        setMicResultStatus(null);
        handleNextExercise();
      }, 1800);
    } else {
      setMicResultStatus('wrong');
      speakSyllable(`Intenta de nuevo diciendo ${currentWordObj.word}`, true);
      setTimeout(() => {
        setMicResultStatus(null);
      }, 2500);
    }
  };

  // Handlers for "Construye la palabra"
  const handleSelectBuildSyllable = (syllable) => {
    if (buildFeedback === 'correct') return;
    speak(syllable, true);

    const nextBuilt = [...userBuiltSyllables, syllable];
    setUserBuiltSyllables(nextBuilt);

    const targetSyllables = currentBuildWord.syllables;

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

    if (nextBuilt.length === targetSyllables.length) {
      setBuildFeedback('correct');
      speakSyllable(`¡Muy bien! ¡${currentBuildWord.word}!`, false);
      if (typeof setXp === 'function') {
        setXp(prev => prev + 20);
      }
      setTimeout(() => {
        setUserBuiltSyllables([]);
        setBuildFeedback(null);
        setBuildIndex(prev => (prev < currentConsonantWords.length - 1 ? prev + 1 : 0));
      }, 1800);
    }
  };

  const handleResetBuild = () => {
    setUserBuiltSyllables([]);
    setBuildFeedback(null);
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
          className={`silabica-tab-btn ${activeTab === 'microfono' ? 'active' : ''}`}
          onClick={() => setActiveTab('microfono')}
          role="tab"
          aria-selected={activeTab === 'microfono'}
        >
          🎙️ Práctica con Micrófono
        </button>
        <button
          className={`silabica-tab-btn ${activeTab === 'construye' ? 'active' : ''}`}
          onClick={() => setActiveTab('construye')}
          role="tab"
          aria-selected={activeTab === 'construye'}
        >
          🧩 Armador de Palabras
        </button>
      </div>

      {/* Consonant Selector (All 20 Consonants, Omitting H) */}
      <div className="card" style={{ padding: '12px 16px', background: 'var(--bg-card)' }}>
        <p className="silabica-desc" style={{ marginBottom: 8, fontWeight: 800 }}>
          🔤 Selecciona una consonante (Sin la &quot;H&quot;):
        </p>
        <div className="consonant-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {ALL_CONSONANTS.map(c => (
            <button
              key={c}
              id={`consonant-pill-${c}`}
              className={`consonant-pill ${selectedConsonant === c ? 'active' : ''}`}
              onClick={() => handleConsonantSelect(c)}
              style={{
                minWidth: 42,
                height: 42,
                borderRadius: '50%',
                fontSize: 16,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              {formatText(c, 'letter')}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TAB 1: TALLER DE SÍLABAS ================= */}
      {activeTab === 'taller' && (
        <div className="silabica-card card">
          <h2 className="silabica-title">🔤 Sílabas con la Letra {formatText(selectedConsonant, 'letter')}</h2>
          <p className="silabica-desc">Escucha cómo suena al unirse con cada vocal:</p>

          {/* Syllable Combinations Row */}
          <div className="syllable-combo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(64px, 1fr))', gap: 8 }}>
            {VOWELS.map(v => {
              let syl = selectedConsonant + v;
              if (selectedConsonant === 'Q') {
                syl = v === 'E' || v === 'I' ? 'QU' + v : 'QUE';
              }
              return (
                <button
                  key={v}
                  id={`combo-${selectedConsonant}-${v}`}
                  className={`syllable-combo-card ${activeSyllableHighlight === syl ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSyllableHighlight(syl);
                    speakSyllable(`${selectedConsonant} con ${v}... ¡${syl}!`, true);
                    setTimeout(() => setActiveSyllableHighlight(null), 1200);
                  }}
                  style={{
                    padding: '12px 6px',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-strong)',
                    background: 'var(--bg-card-2)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <span className="combo-formula" style={{ fontSize: 11, opacity: 0.8 }}>{selectedConsonant}+{v}</span>
                  <span className="combo-result" style={{ fontSize: 20, fontWeight: 900, color: '#FCD34D' }}>{formatText(syl, 'syllable')}</span>
                  <span className="combo-speaker" style={{ fontSize: 12 }}>🔊</span>
                </button>
              );
            })}
          </div>

          <hr className="silabica-divider" style={{ margin: '16px 0', borderColor: 'var(--border)' }} />

          {/* 25 Exercises Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 className="silabica-subtitle" style={{ margin: 0 }}>
              📖 Ejercicio {exerciseIndex + 1} de 25
            </h3>
            <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 800 }}>
              Letra {selectedConsonant}
            </span>
          </div>

          {/* Active Word Card */}
          <div className="word-decom-card" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 20, textAlign: 'center' }}>
            <div className="word-decom-emoji" style={{ fontSize: 64, marginBottom: 8 }}>{currentWordObj.emoji}</div>

            {/* Interactive Syllable Chips */}
            <div className="syllable-chips-row" style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
              {currentWordObj.syllables.map((syllable, idx) => (
                <button
                  key={idx}
                  id={`taller-syllable-chip-${idx}`}
                  className="syllable-chip"
                  onClick={() => speakSyllable(syllable, true)}
                  aria-label={`Sílaba ${syllable}`}
                  style={{
                    background: 'linear-gradient(135deg, var(--purple-dark), var(--purple))',
                    color: 'white',
                    fontSize: 22,
                    fontWeight: 900,
                    padding: '10px 18px',
                    borderRadius: 16,
                    border: '2px solid var(--purple-light)',
                    cursor: 'pointer'
                  }}
                >
                  {formatText(syllable, 'syllable')}
                </button>
              ))}
            </div>

            <button
              className="btn-primary btn-read-whole"
              onClick={() => speakSyllable(currentWordObj.word, false)}
              style={{ margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              🔊 Escuchar Palabra Completa: {formatText(currentWordObj.word, 'word')}
            </button>

            {/* Microphone Practice Box inside Exercise */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed var(--border-strong)' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 8 }}>
                🎙️ ¡Practica leyendo por el micrófono!
              </p>

              <SpeechMicButton
                targetText={currentWordObj.word}
                onResult={handleMicValidation}
              />

              {micResultStatus === 'correct' && (
                <div style={{ marginTop: 10, padding: 10, borderRadius: 12, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#6EE7B7', fontWeight: 800 }}>
                  🌟 ¡Excelente! Leíste súper bien &quot;{currentWordObj.word}&quot; (+15 XP) 🎉
                </div>
              )}
              {micResultStatus === 'wrong' && (
                <div style={{ marginTop: 10, padding: 10, borderRadius: 12, background: 'rgba(244, 63, 94, 0.2)', border: '1px solid #F43F5E', color: '#FDA4AF', fontWeight: 800 }}>
                  💪 ¡Casi casi! Escucha la palabra e intenta de nuevo 🎙️
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls across the 25 exercises */}
          <div className="word-nav-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <button className="btn-secondary" onClick={handlePrevExercise}>
              ⬅️ Anterior
            </button>
            <span className="word-count-label" style={{ fontWeight: 800 }}>
              {exerciseIndex + 1} / 25
            </span>
            <button className="btn-secondary" onClick={handleNextExercise}>
              Siguiente ➡️
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRÁCTICA CON MICRÓFONO ================= */}
      {activeTab === 'microfono' && (
        <div className="silabica-card card">
          <h2 className="silabica-title">🎙️ Desafío de Lectura con Micrófono</h2>
          <p className="silabica-desc">
            Lee la palabra completa en voz alta por el micrófono. La app validará tu pronunciación:
          </p>

          <div className="mic-game-board" style={{ textAlign: 'center', padding: 20 }}>
            <span style={{ fontSize: 72 }}>{currentWordObj.emoji}</span>
            <h3 style={{ fontSize: 28, color: 'var(--gold)', margin: '12px 0', fontWeight: 900 }}>
              {formatText(currentWordObj.word, 'word')}
            </h3>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
              {currentWordObj.syllables.map((s, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'var(--bg-card-2)',
                    padding: '8px 16px',
                    borderRadius: 12,
                    fontSize: 18,
                    fontWeight: 800,
                    border: '1px solid var(--border-strong)',
                  }}
                >
                  {formatText(s, 'syllable')}
                </span>
              ))}
            </div>

            <SpeechMicButton
              targetText={currentWordObj.word}
              onResult={handleMicValidation}
            />

            {micResultStatus === 'correct' && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#6EE7B7', fontWeight: 800 }}>
                🌟 ¡Fantástico! Pronunciación perfecta (+15 XP) 🎉
              </div>
            )}
            {micResultStatus === 'wrong' && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: 'rgba(244, 63, 94, 0.2)', border: '1px solid #F43F5E', color: '#FDA4AF', fontWeight: 800 }}>
                💪 Inténtalo de nuevo. Di con voz clara: &quot;{currentWordObj.word}&quot;
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
              <button className="btn-secondary" onClick={handlePrevExercise}>
                ⬅️ Ejercicio Anterior
              </button>
              <button className="btn-secondary" onClick={handleNextExercise}>
                Siguiente Ejercicio ➡️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ARMADOR DE PALABRAS ================= */}
      {activeTab === 'construye' && (
        <div className="silabica-card card">
          <h2 className="silabica-title">🧩 Armador de Palabras: Letra {selectedConsonant}</h2>
          <p className="silabica-desc">Toca las sílabas en orden correcto para formar la palabra del dibujo:</p>

          <div className="build-game-board" style={{ textAlign: 'center', padding: 16 }}>
            <div className="build-image-frame" style={{ marginBottom: 16 }}>
              <span className="build-emoji" style={{ fontSize: 64 }}>{currentBuildWord.emoji}</span>
            </div>

            {/* Target Slots */}
            <div className="build-slots-container" style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
              {currentBuildWord.syllables.map((targetSyl, idx) => {
                const filledSyl = userBuiltSyllables[idx];
                return (
                  <div
                    key={idx}
                    className={`build-slot ${filledSyl ? 'filled' : ''} ${buildFeedback === 'correct' ? 'correct' : buildFeedback === 'wrong' ? 'wrong' : ''}`}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 16,
                      border: '2px dashed var(--purple-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 900,
                      background: filledSyl ? 'var(--purple)' : 'rgba(255,255,255,0.05)',
                      color: 'white',
                    }}
                  >
                    {filledSyl ? formatText(filledSyl, 'syllable') : '?'}
                  </div>
                );
              })}
            </div>

            {/* Feedback alert */}
            {buildFeedback === 'correct' && (
              <div className="build-feedback-msg correct" style={{ padding: 10, borderRadius: 12, background: 'rgba(16, 185, 129, 0.2)', color: '#6EE7B7', fontWeight: 800, marginBottom: 12 }}>
                ¡Fantástico! Armaste <strong>{formatText(currentBuildWord.word, 'word')}</strong> ⭐🎉 (+20 XP)
              </div>
            )}
            {buildFeedback === 'wrong' && (
              <div className="build-feedback-msg wrong" style={{ padding: 10, borderRadius: 12, background: 'rgba(244, 63, 94, 0.2)', color: '#FDA4AF', fontWeight: 800, marginBottom: 12 }}>
                ¡Ups! Esas sílabas no forman la palabra. Reintentando... 💪
              </div>
            )}

            {/* Available Syllable Options */}
            <p className="silabica-desc" style={{ marginTop: 12 }}>Selecciona una sílaba:</p>
            <div className="build-options-grid" style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              {buildOptions.map((syllable, idx) => (
                <button
                  key={idx}
                  id={`build-option-${idx}`}
                  className="build-syllable-btn"
                  onClick={() => handleSelectBuildSyllable(syllable)}
                  disabled={buildFeedback === 'correct'}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 14,
                    background: 'var(--bg-card-2)',
                    border: '1.5px solid var(--border-strong)',
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {formatText(syllable, 'syllable')}
                </button>
              ))}
            </div>

            {userBuiltSyllables.length > 0 && buildFeedback !== 'correct' && (
              <button className="btn-secondary" onClick={handleResetBuild}>
                🔄 Borrar y empezar de nuevo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
