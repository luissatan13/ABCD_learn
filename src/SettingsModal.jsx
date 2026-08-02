import React from 'react';
import { useApp } from './AppContext';

export function SettingsModal({ onClose }) {
  const { user, profile, logout, voiceGender, setVoiceGender, speak } = useApp();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleSelectVoice = (gender) => {
    setVoiceGender(gender);
    const msg = gender === 'female' ? '¡Hola! Soy la voz femenina.' : '¡Hola! Soy la voz masculina.';
    // Small timeout so state updates
    setTimeout(() => {
      speak(msg);
    }, 50);
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
      <div
        className="settings-sheet"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="settings-title">⚙️ Configuración</h2>

        <div className="settings-item">
          <span className="settings-item-label">👤 Explorador</span>
          <span className="settings-item-value">{profile?.name || 'Sin nombre'}</span>
        </div>

        <div className="settings-item">
          <span className="settings-item-label">📧 Cuenta</span>
          <span className="settings-item-value" style={{ fontSize: 12 }}>
            {user?.email || 'No conectado'}
          </span>
        </div>

        {/* Voice Selector */}
        <div className="settings-item-col">
          <span className="settings-item-label">🎙️ Selección de Voz</span>
          <div className="voice-selector-grid">
            <button
              className={`voice-select-btn ${voiceGender === 'male' ? 'active' : ''}`}
              onClick={() => handleSelectVoice('male')}
            >
              👨 Masculina
            </button>
            <button
              className={`voice-select-btn ${voiceGender === 'female' ? 'active' : ''}`}
              onClick={() => handleSelectVoice('female')}
            >
              👩 Femenina
            </button>
          </div>
          <button
            className="voice-test-btn"
            onClick={() => speak(voiceGender === 'female' ? '¡Hola! Esta es la voz femenina.' : '¡Hola! Esta es la voz masculina.')}
          >
            🔊 Probar Voz ({voiceGender === 'female' ? 'Femenina' : 'Masculina'})
          </button>
        </div>

        <div className="settings-item" style={{ marginTop: 8 }}>
          <span className="settings-item-label">🌐 Idioma</span>
          <span className="settings-item-value">Español</span>
        </div>

        <button
          id="logout-btn"
          className="logout-btn"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
