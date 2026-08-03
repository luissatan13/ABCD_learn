import React from 'react';

// SVG Icons — crisper than emojis on all screens
const MapIcon = ({ active }) => (
  <svg className="nav-svg" viewBox="0 0 24 24" fill="none">
    <path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" stroke={active ? 'white' : '#64748B'} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 3v15M15 6v15" stroke={active ? 'white' : '#64748B'} strokeWidth="1.8"/>
  </svg>
);

const GameIcon = ({ active }) => (
  <svg className="nav-svg" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="7" width="20" height="14" rx="3" stroke={active ? 'white' : '#64748B'} strokeWidth="1.8"/>
    <path d="M8 14h4M10 12v4" stroke={active ? 'white' : '#64748B'} strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="16" cy="13" r="1" fill={active ? 'white' : '#64748B'}/>
    <circle cx="16" cy="16" r="1" fill={active ? 'white' : '#64748B'}/>
    <path d="M7 3l2 4M17 3l-2 4" stroke={active ? 'white' : '#64748B'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const LetrasIcon = ({ active }) => (
  <svg className="nav-svg" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke={active ? 'white' : '#64748B'} strokeWidth="1.8"/>
    <path d="M8 16l2-5 2 5M9.5 13.5h3" stroke={active ? 'white' : '#64748B'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 9v7" stroke={active ? 'white' : '#64748B'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const TrophyIcon = ({ active }) => (
  <svg className="nav-svg" viewBox="0 0 24 24" fill="none">
    <path d="M8 21h8M12 17v4" stroke={active ? 'white' : '#64748B'} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M6 3H18v7a6 6 0 01-12 0V3z" stroke={active ? 'white' : '#64748B'} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M6 6H3a2 2 0 002 2l1-2zM18 6h3a2 2 0 01-2 2l-1-2z" stroke={active ? 'white' : '#64748B'} strokeWidth="1.8"/>
  </svg>
);

const NAV_ITEMS = [
  { id: 'mapa',    label: 'Mapa',    Icon: MapIcon    },
  { id: 'juegos',  label: 'Juegos',  Icon: GameIcon   },
  { id: 'letras',  label: 'Letras',  Icon: LetrasIcon },
  { id: 'premios', label: 'Premios', Icon: TrophyIcon },
];

export function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            id={`nav-${id}`}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onNavigate(id)}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="nav-pill">
              <Icon active={isActive} />
            </span>
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
