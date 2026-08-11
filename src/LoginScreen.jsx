import React, { useState } from 'react';
import { useApp } from './AppContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase';

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
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      login({
        name: user.displayName || 'Explorador',
        email: user.email || '',
        picture: user.photoURL || '/owl_mascot.png',
        sub: user.uid,
      });
      onLoginSuccess();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("No se pudo iniciar sesión con Google. Si estás usando un dominio personalizado, asegúrate de haberlo agregado en Dominios Autorizados en Firebase Console.\n\nDetalle: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

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
        <p className="login-subtitle">Inicia sesión con tu cuenta de Google para guardar todo tu progreso mágico. ✨</p>
      </div>

      {/* Auth buttons */}
      <div className="login-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px' }}>
        <button
          id="google-login-btn"
          className="btn-primary"
          onClick={handleGoogleLogin}
          disabled={loading}
          aria-label="Iniciar sesión con Google"
          style={{
            background: 'white',
            color: '#3c4043',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '15px',
            fontWeight: '800',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <svg style={{ width: '20px', height: '20px', marginRight: '8px' }} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {loading ? 'Conectando...' : 'Iniciar sesión con Google'}
        </button>
      </div>
    </div>
  );
}
