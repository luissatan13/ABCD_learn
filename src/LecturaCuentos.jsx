import React, { useState, useEffect, useRef } from 'react';
import { useApp } from './AppContext';
import { SpeechMicButton } from './SpeechMicButton';

const ORACIONES = [
  { id: 'o1', title: 'La Mamá', text: 'La mamá ama a su hijo', emoji: '👩‍👦', category: 'Oración' },
  { id: 'o2', title: 'El Perro', text: 'El perro corre feliz en el parque', emoji: '🐶', category: 'Oración' },
  { id: 'o3', title: 'El Gato', text: 'El gato bebe su leche tibia', emoji: '🐱', category: 'Oración' },
  { id: 'o4', title: 'El Sol', text: 'El sol brilla alto en el cielo', emoji: '☀️', category: 'Oración' },
  { id: 'o5', title: 'La Luna', text: 'La luna ilumina toda la noche', emoji: '🌙', category: 'Oración' },
  { id: 'o6', title: 'La Fruta', text: 'Ana come una dulce uva morada', emoji: '🍇', category: 'Oración' },
];

const CUENTOS = [
  {
    id: 'c1',
    title: 'El Búho Lector',
    emoji: '🦉',
    category: 'Cuento',
    summary: 'Había una vez un búho muy sabio. Le gustaba leer cuentos bonitos bajo la luz de la luna. Todos los animales del bosque venían a escucharlo.',
  },
  {
    id: 'c2',
    title: 'El Gatito Curioso',
    emoji: '🐱',
    category: 'Cuento',
    summary: 'El gatito Misu encontró un suave ovillo de lana roja. Saltó sobre la lana y empujó la bola por la sala. Jugó alegremente hasta quedar dormido.',
  },
  {
    id: 'c3',
    title: 'Viaje a las Estrellas',
    emoji: '🚀',
    category: 'Cuento',
    summary: 'Sofi soñaba con volar al espacio. Construyó un lindo cohete de cartón. Se puso su casco brillante y viajó a las estrellas con su perrito.',
  },
  {
    id: 'c4',
    title: 'El Oso y la Miel',
    emoji: '🐻',
    category: 'Cuento',
    summary: 'El oso Barnaby encontró miel muy dulce en un gran árbol. Comió con mucha alegría y dio las gracias a las abejas por el regalo.',
  },
];

export function LecturaCuentos() {
  const { speak } = useApp();
  const [contentType, setContentType] = useState('oraciones'); // 'oraciones' | 'cuentos'
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Highlighting and reading state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSpeed, setPlayingSpeed] = useState(null); // 'slow' | 'normal' | null
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [micSuccess, setMicSuccess] = useState(null);
  const playTimerRef = useRef(null);

  const items = contentType === 'oraciones' ? ORACIONES : CUENTOS;
  const currentItem = items[selectedIndex] || items[0];

  const words = React.useMemo(() => {
    const text = currentItem.text || currentItem.summary || '';
    return text.split(' ');
  }, [currentItem]);

  // Clean timer on unmount or item change
  useEffect(() => {
    stopPlayback();
    setMicSuccess(null);
  }, [selectedIndex, contentType]);

  const stopPlayback = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (playTimerRef.current) clearInterval(playTimerRef.current);
    setIsPlaying(false);
    setPlayingSpeed(null);
    setActiveWordIndex(-1);
  };

  // Handle word click
  const handleWordClick = (word, index) => {
    stopPlayback();
    setActiveWordIndex(index);
    const cleanWord = word.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
    speak(cleanWord, true); // Speak single word slowly
    setTimeout(() => setActiveWordIndex(-1), 1200);
  };

  // Play full text with slow (turtle) or normal speed
  const handlePlayFullText = (speedMode = 'slow') => {
    if (isPlaying && playingSpeed === speedMode) {
      stopPlayback();
      return;
    }

    stopPlayback();

    setIsPlaying(true);
    setPlayingSpeed(speedMode);

    const isSlow = speedMode === 'slow';
    const intervalMs = isSlow ? 950 : 550; // 950ms interval for turtle slow mode

    let index = 0;
    setActiveWordIndex(0);

    // Speak first word
    const cleanFirst = words[0].replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
    speak(cleanFirst, isSlow);

    // Interval to advance highlighted word in sync
    playTimerRef.current = setInterval(() => {
      index++;
      if (index < words.length) {
        setActiveWordIndex(index);
        const cleanW = words[index].replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
        speak(cleanW, isSlow);
      } else {
        clearInterval(playTimerRef.current);
        setIsPlaying(false);
        setPlayingSpeed(null);
        setActiveWordIndex(-1);
        speak('¡Muy bien hecho!', isSlow);
      }
    }, intervalMs);
  };

  // Mic reading result
  const handleMicResult = (res) => {
    if (res.success) {
      setMicSuccess(true);
      speak('¡Fantástico! Leíste súper bien. 🎉', false);
    } else {
      setMicSuccess(false);
      speak('¡Buen intento! Toca una palabra si quieres volver a escucharla.', false);
    }
  };

  return (
    <div className="lectura-cuentos-container card">
      {/* Category selector */}
      <div className="cuentos-type-selector">
        <button
          className={`cuentos-type-btn ${contentType === 'oraciones' ? 'active' : ''}`}
          onClick={() => {
            setContentType('oraciones');
            setSelectedIndex(0);
          }}
        >
          📝 Oraciones Cortas
        </button>
        <button
          className={`cuentos-type-btn ${contentType === 'cuentos' ? 'active' : ''}`}
          onClick={() => {
            setContentType('cuentos');
            setSelectedIndex(0);
          }}
        >
          📚 Cuentos Resumidos
        </button>
      </div>

      {/* Main Reading Frame */}
      <div className="reading-frame">
        <div className="reading-header">
          <span className="reading-emoji">{currentItem.emoji}</span>
          <h2 className="reading-title">{currentItem.title}</h2>
          <span className="reading-badge">{currentItem.category}</span>
        </div>

        <p className="reading-instruction">
          👉 Toca cualquier palabra para escucharla despacito:
        </p>

        {/* Interactive Words Display */}
        <div className="reading-words-box">
          {words.map((word, idx) => (
            <button
              key={idx}
              className={`word-interactive ${activeWordIndex === idx ? 'highlighted' : ''}`}
              onClick={() => handleWordClick(word, idx)}
            >
              {word}
            </button>
          ))}
        </div>

        {/* Audio Speed Assistance Buttons */}
        <div className="reading-speed-container">
          <p className="speed-title-label">Escuchar lectura completa:</p>

          <div className="reading-actions">
            {/* Turtle Mode (Slow Reading) */}
            <button
              className={`btn-primary btn-speed-turtle ${isPlaying && playingSpeed === 'slow' ? 'playing' : ''}`}
              onClick={() => handlePlayFullText('slow')}
              aria-label="Escuchar lectura despacio modo tortuga"
            >
              <span className="btn-speed-icon">🐢</span>
              <span>{isPlaying && playingSpeed === 'slow' ? '⏹️ Detener' : 'Lectura Lenta (Tortuga)'}</span>
            </button>

            {/* Normal Speed */}
            <button
              className={`btn-secondary btn-speed-normal ${isPlaying && playingSpeed === 'normal' ? 'playing' : ''}`}
              onClick={() => handlePlayFullText('normal')}
              aria-label="Escuchar lectura normal"
            >
              <span>{isPlaying && playingSpeed === 'normal' ? '⏹️ Detener' : '🔊 Normal'}</span>
            </button>
          </div>
        </div>

        <hr className="silabica-divider" />

        {/* Mic Challenge Mode */}
        <div className="reading-mic-challenge">
          <h3 className="mic-challenge-title">🎙️ Desafío: ¡Leo Yo en Voz Alta!</h3>
          <p className="mic-challenge-desc">
            Presiona el micrófono y lee la primera oración:
          </p>

          <SpeechMicButton
            targetText={words.slice(0, 3).join(' ')}
            onResult={handleMicResult}
          />

          {micSuccess === true && (
            <div className="mic-feedback-banner success" style={{ marginTop: 10 }}>
              ⭐ ¡Increíble lectura! Ganaste estrellas de lector. 🎉
            </div>
          )}
          {micSuccess === false && (
            <div className="mic-feedback-banner error" style={{ marginTop: 10 }}>
              💪 Sigue practicando. Toca el botón 🐢 para escuchar despacio.
            </div>
          )}
        </div>

        {/* Story Pagination Navigation */}
        <div className="word-nav-controls" style={{ marginTop: 16 }}>
          <button
            className="btn-secondary"
            onClick={() => setSelectedIndex(i => (i > 0 ? i - 1 : items.length - 1))}
          >
            ⬅️ Anterior
          </button>
          <span className="word-count-label">
            {contentType === 'oraciones' ? 'Oración' : 'Cuento'} {selectedIndex + 1} de {items.length}
          </span>
          <button
            className="btn-secondary"
            onClick={() => setSelectedIndex(i => (i < items.length - 1 ? i + 1 : 0))}
          >
            Siguiente ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
