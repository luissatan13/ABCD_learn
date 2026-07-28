import React from 'react';
import { useApp } from './AppContext';

export function SettingsModal({ onClose }) {
  const { user, profile, logout } = useApp();

  const handleLogout = () => {
    logout();
    onClose();
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

        <div className="settings-item">
          <span className="settings-item-label">🔊 Voz</span>
          <span className="settings-item-value">Activada</span>
        </div>

        <div className="settings-item">
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
