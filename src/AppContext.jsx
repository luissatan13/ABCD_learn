import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { speakText } from './speechUtils';

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
  { id: 9, label: 'Sílabas S y L', type: 'silabas', target: 'S_L', status: 'locked', stars: 0 },
  { id: 10, label: 'Sílabas B', type: 'silabas', target: 'B', status: 'locked', stars: 0 },
  { id: 11, label: 'Sílabas C', type: 'silabas', target: 'C', status: 'locked', stars: 0 },
  { id: 12, label: 'Sílabas D', type: 'silabas', target: 'D', status: 'locked', stars: 0 },
  { id: 13, label: 'Sílabas F', type: 'silabas', target: 'F', status: 'locked', stars: 0 },
  { id: 14, label: 'Sílabas G', type: 'silabas', target: 'G', status: 'locked', stars: 0 },
  { id: 15, label: 'Sílabas H', type: 'silabas', target: 'H', status: 'locked', stars: 0 },
  { id: 16, label: 'Sílabas J', type: 'silabas', target: 'J', status: 'locked', stars: 0 },
  { id: 17, label: 'Sílabas K', type: 'silabas', target: 'K', status: 'locked', stars: 0 },
  { id: 18, label: 'Sílabas N', type: 'silabas', target: 'N', status: 'locked', stars: 0 },
  { id: 19, label: 'Sílabas Ñ', type: 'silabas', target: 'Ñ', status: 'locked', stars: 0 },
  { id: 20, label: 'Sílabas Q', type: 'silabas', target: 'Q', status: 'locked', stars: 0 },
  { id: 21, label: 'Sílabas R', type: 'silabas', target: 'R', status: 'locked', stars: 0 },
  { id: 22, label: 'Sílabas T', type: 'silabas', target: 'T', status: 'locked', stars: 0 },
  { id: 23, label: 'Sílabas V', type: 'silabas', target: 'V', status: 'locked', stars: 0 },
  { id: 24, label: 'Sílabas W', type: 'silabas', target: 'W', status: 'locked', stars: 0 },
  { id: 25, label: 'Sílabas X', type: 'silabas', target: 'X', status: 'locked', stars: 0 },
  { id: 26, label: 'Sílabas Y', type: 'silabas', target: 'Y', status: 'locked', stars: 0 },
  { id: 27, label: 'Sílabas Z', type: 'silabas', target: 'Z', status: 'locked', stars: 0 },
  { id: 28, label: 'Repaso Difíciles', type: 'repaso', target: 'DIFFICULT', status: 'locked', stars: 0 },
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
    try {
      const saved = JSON.parse(localStorage.getItem('adl_levels'));
      if (saved && Array.isArray(saved) && saved.length === INITIAL_LEVELS.length) {
        return saved;
      }
      if (saved && Array.isArray(saved) && saved.length > 0) {
        const savedMap = new Map(saved.map(l => [l.id, l]));
        return INITIAL_LEVELS.map(initL => {
          const s = savedMap.get(initL.id);
          if (s) return { ...initL, status: s.status, stars: s.stars };
          return initL;
        });
      }
      return INITIAL_LEVELS;
    } catch {
      return INITIAL_LEVELS;
    }
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

  // ---- Voice settings ----
  const [voiceGender, setVoiceGender] = useState(() => {
    try { return localStorage.getItem('adl_voice_gender') || 'male'; }
    catch { return 'male'; }
  });

  // Specific system voice name (null = auto pick by gender)
  const [voiceName, setVoiceName] = useState(() => {
    try { return localStorage.getItem('adl_voice_name') || null; }
    catch { return null; }
  });

  // Read speed: 0=very slow, 1=slow, 2=normal, 3=fast
  const [readSpeed, setReadSpeed] = useState(() => {
    try { return parseInt(localStorage.getItem('adl_read_speed')) || 2; }
    catch { return 2; }
  });

  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('adl_theme') || 'default'; }
    catch { return 'default'; }
  });

  // Letter case preference: 'both' (Aa) | 'lowercase' (a) | 'uppercase' (A)
  const [letterCase, setLetterCase] = useState(() => {
    try { return localStorage.getItem('adl_letter_case') || 'both'; }
    catch { return 'both'; }
  });

  const [currentLevel, setCurrentLevel] = useState(1);

  // Persist voice and letter case settings
  useEffect(() => { localStorage.setItem('adl_voice_gender', voiceGender); }, [voiceGender]);
  useEffect(() => {
    if (voiceName) localStorage.setItem('adl_voice_name', voiceName);
    else localStorage.removeItem('adl_voice_name');
  }, [voiceName]);
  useEffect(() => { localStorage.setItem('adl_read_speed', readSpeed.toString()); }, [readSpeed]);
  useEffect(() => { localStorage.setItem('adl_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('adl_letter_case', letterCase); }, [letterCase]);

  const toggleLetterCase = useCallback(() => {
    setLetterCase(prev => {
      if (prev === 'both') return 'lowercase';
      if (prev === 'lowercase') return 'uppercase';
      return 'both';
    });
  }, []);

  const formatText = useCallback((text, type = 'auto') => {
    if (!text || typeof text !== 'string') return text;

    if (letterCase === 'uppercase') {
      return text.toUpperCase();
    }
    if (letterCase === 'lowercase') {
      return text.toLowerCase();
    }

    // letterCase === 'both'
    const trimmed = text.trim();
    if (type === 'letter' || (type === 'auto' && trimmed.length === 1)) {
      return `${trimmed.toUpperCase()} ${trimmed.toLowerCase()}`;
    }

    if (type === 'syllable' || (type === 'auto' && text.length <= 4 && !text.includes(' '))) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    if (type === 'word' || (type === 'auto' && !text.includes(' '))) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }, [letterCase]);

  const speak = useCallback((text, slow = false) => {
    speakText(text, voiceGender, slow, voiceName, readSpeed);
  }, [voiceGender, voiceName, readSpeed]);

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

  const login = (googleUser) => { setUser(googleUser); };
  const logout = () => { setUser(null); setProfile(null); };
  const saveProfile = (profileData) => { setProfile(profileData); };

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
      [targetItem]: (prev[targetItem] || 0) + 1,
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
      xp, setXp, currentLevel,
      mistakes, recordMistake,
      getCurrentLevel,
      getXpPercent,
      getPlayerLevel,
      voiceGender, setVoiceGender,
      voiceName, setVoiceName,
      readSpeed, setReadSpeed,
      speak,
      theme, setTheme,
      letterCase, setLetterCase,
      toggleLetterCase, formatText,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
