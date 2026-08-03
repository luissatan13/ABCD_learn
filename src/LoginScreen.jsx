import React from 'react';
import { useApp } from './AppContext';

// Generate random star positions (stable — computed once outside component)
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  top:      `${(i * 7.3 + 3) % 100}%`,
  left:     `${(i * 13.7 + 5) % 100}%`,
  size:     (i % 3) + 1.5,
  duration: `${(i % 3) + 2}s`,
  delay:    `${(i % 5) * 0.7}s`,
}));

export function LoginScreen({ onLoginSuccess }) {
  const { login } = useApp();

  return (
    <div className="login-screen">
      {/* Animated star field */}
      <div className="login-stars" aria-hidden="true">
        {STARS.map(s => (
          <div
            key={s.id}
            className="login-star"
            style={{
              top:               s.top,
              left:              s.left,
              width:             `${s.size}px`,
              height:            `${s.size}px`,
              animationDuration: s.duration,
              animationDelay:    s.delay,
            }}
          />
        ))}
      </div>

      {/* Glowing ambient orbs */}
      <div className="login-orb login-orb-1" aria-hidden="true" />
      <div className="login-orb login-orb-2" aria-hidden="true" />
      <div className="login-orb login-orb-3" aria-hidden="true" />

      {/* Mascot */}
      <div className="login-mascot-container">
        <div className="login-mascot-card">
          <img src="/owl_mascot.png" alt="Búho explorador mascota de Aventura de Leer" />
        </div>
      </div>

      {/* Headline */}
      <div className="login-text">
        <h1 className="login-title">
          ¡Hola, Pequeño<br />
          <span>Explorador!</span>
        </h1>
        <p className="login-subtitle">¿Listo para tu aventura mágica de lectura? ✨</p>
      </div>

      {/* Auth buttons */}
      <div className="login-buttons">
        <button
          id="guest-login-btn"
          className="btn-primary btn-gold"
          onClick={() => {
            login({
              name: 'Invitado',
              email: 'invitado@abcd.learn',
              picture: '/owl_mascot.png',
              sub: 'guest-123',
            });
            onLoginSuccess();
          }}
          aria-label="Entrar como Invitado"
        >
          🎮 Entrar como Invitado
        </button>
      </div>
    </div>
  );
}
