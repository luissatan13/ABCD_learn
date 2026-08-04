import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { LoginScreen } from './LoginScreen';
import { ProfileScreen } from './ProfileScreen';
import { MapScreen } from './MapScreen';
import { GameScreen } from './GameScreen';
import { LetrasScreen } from './LetrasScreen';
import { PremiosScreen } from './PremiosScreen';
import { CuentosScreen } from './CuentosScreen';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SettingsModal } from './SettingsModal';

function App() {
  const { user, profile, theme } = useApp();
  const [activeTab, setActiveTab] = useState('mapa');
  const [showSettings, setShowSettings] = useState(false);
  const [currentGame, setCurrentGame] = useState(null); // level object

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
        return (
          <GameScreen
            level={{ id: 99, label: 'Práctica Libre', type: 'silaba', target: 'MA', status: 'current' }}
            onComplete={() => setActiveTab('mapa')}
          />
        );
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
    </>
  );
}

export default App;
