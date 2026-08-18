import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { LoginScreen } from './LoginScreen';
import { ProfileScreen } from './ProfileScreen';
import { MapScreen } from './MapScreen';
import { JuegosHub } from './JuegosHub';
import { LetrasScreen } from './LetrasScreen';
import { PremiosScreen } from './PremiosScreen';
import { CuentosScreen } from './CuentosScreen';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SettingsModal } from './SettingsModal';
import { PaywallModal } from './PaywallModal';

function App() {
  const { user, profile, authLoading, theme, showPaywall, setShowPaywall, activatePremium } = useApp();
  const [activeTab, setActiveTab] = useState('mapa');
  const [showSettings, setShowSettings] = useState(false);
  const [currentGame, setCurrentGame] = useState(null); // level object

  // Handle Mercado Pago return redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment');
      const collectionStatus = params.get('collection_status') || params.get('status');

      if (paymentStatus === 'success' || collectionStatus === 'approved') {
        activatePremium();
        alert('🎉 ¡Pago completado con éxito! Se ha activado tu suscripción PREMIUM ⭐.');
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (paymentStatus === 'failure') {
        alert('❌ No se pudo completar el pago en Mercado Pago. Puedes intentarlo de nuevo.');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [activatePremium]);

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      // Remove old theme classes
      Array.from(root.classList).forEach(c => {
        if (c.startsWith('theme-')) {
          root.classList.remove(c);
        }
      });
      // Add new theme class
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  // ---- AUTH LOADING ----
  if (authLoading) {
    return (
      <div className="login-screen" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <div className="login-mascot-card" style={{ width: 100, height: 100 }}>
          <img src="/owl_mascot.png" alt="Cargando..." style={{ animation: 'bounce 1s infinite alternate' }} />
        </div>
        <p style={{ color: 'white', marginTop: 16, fontWeight: 'bold', fontSize: 18, fontFamily: 'Nunito, sans-serif' }}>
          Cargando tu progreso mágico... ✨
        </p>
      </div>
    );
  }

  // ---- AUTH FLOW ----
  if (!user) {
    return <LoginScreen onLoginSuccess={() => {}} />;
  }

  if (!profile) {
    return <ProfileScreen onDone={() => {}} />;
  }

  // ---- GAME IN PROGRESS ----
  if (currentGame) {
    return (
      <>
        <Header profile={profile} onSettingsClick={() => setShowSettings(true)} />
        <GameScreen
          level={currentGame}
          onComplete={() => {
            setCurrentGame(null);
            setActiveTab('mapa');
          }}
        />
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </>
    );
  }

  // ---- MAIN APP ----
  const renderContent = () => {
    switch (activeTab) {
      case 'mapa':
        return <MapScreen onPlayLevel={setCurrentGame} />;
      case 'juegos':
        return <JuegosHub />;
      case 'letras':
        return <LetrasScreen />;
      case 'cuentos':
        return <CuentosScreen />;
      case 'premios':
        return <PremiosScreen onGoToMap={() => setActiveTab('mapa')} />;
      default:
        return <MapScreen onPlayLevel={setCurrentGame} />;
    }
  };

  return (
    <>
      <Header profile={profile} onSettingsClick={() => setShowSettings(true)} />
      {renderContent()}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    </>
  );
}

export default App;
