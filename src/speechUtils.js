// ============================================================
// Speech Synthesis Utility — Aventura de Leer
// Smart voice picker with real system voice listing
// ============================================================

let _voices = [];

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const v = window.speechSynthesis.getVoices();
  if (v.length > 0) _voices = v;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

/**
 * Returns all Spanish voices available on this device, sorted by quality.
 * Online voices (Neural/Natural) come first.
 */
export function getSpanishVoices() {
  const voices = _voices.length > 0 ? _voices : (window.speechSynthesis?.getVoices() || []);
  const spanish = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('es'));
  // Sort: online/neural voices first (better quality)
  return spanish.sort((a, b) => {
    const aOnline = !a.localService;
    const bOnline = !b.localService;
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;
    return 0;
  });
}

/**
 * Returns all available voices (any language) for advanced picker.
 */
export function getAllVoices() {
  return _voices.length > 0 ? _voices : (window.speechSynthesis?.getVoices() || []);
}

// Voice name patterns by gender for Spanish
const FEMALE_PATTERNS = /monica|sabina|paulina|lucia|helena|laura|victoria|female|marta|hilda|paloma|rosa|sofia|conchita|penelope|marisol|catalina|valeria|isabela|elvira|pilar|maria|clara|beatriz|ines|lyris|delia|esperanza/i;
const MALE_PATTERNS   = /jorge|pablo|raul|carlos|manuel|enrique|male|diego|gonzalo|miguel|javier|andres|juan|antonio|sergio|alberto|alejandro|guillermo|hector|rodrigo|tomas|rafael|david/i;

/**
 * Pick the best voice for a given type.
 * @param {'male'|'female'|'child'} type
 * @param {string|null} exactVoiceName - if set, use this voice by name
 */
function pickVoice(type, exactVoiceName) {
  const voices = _voices.length > 0 ? _voices : (window.speechSynthesis?.getVoices() || []);
  const spanishVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('es'));

  // 1. Exact match by name (user picked a specific voice)
  if (exactVoiceName) {
    const exact = voices.find(v => v.name === exactVoiceName);
    if (exact) return exact;
  }

  // 2. Gender match from Spanish voices
  if (spanishVoices.length > 0) {
    let matched = null;
    if (type === 'female' || type === 'child') {
      matched = spanishVoices.find(v => FEMALE_PATTERNS.test(v.name));
    } else {
      matched = spanishVoices.find(v => MALE_PATTERNS.test(v.name));
    }
    if (matched) return matched;
    // Fallback: any Spanish voice
    return spanishVoices[0];
  }

  // 3. No Spanish voice at all — use first available
  return voices[0] || null;
}

const PHONETIC_MAP = {
  // Syllables with U (accenting U and adding period ensures TTS speaks clear open Spanish 'u')
  'TU': 'tú.',
  'tu': 'tú.',
  'Tu': 'tú.',
  'MU': 'mú.',
  'mu': 'mú.',
  'Mu': 'mú.',
  'PU': 'pú.',
  'pu': 'pú.',
  'Pu': 'pú.',
  'SU': 'sú.',
  'su': 'sú.',
  'Su': 'sú.',
  'LU': 'lú.',
  'lu': 'lú.',
  'Lu': 'lú.',
  'BU': 'bú.',
  'bu': 'bú.',
  'Bu': 'bú.',
  'CU': 'cú.',
  'cu': 'cú.',
  'Cu': 'cú.',
  'DU': 'dú.',
  'du': 'dú.',
  'Du': 'dú.',
  'FU': 'fú.',
  'fu': 'fú.',
  'Fu': 'fú.',
  'GU': 'gú.',
  'gu': 'gú.',
  'Gu': 'gú.',
  'HU': 'hú.',
  'hu': 'hú.',
  'Hu': 'hú.',
  'JU': 'jú.',
  'ju': 'jú.',
  'Ju': 'jú.',
  'NU': 'nú.',
  'nu': 'nú.',
  'Nu': 'nú.',
  'ÑU': 'ñú.',
  'ñu': 'ñú.',
  'RU': 'rú.',
  'ru': 'rú.',
  'Ru': 'rú.',
  'VU': 'vú.',
  'vu': 'vú.',
  'ZU': 'zú.',
  'zu': 'zú.',

  // Syllables with O
  'TO': 'tó.', 'to': 'tó.', 'MO': 'mó.', 'mo': 'mó.',
  'PO': 'pó.', 'po': 'pó.', 'SO': 'só.', 'so': 'só.',
  'LO': 'ló.', 'lo': 'ló.', 'BO': 'bó.', 'bo': 'bó.',
  'CO': 'có.', 'co': 'có.', 'DO': 'dó.', 'do': 'dó.',
  'FO': 'fó.', 'fo': 'fó.', 'GO': 'gó.', 'go': 'gó.',
  'HO': 'hó.', 'ho': 'hó.', 'JO': 'jó.', 'jo': 'jó.',
  'NO': 'nó.', 'no': 'nó.', 'RO': 'ró.', 'ro': 'ró.',
  'VO': 'vó.', 'vo': 'vó.', 'ZO': 'zó.', 'zo': 'zó.',

  // Syllables with I
  'TI': 'tí.', 'ti': 'tí.', 'MI': 'mí.', 'mi': 'mí.',
  'PI': 'pí.', 'pi': 'pí.', 'SI': 'sí.', 'si': 'sí.',
  'LI': 'lí.', 'li': 'lí.', 'BI': 'ví.', 'bi': 'ví.',
  'DI': 'dí.', 'di': 'dí.', 'FI': 'fí.', 'fi': 'fí.',
  'GI': 'jí.', 'gi': 'jí.', 'HI': 'hí.', 'hi': 'hí.',
  'JI': 'jí.', 'ji': 'jí.', 'NI': 'ní.', 'ni': 'ní.',
  'RI': 'rí.', 'ri': 'rí.', 'VI': 'ví.', 'vi': 'ví.',
  'ZI': 'zí.', 'zi': 'zí.',

  // Syllables with E
  'TE': 'té.', 'te': 'té.', 'ME': 'mé.', 'me': 'mé.',
  'PE': 'pé.', 'pe': 'pé.', 'SE': 'sé.', 'se': 'sé.',
  'LE': 'lé.', 'le': 'lé.', 'BE': 'bé.', 'be': 'bé.',
  'CE': 'sé.', 'ce': 'sé.', 'DE': 'dé.', 'de': 'dé.',
  'FE': 'fé.', 'fe': 'fé.', 'GE': 'jé.', 'ge': 'jé.',
  'HE': 'hé.', 'he': 'hé.', 'JE': 'jé.', 'je': 'jé.',
  'NE': 'né.', 'ne': 'né.', 'RE': 'ré.', 're': 'ré.',
  'VE': 'vé.', 've': 'vé.', 'ZE': 'sé.', 'ze': 'sé.',

  // Syllables with A
  'TA': 'tá.', 'ta': 'tá.', 'MA': 'má.', 'ma': 'má.',
  'PA': 'pá.', 'pa': 'pá.', 'SA': 'sá.', 'sa': 'sá.',
  'LA': 'lá.', 'la': 'lá.', 'BA': 'bá.', 'ba': 'bá.',
  'CA': 'cá.', 'ca': 'cá.', 'DA': 'dá.', 'da': 'dá.',
  'FA': 'fá.', 'fa': 'fá.', 'GA': 'gá.', 'ga': 'gá.',
  'HA': 'há.', 'ha': 'há.', 'JA': 'já.', 'ja': 'já.',
  'NA': 'ná.', 'na': 'ná.', 'RA': 'rá.', 'ra': 'rá.',
  'VA': 'vá.', 'va': 'vá.', 'ZA': 'zá.', 'za': 'zá.',

  // Words & letters
  'JUGO': 'hugo',
  'jugo': 'hugo',
  'Jugo': 'Hugo',
  'B': 've',
  'V': 've',
};

function getSpokenText(text) {
  if (!text) return '';
  const trimmed = text.trim();
  const uppercase = trimmed.toUpperCase();

  if (PHONETIC_MAP[uppercase]) return PHONETIC_MAP[uppercase];
  if (PHONETIC_MAP[trimmed]) return PHONETIC_MAP[trimmed];

  // Dynamic fallback for isolated short syllables ending in U
  if (/^[A-ZÑa-zñ]{1,3}[uU]$/.test(trimmed)) {
    return trimmed.slice(0, -1) + 'ú.';
  }
  if (/^[A-ZÑa-zñ]{1,3}[oO]$/.test(trimmed)) return trimmed.slice(0, -1) + 'ó.';
  if (/^[A-ZÑa-zñ]{1,3}[iI]$/.test(trimmed)) return trimmed.slice(0, -1) + 'í.';
  if (/^[A-ZÑa-zñ]{1,3}[eE]$/.test(trimmed)) return trimmed.slice(0, -1) + 'é.';
  if (/^[A-ZÑa-zñ]{1,3}[aA]$/.test(trimmed)) return trimmed.slice(0, -1) + 'á.';

  return text;
}

/**
 * Main speak function.
 * @param {string} text
 * @param {'male'|'female'|'child'} voiceType
 * @param {boolean} slow - turtle mode
 * @param {string|null} exactVoiceName - specific voice name from system
 * @param {number} speedMult - 1=slow, 2=normal, 3=fast (only used if slow=false)
 */
export function speakText(text, voiceType = 'male', slow = false, exactVoiceName = null, speedMult = 2) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  // Apply phonetic replacements
  const spokenText = getSpokenText(text);

  const utt = new SpeechSynthesisUtterance(spokenText);
  utt.lang = 'es-MX'; // prefer Mexican Spanish for Latin American users

  // Rate: slow mode = 0.65 (0.5 causes robotic audio distortion), otherwise based on speedMult slider
  const rates = [0.65, 0.8, 1.0, 1.2];
  utt.rate = slow ? 0.65 : (rates[speedMult] ?? 0.8);

  // Pitch: Keep natural pitch (1.0 - 1.1) to avoid formant shifting that turns 'u' into 'o'
  switch (voiceType) {
    case 'female': utt.pitch = 1.05; break;
    case 'child':  utt.pitch = 1.1;  break;
    default:       utt.pitch = 1.0;  break; // male
  }

  utt.volume = 1.0;

  const voice = pickVoice(voiceType, exactVoiceName);
  if (voice) utt.voice = voice;

  window.speechSynthesis.speak(utt);
}

/**
 * Preview a specific voice by name with a sample phrase.
 * @param {string} voiceName
 * @param {'male'|'female'|'child'} voiceType
 */
export function previewVoice(voiceName, voiceType = 'male') {
  const samples = {
    male:   '¡Hola! Soy tu amigo explorador.',
    female: '¡Hola! ¡Vamos a aprender juntos!',
    child:  '¡Hola! ¡A leer se ha dicho!',
  };
  speakText(samples[voiceType] || samples.male, voiceType, false, voiceName, 2);
}

/**
 * Stop any ongoing speech.
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
