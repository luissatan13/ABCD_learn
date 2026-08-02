import React, { useState, useEffect, useRef, useCallback } from 'react';

// Speech Recognition helper supporting webkit and standard APIs
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export function SpeechMicButton({ targetText, onResult, disabled = false }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [hasSupport, setHasSupport] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      setHasSupport(false);
    }
  }, []);

  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toUpperCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^A-ZÑ]/g, ''); // keep only letters
  };

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      setErrorMsg('Micrófono no soportado en este navegador');
      if (onResult) onResult({ success: false, text: '', error: 'not_supported' });
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      let finalTranscript = '';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
        setTranscript('Escuchando...');
      };

      recognition.onresult = (event) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
        finalTranscript = current;
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          setErrorMsg('No escuché nada. ¡Intenta de nuevo!');
          setTranscript('');
          if (onResult) onResult({ success: false, text: '', error: 'no-speech' });
        } else if (event.error === 'not-allowed') {
          setErrorMsg('Permiso de micrófono denegado');
          setTranscript('');
          if (onResult) onResult({ success: false, text: '', error: 'not-allowed' });
        } else {
          setErrorMsg('Reintenta hablar más fuerte');
          setTranscript('');
          if (onResult) onResult({ success: false, text: '', error: event.error });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const normRecognized = normalizeText(finalTranscript);
        const normTarget = normalizeText(targetText);

        if (normRecognized) {
          // Flexible matching for kids: check exact match or if target is substring of recognized or vice versa
          const isMatch =
            normRecognized === normTarget ||
            normRecognized.includes(normTarget) ||
            normTarget.includes(normRecognized);

          if (onResult) {
            onResult({
              success: isMatch,
              text: finalTranscript,
              normalized: normRecognized,
              target: normTarget,
            });
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
      setErrorMsg('Error al activar el micrófono');
    }
  }, [targetText, onResult]);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleMicClick = () => {
    if (disabled) return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="speech-mic-container">
      <button
        type="button"
        id="speech-mic-button"
        className={`speech-mic-btn ${isListening ? 'listening' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleMicClick}
        disabled={disabled}
        aria-label={isListening ? 'Detener micrófono' : 'Hablar por el micrófono'}
        title="Presiona y habla por el micrófono"
      >
        <span className="speech-mic-icon">🎙️</span>
        {isListening && (
          <span className="speech-mic-waves" aria-hidden="true">
            <span className="wave w1"></span>
            <span className="wave w2"></span>
            <span className="wave w3"></span>
          </span>
        )}
      </button>

      <div className="speech-mic-status">
        {isListening ? (
          <p className="speech-status-listening">
            <span className="speech-pulse-dot">🔴</span> Escuchando... ¡Di &quot;<strong>{targetText}</strong>&quot;!
          </p>
        ) : transcript ? (
          <p className="speech-status-text">Escuché: &quot;{transcript}&quot;</p>
        ) : (
          <p className="speech-status-prompt">Toca el micrófono y di &quot;<strong>{targetText}</strong>&quot;</p>
        )}
        {errorMsg && <p className="speech-status-error">{errorMsg}</p>}
        {!hasSupport && (
          <p className="speech-status-warning">
            ⚠️ Tu navegador no soporta reconocimiento de voz. Puedes usar el modo de botones.
          </p>
        )}
      </div>
    </div>
  );
}
