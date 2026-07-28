import React from 'react';

const NAV_ITEMS = [
  { id: 'mapa', label: 'Mapa', icon: '🗺️' },
  { id: 'juegos', label: 'Juegos', icon: '🎮' },
  { id: 'letras', label: 'Letras', icon: '🔤' },
  { id: 'premios', label: 'Premios', icon: '🏆' },
];

export function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          id={`nav-${item.id}`}
          className={`nav-item ${active === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
          aria-label={item.label}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <span className={`nav-pill`}>
            <span className="nav-icon">{item.icon}</span>
          </span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
