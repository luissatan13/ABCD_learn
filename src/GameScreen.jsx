import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from './AppContext';
import { SpeechMicButton } from './SpeechMicButton';

// Comprehensive Game Data derived from materials
const ALL_GAME_DATA = [
  // A
  { word: 'AVIÓN', blank: 0, answer: 'A', options: ['A', 'E', 'O'], emoji: '✈️', hint: 'Vuela en el cielo', target: 'A' },
  { word: 'ÁRBOL', blank: 0, answer: 'Á', options: ['E', 'Á', 'I'], emoji: '🌳', hint: 'Tiene hojas verdes', target: 'A' },
  { word: 'ANILLO', blank: 0, answer: 'A', options: ['A', 'U', 'E'], emoji: '💍', hint: 'Se pone en el dedo', target: 'A' },
  { word: 'ABEJA', blank: 0, answer: 'A', options: ['I', 'O', 'A'], emoji: '🐝', hint: 'Hace miel', target: 'A' },
  { word: 'AGUA', blank: 0, answer: 'A', options: ['A', 'E', 'U'], emoji: '💧', hint: 'Para beber', target: 'A' },

  // E
  { word: 'ELEFANTE', blank: 0, answer: 'E', options: ['I', 'E', 'A'], emoji: '🐘', hint: 'Animal grande', target: 'E' },
  { word: 'ESTRELLA', blank: 0, answer: 'E', options: ['E', 'O', 'U'], emoji: '⭐', hint: 'Brilla en el cielo', target: 'E' },
  { word: 'ESCUELA', blank: 0, answer: 'E', options: ['A', 'I', 'E'], emoji: '🏫', hint: 'Donde vas a aprender', target: 'E' },
  { word: 'ENANO', blank: 0, answer: 'E', options: ['E', 'U', 'A'], emoji: '🧙‍♂️', hint: 'Persona pequeñita', target: 'E' },
  { word: 'ELOTE', blank: 0, answer: 'E', options: ['O', 'E', 'I'], emoji: '🌽', hint: 'Maíz rico', target: 'E' },

  // I
  { word: 'IGUANA', blank: 0, answer: 'I', options: ['E', 'U', 'I'], emoji: '🦎', hint: 'Reptil verde', target: 'I' },
  { word: 'ISLA', blank: 0, answer: 'I', options: ['A', 'I', 'O'], emoji: '🏝️', hint: 'Tierra en el mar', target: 'I' },
  { word: 'IMÁN', blank: 0, answer: 'I', options: ['I', 'E', 'A'], emoji: '🧲', hint: 'Atrae el metal', target: 'I' },
  { word: 'IGLÚ', blank: 0, answer: 'I', options: ['O', 'I', 'U'], emoji: '🧊', hint: 'Casa de hielo', target: 'I' },
  { word: 'IGLESIA', blank: 0, answer: 'I', options: ['I', 'A', 'E'], emoji: '⛪', hint: 'Tiene campanas', target: 'I' },

  // O
  { word: 'OSO', blank: 0, answer: 'O', options: ['O', 'A', 'E'], emoji: '🐻', hint: 'Animal peludo', target: 'O' },
  { word: 'OJO', blank: 0, answer: 'O', options: ['I', 'O', 'U'], emoji: '👁️', hint: 'Para ver', target: 'O' },
  { word: 'OREJA', blank: 0, answer: 'O', options: ['A', 'E', 'O'], emoji: '👂', hint: 'Para escuchar', target: 'O' },
  { word: 'OLLA', blank: 0, answer: 'O', options: ['O', 'U', 'A'], emoji: '🍲', hint: 'Para hacer sopa', target: 'O' },
  { word: 'OVEJA', blank: 0, answer: 'O', options: ['I', 'O', 'E'], emoji: '🐑', hint: 'Nos da lana', target: 'O' },

  // U
  { word: 'UVA', blank: 0, answer: 'U', options: ['O', 'I', 'U'], emoji: '🍇', hint: 'Fruta morada', target: 'U' },
  { word: 'UÑA', blank: 0, answer: 'U', options: ['E', 'U', 'A'], emoji: '💅', hint: 'En tu dedo', target: 'U' },
  { word: 'UNO', blank: 0, answer: 'U', options: ['U', 'O', 'I'], emoji: '1️⃣', hint: 'El primer número', target: 'U' },
  { word: 'UNICORNIO', blank: 0, answer: 'U', options: ['A', 'E', 'U'], emoji: '🦄', hint: 'Caballo mágico', target: 'U' },
  { word: 'URRACA', blank: 0, answer: 'U', options: ['U', 'O', 'A'], emoji: '🐦', hint: 'Pájaro que roba cosas brillantes', target: 'U' },

  // M
  { word: 'MAMÁ', blank: 0, answer: 'MA', options: ['PE', 'MA', 'SO'], emoji: '👩', hint: 'Tu mamá', target: 'M' },
  { word: 'MESA', blank: 0, answer: 'ME', options: ['SO', 'ME', 'PA'], emoji: '🍽️', hint: 'Mueble', target: 'M' },
  { word: 'MIEL', blank: 0, answer: 'MI', options: ['PI', 'MI', 'LI'], emoji: '🍯', hint: 'Dulce de abeja', target: 'M' },
  { word: 'MONO', blank: 0, answer: 'MO', options: ['PO', 'MO', 'SO'], emoji: '🐒', hint: 'Come plátanos', target: 'M' },
  { word: 'MULA', blank: 0, answer: 'MU', options: ['LU', 'PU', 'MU'], emoji: '🐴', hint: 'Animal de carga', target: 'M' },

  // P
  { word: 'PAPÁ', blank: 0, answer: 'PA', options: ['PA', 'MA', 'LA'], emoji: '👨', hint: 'Tu papá', target: 'P' },
  { word: 'PERRO', blank: 0, answer: 'PE', options: ['ME', 'PE', 'SE'], emoji: '🐶', hint: 'El mejor amigo', target: 'P' },
  { word: 'PIÑA', blank: 0, answer: 'PI', options: ['MI', 'LI', 'PI'], emoji: '🍍', hint: 'Fruta amarilla', target: 'P' },
  { word: 'POLLO', blank: 0, answer: 'PO', options: ['PO', 'MO', 'LO'], emoji: '🐤', hint: 'Ave de granja', target: 'P' },
  { word: 'PUMA', blank: 0, answer: 'PU', options: ['SU', 'PU', 'MU'], emoji: '🐆', hint: 'Felino salvaje', target: 'P' },

  // S y L
  { word: 'SAPO', blank: 0, answer: 'SA', options: ['LA', 'SA', 'ME'], emoji: '🐸', hint: 'Salta y croa', target: 'S_L' },
  { word: 'LUNA', blank: 0, answer: 'LU', options: ['LU', 'MA', 'PA'], emoji: '🌙', hint: 'Brilla de noche', target: 'S_L' },
  { word: 'SOL', blank: 0, answer: 'SO', options: ['LO', 'SO', 'PO'], emoji: '☀️', hint: 'Da calor', target: 'S_L' },
  { word: 'LIMA', blank: 0, answer: 'LI', options: ['PI', 'LI', 'MI'], emoji: '🍋', hint: 'Fruta cítrica', target: 'S_L' },
  { word: 'SOPA', blank: 0, answer: 'SO', options: ['PO', 'SO', 'MO'], emoji: '🍲', hint: 'Comida caliente', target: 'S_L' },

  // B
  { word: 'BARCO', blank: 0, answer: 'BA', options: ['BA', 'CA', 'DA'], emoji: '⛵', hint: 'Navega en el agua', target: 'B' },
  { word: 'BEBÉ', blank: 0, answer: 'BE', options: ['ME', 'BE', 'PE'], emoji: '👶', hint: 'Un niño pequeñito', target: 'B' },
  { word: 'BICI', blank: 0, answer: 'BI', options: ['BI', 'PI', 'DI'], emoji: '🚲', hint: 'Tiene dos ruedas', target: 'B' },
  { word: 'BOTA', blank: 0, answer: 'BO', options: ['MO', 'BO', 'SO'], emoji: '🥾', hint: 'Calzado alto', target: 'B' },
  { word: 'BURRO', blank: 0, answer: 'BU', options: ['BU', 'MU', 'PU'], emoji: '🫏', hint: 'Animal orejón', target: 'B' },

  // C
  { word: 'CASA', blank: 0, answer: 'CA', options: ['CA', 'MA', 'PA'], emoji: '🏠', hint: 'Donde vives', target: 'C' },
  { word: 'CONEJO', blank: 0, answer: 'CO', options: ['CO', 'MO', 'SO'], emoji: '🐰', hint: 'Come zanahorias', target: 'C' },
  { word: 'CUNA', blank: 0, answer: 'CU', options: ['PU', 'CU', 'MU'], emoji: '🛏️', hint: 'Cama de bebé', target: 'C' },

  // D
  { word: 'DADO', blank: 0, answer: 'DA', options: ['DA', 'LA', 'MA'], emoji: '🎲', hint: 'Tiene puntos y rueda', target: 'D' },
  { word: 'DEDO', blank: 0, answer: 'DE', options: ['ME', 'DE', 'PE'], emoji: '👆', hint: 'Tienes cinco en la mano', target: 'D' },
  { word: 'DIENTE', blank: 0, answer: 'DI', options: ['DI', 'PI', 'MI'], emoji: '🦷', hint: 'Para masticar', target: 'D' },

  // F
  { word: 'FUEGO', blank: 0, answer: 'FU', options: ['FU', 'MU', 'PU'], emoji: '🔥', hint: 'Da calor y luz', target: 'F' },
  { word: 'FOTO', blank: 0, answer: 'FO', options: ['MO', 'FO', 'SO'], emoji: '📷', hint: 'Captura un recuerdo', target: 'F' },

  // G
  { word: 'GATO', blank: 0, answer: 'GA', options: ['GA', 'MA', 'PA'], emoji: '🐱', hint: 'Hace miau', target: 'G' },
  { word: 'GOTA', blank: 0, answer: 'GO', options: ['GO', 'MO', 'BO'], emoji: '💧', hint: 'Una gota de agua', target: 'G' },

  // J
  { word: 'JABÓN', blank: 0, answer: 'JA', options: ['JA', 'MA', 'PA'], emoji: '🧼', hint: 'Para lavarse las manos', target: 'J' },
  { word: 'JUGO', blank: 0, answer: 'JU', options: ['JU', 'MU', 'LU'], emoji: '🧃', hint: 'Bebida de frutas', target: 'J' },

  // K
  { word: 'KOALA', blank: 0, answer: 'KO', options: ['KO', 'MO', 'SO'], emoji: '🐨', hint: 'Animal tierno de eucalipto', target: 'K' },
  { word: 'KIWI', blank: 0, answer: 'KI', options: ['KI', 'MI', 'PI'], emoji: '🥝', hint: 'Fruta verde por dentro', target: 'K' },

  // N
  { word: 'NUBE', blank: 0, answer: 'NU', options: ['NU', 'MU', 'PU'], emoji: '☁️', hint: 'En el cielo blanca', target: 'N' },
  { word: 'NIDO', blank: 0, answer: 'NI', options: ['NI', 'PI', 'MI'], emoji: '🪹', hint: 'Casa de los pájaros', target: 'N' },

  // Ñ
  { word: 'ÑANDÚ', blank: 0, answer: 'ÑA', options: ['ÑA', 'MA', 'PA'], emoji: '🐦', hint: 'Ave corredora', target: 'Ñ' },

  // Q
  { word: 'QUESO', blank: 0, answer: 'QUE', options: ['QUE', 'PA', 'MA'], emoji: '🧀', hint: 'Le gusta al ratón', target: 'Q' },

  // R
  { word: 'RANA', blank: 0, answer: 'RA', options: ['RA', 'MA', 'SA'], emoji: '🐸', hint: 'Verde y saltarina', target: 'R' },
  { word: 'ROSA', blank: 0, answer: 'RO', options: ['RO', 'SO', 'MO'], emoji: '🌹', hint: 'Una flor bonita', target: 'R' },

  // T
  { word: 'TAZA', blank: 0, answer: 'TA', options: ['TA', 'MA', 'PA'], emoji: '☕', hint: 'Para tomar café o té', target: 'T' },
  { word: 'TOMATE', blank: 0, answer: 'TO', options: ['TO', 'MO', 'PO'], emoji: '🍅', hint: 'Verdura roja', target: 'T' },

  // V
  { word: 'VACA', blank: 0, answer: 'VA', options: ['VA', 'MA', 'PA'], emoji: '🐮', hint: 'Da leche rica', target: 'V' },
  { word: 'VELA', blank: 0, answer: 'VE', options: ['VE', 'ME', 'PE'], emoji: '🕯️', hint: 'Da luz con fuego', target: 'V' },

  // W
  { word: 'WAFLE', blank: 0, answer: 'WA', options: ['WA', 'MA', 'PA'], emoji: '🧇', hint: 'Rico para el desayuno', target: 'W' },

  // X
  { word: 'XILÓFONO', blank: 0, answer: 'XI', options: ['XI', 'PI', 'MI'], emoji: '🎼', hint: 'Instrumento musical', target: 'X' },

  // Y
  { word: 'YATE', blank: 0, answer: 'YA', options: ['YA', 'MA', 'PA'], emoji: '🛥️', hint: 'Barco elegante', target: 'Y' },

  // Z
  { word: 'ZAPATO', blank: 0, answer: 'ZA', options: ['ZA', 'MA', 'PA'], emoji: '👞', hint: 'En el pie', target: 'Z' },
];

function StarRain() {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 0.8,
    emoji: ['⭐', '🌟', '✨'][Math.floor(Math.random() * 3)],
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

function CelebrationModal({ stars, onContinue }) {
  const messages = ['¡Increíble!', '¡Súper!', '¡Genial!', '¡Perfecto!'];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  return (
    <>
      <StarRain />
      <div className="celebration-overlay" role="dialog" aria-label="¡Nivel completado!">
        <div className="celebration-card">
          <div className="celebration-emoji">🎉</div>
          <h2 className="celebration-title">{msg}</h2>
          <p className="celebration-desc">
            Ganaste{' '}
            {[1, 2, 3].map(s => (
              <span key={s} style={{ color: s <= stars ? '#F5C800' : '#DDD', fontSize: 22 }}>★</span>
            ))}
          </p>
          <button id="celebration-continue-btn" className="btn-primary" onClick={onContinue}>
            ¡Seguir Jugando!
          </button>
        </div>
      </div>
    </>
  );
}

export function GameScreen({ level, onComplete }) {
  const { completeLevel, recordMistake, mistakes, speak, formatText } = useApp();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [errors, setErrors] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Dynamically select questions based on level
  const questions = useMemo(() => {
    let filtered = [];
    if (level.type === 'repaso' && level.target === 'DIFFICULT') {
      // Find answers with most mistakes
      const sortedMistakes = Object.entries(mistakes).sort((a,b) => b[1] - a[1]);
      const topMistakes = sortedMistakes.slice(0, 4).map(m => m[0]);
      filtered = ALL_GAME_DATA.filter(q => topMistakes.includes(q.answer) || topMistakes.includes(q.answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
      if (filtered.length < 5) {
        // Fallback to random questions if not enough mistakes
        const more = ALL_GAME_DATA.filter(q => !topMistakes.includes(q.answer));
        filtered = [...filtered, ...more].slice(0, 5);
      }
    } else if (level.type === 'repaso') {
      // e.g. target 'M_P' -> split by '_'
      const targets = level.target.split('_');
      filtered = ALL_GAME_DATA.filter(q => targets.includes(q.target) || targets.includes(q.target.split('_')[0]));
      // Fallback
      if (filtered.length < 5) filtered = ALL_GAME_DATA.filter(q => ['A', 'E', 'I', 'O', 'U'].includes(q.target) || q.target === 'M');
    } else {
      // Specific target
      filtered = ALL_GAME_DATA.filter(q => q.target === level.target || q.answer === level.target || q.answer === level.target.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
      // Fallback
      if (filtered.length < 5) filtered = ALL_GAME_DATA;
    }
    
    // Shuffle and pick 5
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id]);

  const TOTAL_QUESTIONS = Math.min(5, questions.length);
  const current = questions[questionIndex];

  useEffect(() => {
    setSelected(null);
    setFeedback(null);
    // Speak the hint after a short delay
    if (current) {
      const t = setTimeout(() => speak(current.hint), 400);
      return () => clearTimeout(t);
    }
  }, [questionIndex, current]);

  const handleSelect = useCallback((option) => {
    if (feedback) return;
    setSelected(option);
    speak(option);

    if (option === current.answer) {
      setFeedback('correct');
      setTimeout(() => {
        if (questionIndex < TOTAL_QUESTIONS - 1) {
          setQuestionIndex(q => q + 1);
        } else {
          // Calculate stars
          const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
          completeLevel(level.id, stars);
          setShowCelebration(true);
        }
      }, 700);
    } else {
      // Clearly mark error to user: red button + shake + feedback text + speech
      setFeedback('wrong');
      setErrors(e => e + 1);
      recordMistake(current.answer);
      speak('Intenta de nuevo');
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
      }, 1000);
    }
  }, [feedback, current, questionIndex, errors, level, completeLevel, recordMistake, TOTAL_QUESTIONS]);

  const handleContinue = () => {
    setShowCelebration(false);
    onComplete();
  };

  if (!current) return null;

  // Render word with blank
  const renderWord = () => {
    const syllableLen = current.answer.length;
    const formattedAnswer = formatText(current.answer, current.answer.length === 1 ? 'letter' : 'syllable');
    const restOfWord = current.blank === 0 ? current.word.slice(syllableLen) : current.word.slice(0, -syllableLen);
    const formattedRest = formatText(restOfWord, 'word');

    const wordDisplay = current.blank === 0
      ? (
        <>
          <span className="game-word-blank">{feedback === 'correct' ? formattedAnswer : '___'}</span>
          {formattedRest.toLowerCase()}
        </>
      )
      : (
        <>
          {formattedRest}
          <span className="game-word-blank">{feedback === 'correct' ? formattedAnswer : '___'}</span>
        </>
      );
    return <div className="game-word-display">{wordDisplay}</div>;
  };

  if (showCelebration) {
    const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
    return <CelebrationModal stars={stars} onContinue={handleContinue} />;
  }

  return (
    <div className="screen">
      <div className="game-screen-content">
        {/* Progress */}
        <div style={{ width: '100%' }}>
          <p className="game-question-label">
            Pregunta {questionIndex + 1} de {TOTAL_QUESTIONS}
          </p>
          <div className="game-progress-bar" role="progressbar" aria-valuenow={questionIndex + 1} aria-valuemax={TOTAL_QUESTIONS}>
            <div
              className="game-progress-fill"
              style={{ width: `${((questionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>
        </div>

        {/* Level type indicator */}
        {level.type === 'repaso' && (
          <div style={{ background: '#FFD600', color: '#7B6600', padding: '4px 12px', borderRadius: 20, fontWeight: 800, fontSize: 13, alignSelf: 'center', marginTop: '-12px' }}>
            Nivel de Repaso 🔄
          </div>
        )}

        {/* Image */}
        <div
          className="game-image-card"
          onClick={() => speak(current.hint)}
          role="button"
          aria-label={`Imagen: ${current.hint}. Toca para escuchar`}
          id="game-image"
        >
          <span className="game-image-emoji">{current.emoji}</span>
        </div>

        {/* Word with blank */}
        {renderWord()}

        {/* Options */}
        <div className="game-options" role="group" aria-label="Elige la opción correcta">
          {current.options.map(option => {
            let btnClass = 'option-btn';
            if (selected === option) {
              btnClass += feedback === 'correct' ? ' correct' : ' wrong';
            } else if (feedback === 'correct' && option === current.answer && selected !== option) {
              btnClass += ' correct';
            }
            return (
              <button
                key={option}
                id={`option-${option}`}
                className={btnClass}
                onClick={() => handleSelect(option)}
                aria-label={`Opción: ${option}`}
                disabled={!!feedback && feedback === 'correct'}
              >
                {formatText(option, option.length === 1 ? 'letter' : 'syllable')}
              </button>
            );
          })}
        </div>

        {/* Speech Microphone Option */}
        <div className="game-mic-section">
          <p className="game-mic-hint">🎙️ ¿Quieres responder con el micrófono?</p>
          <SpeechMicButton
            targetText={current.answer}
            disabled={!!feedback && feedback === 'correct'}
            onResult={(res) => {
              if (res.success) {
                handleSelect(current.answer);
              } else if (res.text) {
                // If wrong speech, simulate selecting an incorrect option or showing feedback
                handleSelect(res.normalized || 'WRONG');
              }
            }}
          />
        </div>

        {/* Feedback text */}
        <p className={`game-feedback ${feedback === 'correct' ? 'feedback-correct' : feedback === 'wrong' ? 'feedback-wrong' : ''}`}>
          {feedback === 'correct' ? '¡Muy bien! ⭐' : feedback === 'wrong' ? 'Inténtalo de nuevo 💪' : ' '}
        </p>
      </div>
    </div>
  );
}
