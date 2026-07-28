import React from 'react';

export function Header({ onSettingsClick, profile }) {
  const avatarSrc = profile?.avatar?.src || '/owl_mascot.png';
  return (
    <header className="app-header">
      <div className="header-logo">
        <div className="header-avatar">
          <img src={avatarSrc} alt="Avatar" />
        </div>
        <span className="header-title">Aventura de Leer</span>
      </div>
      <button className="header-settings" onClick={onSettingsClick} id="settings-btn" aria-label="Configuración">
        ⚙️
      </button>
    </header>
  );
}
