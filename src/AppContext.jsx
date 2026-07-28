import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const AVATARS = [
  { id: 'owl', src: '/owl_mascot.png', label: 'Búho' },
  { id: 'puppy', src: '/avatar_puppy.png', label: 'Perrito' },
  { id: 'cat', src: '/avatar_cat.png', label: 'Gatito' },
  { id: 'turtle', src: '/avatar_turtle.png', label: 'Tortuga' },
  { id: 'girl', src: '/avatar_girl.png', label: 'Exploradora' },
];

const INITIAL_LEVELS = [
  { id: 1, label: 'Letra A', type: 'vocal', target: 'A', status: 'current', stars: 0 },
  { id: 2, label: 'Letra E', type: 'vocal', target: 'E', status: 'locked', stars: 0 },
  { id: 3, label: 'Letra I', type: 'vocal', target: 'I', status: 'locked', stars: 0 },
  { id: 4, label: 'Letra O', type: 'vocal', target: 'O', status: 'locked', stars: 0 },
  { id: 5, label: 'Letra U', type: 'vocal', target: 'U', status: 'locked', stars: 0 },
  { id: 6, label: 'Repaso Vocales', type: 'repaso', target: 'A_E_I_O_U', status: 'locked', stars: 0 },
  { id: 7, label: 'Sílabas M', type: 'silabas', target: 'M', status: 'locked', stars: 0 },
  { id: 8, label: 'Sílabas P', type: 'silabas', target: 'P', status: 'locked', stars: 0 },
  { id: 9, label: 'Repaso M y P', type: 'repaso', target: 'M_P', status: 'locked', stars: 0 },
  { id: 10, label: 'Sílabas S y L', type: 'silabas', target: 'S_L', status: 'locked', stars: 0 },
  { id: 11, label: 'Repaso Difíciles', type: 'repaso', target: 'DIFFICULT', status: 'locked', stars: 0 },
];

const INITIAL_MEDALS = [
  { id: 'primera', label: 'Primera Letra', sub: '¡Completaste A!', emoji: '🅰️', earned: true },
  { id: 'estrella', label: 'Súper Estrella', sub: '3 estrellas seguidas', emoji: '⭐', earned: false },
  { id: 'rapido', label: 'Veloz', sub: 'Sin errores', emoji: '⚡', earned: false },
  { id: 'silaba', label: 'Silábico', sub: 'Aprende 5 sílabas', emoji: '🔤', earned: false },
  { id: 'lector', label: 'Lector', sub: 'Completa 3 niveles', emoji: '📖', earned: false },
  { id: 'misterio', label: 'Misterio', sub: 'Sigue jugando', emoji: '🔒', earned: false },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adl_user')) || null; }
    catch { return null; }
  });

  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adl_profile')) || null; }
    catch { return null; }
  });

  const [levels, setLevels] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adl_levels')) || INITIAL_LEVELS; }
    catch { return INITIAL_LEVELS; }
  });

  const [medals, setMedals] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adl_medals')) || INITIAL_MEDALS; }
    catch { return INITIAL_MEDALS; }
  });

  const [xp, setXp] = useState(() => {
    try { return parseInt(localStorage.getItem('adl_xp')) || 120; }
    catch { return 120; }
  });

  const [mistakes, setMistakes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adl_mistakes')) || {}; }
    catch { return {}; }
  });

  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    if (user) localStorage.setItem('adl_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (profile) localStorage.setItem('adl_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('adl_levels', JSON.stringify(levels));
  }, [levels]);

  useEffect(() => {
    localStorage.setItem('adl_medals', JSON.stringify(medals));
  }, [medals]);

  useEffect(() => {
    localStorage.setItem('adl_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('adl_mistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  const login = (googleUser) => {
    setUser(googleUser);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
  };

  const saveProfile = (profileData) => {
    setProfile(profileData);
  };

  const completeLevel = (levelId, stars) => {
    setLevels(prev => {
      const updated = prev.map(l => {
        if (l.id === levelId) return { ...l, status: 'completed', stars };
        if (l.id === levelId + 1) return { ...l, status: 'current' };
        return l;
      });
      return updated;
    });
    setXp(prev => prev + stars * 30);
    setCurrentLevel(prev => prev + 1);
  };

  const recordMistake = (targetItem) => {
    setMistakes(prev => ({
      ...prev,
      [targetItem]: (prev[targetItem] || 0) + 1
    }));
  };

  const getCurrentLevel = () => levels.find(l => l.status === 'current');
  const getXpPercent = () => Math.min(100, ((xp % 200) / 200) * 100);
  const getPlayerLevel = () => Math.floor(xp / 200) + 1;

  return (
    <AppContext.Provider value={{
      user, login, logout,
      profile, saveProfile,
      levels, completeLevel,
      medals, setMedals,
      xp, currentLevel,
      mistakes, recordMistake,
      getCurrentLevel,
      getXpPercent,
      getPlayerLevel,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
