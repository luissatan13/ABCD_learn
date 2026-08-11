import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from './AppContext';
import { getSpanishVoices, getAllVoices, previewVoice, stopSpeech } from './speechUtils';

const SPEED_LABELS = ['🐢 Muy Lenta', '🐌 Lenta', '🐇 Normal', '⚡ Rápida'];

const VOICE_TYPES = [
  { id: 'male',   label: '👨 Masculina' },
  { id: 'female', label: '👩 Femenina'  },
  { id: 'child',  label: '🧒 Niño/a'   },
];

export function SettingsModal({ onClose }) {
  const {
    user, profile, logout,
    voiceGender, setVoiceGender,
    voiceName, setVoiceName,
    readSpeed, setReadSpeed,
    speak,
    theme, setTheme,
    letterCase, setLetterCase,
    isPremium, setShowPaywall, resetPremium,
  } = useApp();

  const [voices, setVoices] = useState([]);
  const [showAllVoices, setShowAllVoices] = useState(false);
  const [previewingVoice, setPreviewingVoice] = useState(null);

  // Load voices on mount (they may not be ready yet)
  const loadVoices = useCallback(() => {
    const spanish = getSpanishVoices();
    const all = getAllVoices();
    setVoices(showAllVoices ? all : spanish);
  }, [showAllVoices]);

  useEffect(() => {
    loadVoices();
    // Some browsers fire voiceschanged after a short delay
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [loadVoices]);

  const handleLogout = () => { logout(); onClose(); };

  const handleSelectVoiceType = (type) => {
    setVoiceGender(type);
    setVoiceName(null); // reset specific voice — auto pick by gender
    setTimeout(() => speak('¡Hola! Esta es tu nueva voz.'), 80);
  };

  const handlePreviewVoice = (e, vName) => {
    e.stopPropagation();
    setPreviewingVoice(vName);
    previewVoice(vName, voiceGender);
    setTimeout(() => setPreviewingVoice(null), 3000);
  };

  const handleSelectSpecificVoice = (vName) => {
    setVoiceName(vName);
    setTimeout(() => {
      previewVoice(vName, voiceGender);
    }, 60);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Configuración"
      id="settings-modal"
    >
      <div className="settings-sheet" onClick={e => e.stopPropagation()}>

        {/* Drag handle */}
        <div className="settings-drag-handle" />

        <h2 className="settings-title">⚙️ Configuración</h2>

        {/* Profile info */}
        <div className="settings-section">
          <div className="settings-section-title">Cuenta</div>
          <div className="settings-row">
            <span className="settings-row-label">👤 Explorador</span>
            <span className="settings-row-value">{profile?.name || 'Sin nombre'}</span>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">📧 Email</span>
            <span className="settings-row-value" style={{ fontSize: 12 }}>
              {user?.email || 'No conectado'}
            </span>
          </div>
        </div>

        {/* Voice type selector */}
        <div className="settings-section">
          <div className="settings-section-title">🎙️ Tipo de Voz</div>
          <div className="voice-type-row">
            {VOICE_TYPES.map(t => (
              <button
                key={t.id}
                className={`voice-type-pill ${voiceGender === t.id ? 'active' : ''}`}
                onClick={() => handleSelectVoiceType(t.id)}
                id={`voice-type-${t.id}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Voice list */}
          <div className="settings-section-title" style={{ marginTop: 12 }}>
            Voz del sistema
            <button
              onClick={() => setShowAllVoices(v => !v)}
              style={{
                marginLeft: 8, background: 'none', border: 'none',
                color: 'var(--cyan)', fontSize: 11, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              }}
            >
              {showAllVoices ? '← Solo español' : 'Ver todas →'}
            </button>
          </div>

          <div className="voice-list" role="listbox" aria-label="Lista de voces disponibles">
            {voices.length === 0 ? (
              <div className="voice-empty">
                No se encontraron voces en este dispositivo.<br />
                <small>Instala voces en español en la configuración del sistema.</small>
              </div>
            ) : (
              voices.map(v => {
                const isSelected = voiceName ? voiceName === v.name : false;
                const isOnline = !v.localService;
                return (
                  <div
                    key={v.name}
                    className={`voice-list-item ${isSelected ? 'selected' : ''}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectSpecificVoice(v.name)}
                  >
                    <div className="voice-list-dot" />
                    <div className="voice-list-info">
                      <div className="voice-list-name">{v.name}</div>
                      <div className="voice-list-lang">{v.lang}</div>
                    </div>
                    {isOnline && (
                      <span className="voice-list-quality">HD</span>
                    )}
                    <button
                      className="voice-preview-btn"
                      onClick={e => handlePreviewVoice(e, v.name)}
                      aria-label={`Probar voz ${v.name}`}
                      title="Probar esta voz"
                    >
                      {previewingVoice === v.name ? '⏸' : '▶'}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {voiceName && (
            <button
              style={{
                width: '100%', padding: '8px', background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              }}
              onClick={() => { setVoiceName(null); setTimeout(() => speak('Voz automática activada.'), 60); }}
            >
              ↩ Restablecer a automático
            </button>
          )}
        </div>

        {/* Read speed */}
        <div className="settings-section">
          <div className="settings-section-title">⚡ Velocidad de Lectura</div>
          <div style={{ padding: '12px 16px', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-bright)' }}>
                {SPEED_LABELS[readSpeed]}
              </span>
            </div>
            <div className="speed-slider-row">
              <span className="speed-label" style={{ fontSize: 18 }}>🐢</span>
              <input
                className="speed-slider"
                type="range"
                min={0}
                max={3}
                step={1}
                value={readSpeed}
                onChange={e => setReadSpeed(Number(e.target.value))}
                aria-label="Velocidad de lectura"
                id="speed-slider"
              />
              <span className="speed-label" style={{ fontSize: 18 }}>⚡</span>
            </div>
          </div>
        </div>

        {/* Letter Case Selector */}
        <div className="settings-section">
          <div className="settings-section-title">🔤 Tipo de Letras</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`voice-type-pill ${letterCase === 'both' ? 'active' : ''}`}
              onClick={() => setLetterCase('both')}
              style={{ flex: 1, padding: '10px 4px', fontSize: '12px' }}
              id="letter-case-both"
            >
              🔤 Ambas (Aa)
            </button>
            <button
              className={`voice-type-pill ${letterCase === 'lowercase' ? 'active' : ''}`}
              onClick={() => setLetterCase('lowercase')}
              style={{ flex: 1, padding: '10px 4px', fontSize: '12px' }}
              id="letter-case-lowercase"
            >
              🔡 Minúsculas
            </button>
            <button
              className={`voice-type-pill ${letterCase === 'uppercase' ? 'active' : ''}`}
              onClick={() => setLetterCase('uppercase')}
              style={{ flex: 1, padding: '10px 4px', fontSize: '12px' }}
              id="letter-case-uppercase"
            >
              🔠 Mayúsculas
            </button>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="settings-section">
          <div className="settings-section-title">🦄 Tema de la App</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className={`voice-type-pill ${theme === 'default' ? 'active' : ''}`}
              onClick={() => setTheme('default')}
              style={{ flex: 1, padding: '10px', fontSize: '13px' }}
            >
              🚀 Espacio (Oscuro)
            </button>
            <button
              className={`voice-type-pill ${theme === 'unicorn' ? 'active' : ''}`}
              onClick={() => setTheme('unicorn')}
              style={{ 
                flex: 1, 
                padding: '10px', 
                fontSize: '13px',
                background: theme === 'unicorn' ? 'linear-gradient(135deg, var(--pink), var(--purple))' : ''
              }}
            >
              🦄 Unicornio (Pastel)
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="settings-section">
          <div className="settings-row">
            <span className="settings-row-label">🌐 Idioma</span>
            <span className="settings-row-value">Español</span>
          </div>
        </div>

        {/* Membership & Paywall Testing */}
        <div className="settings-section">
          <div className="settings-section-title">Membresía & Pagos</div>
          <div className="settings-row">
            <span className="settings-row-label">👑 Estado de Cuenta</span>
            <span className="settings-row-value" style={{ color: isPremium ? '#F5C800' : 'var(--text-muted)', fontWeight: 800 }}>
              {isPremium ? '⭐ PREMIUM' : '🆓 GRATUITO'}
            </span>
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              onClose();
              setShowPaywall(true);
            }}
            style={{ width: '100%', marginTop: 8, fontSize: 13, padding: 10, background: 'linear-gradient(135deg, #F59E0B, #EC4899)' }}
          >
            💳 Abrir Pantalla de Suscripción (Mercado Pago)
          </button>

          {isPremium && (
            <button
              className="btn-secondary"
              onClick={() => {
                resetPremium();
                alert('Modo Gratuito activado. Ahora verás los candados en niveles y rompecabezas.');
              }}
              style={{ width: '100%', marginTop: 6, fontSize: 12, padding: 8 }}
            >
              🔄 Volver a Modo Gratuito (Para probar candados)
            </button>
          )}
        </div>

        <button
          id="logout-btn"
          className="logout-btn"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
