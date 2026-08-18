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
  // Vocales
  'A': 'á.', 'E': 'é.', 'I': 'í.', 'O': 'ó.', 'U': 'ú.',
  'a': 'á.', 'e': 'é.', 'i': 'í.', 'o': 'ó.', 'u': 'ú.',

  // B (Fix 'BE' saying 'bi' and 'BO' spelling out)
  'BA': 'bá.', 'BE': 'bé.', 'BI': 'bí.', 'BO': 'bó.', 'BU': 'bú.',
  'ba': 'bá.', 'be': 'bé.', 'bi': 'bí.', 'bo': 'bó.', 'bu': 'bú.',
  'Ba': 'bá.', 'Be': 'bé.', 'Bi': 'bí.', 'Bo': 'bó.', 'Bu': 'bú.',

  // C (Fix 'CO' and 'CU' spelling out)
  'CA': 'cá.', 'CE': 'sé.', 'CI': 'sí.', 'CO': 'có.', 'CU': 'cú.',
  'ca': 'cá.', 'ce': 'sé.', 'ci': 'sí.', 'co': 'có.', 'cu': 'cú.',
  'Ca': 'cá.', 'Ce': 'sé.', 'Ci': 'sí.', 'Co': 'có.', 'Cu': 'cú.',

  // D
  'DA': 'dá.', 'DE': 'dé.', 'DI': 'dí.', 'DO': 'dó.', 'DU': 'dú.',
  'da': 'dá.', 'de': 'dé.', 'di': 'dí.', 'do': 'dó.', 'du': 'dú.',
  'Da': 'dá.', 'De': 'dé.', 'Di': 'dí.', 'Do': 'dó.', 'Du': 'dú.',

  // F
  'FA': 'fá.', 'FE': 'fé.', 'FI': 'fí.', 'FO': 'fó.', 'FU': 'fú.',
  'fa': 'fá.', 'fe': 'fé.', 'fi': 'fí.', 'fo': 'fó.', 'fu': 'fú.',
  'Fa': 'fá.', 'Fe': 'fé.', 'Fi': 'fí.', 'Fo': 'fó.', 'Fu': 'fú.',

  // G (Fix 'GI' sounding like 'ji' and 'GU' spelling out)
  'GA': 'gá.', 'GE': 'jé.', 'GI': 'jí.', 'GO': 'gó.', 'GU': 'gú.',
  'ga': 'gá.', 'ge': 'jé.', 'gi': 'jí.', 'go': 'gó.', 'gu': 'gú.',
  'Ga': 'gá.', 'Ge': 'jé.', 'Gi': 'jí.', 'Go': 'gó.', 'Gu': 'gú.',

  // J (Fix 'JU' spelling out)
  'JA': 'já.', 'JE': 'jé.', 'JI': 'jí.', 'JO': 'jó.', 'JU': 'jú.',
  'ja': 'já.', 'je': 'jé.', 'ji': 'jí.', 'jo': 'jó.', 'ju': 'jú.',
  'Ja': 'já.', 'Je': 'jé.', 'Ji': 'jí.', 'Jo': 'jó.', 'Ju': 'jú.',

  // K (Fix 'KI', 'KO', 'KU' spelling out)
  'KA': 'cá.', 'KE': 'qué.', 'KI': 'quí.', 'KO': 'có.', 'KU': 'cú.',
  'ka': 'cá.', 'ke': 'qué.', 'ki': 'quí.', 'ko': 'có.', 'ku': 'cú.',
  'Ka': 'cá.', 'Ke': 'qué.', 'Ki': 'quí.', 'Ko': 'có.', 'Ku': 'cú.',

  // L
  'LA': 'lá.', 'LE': 'lé.', 'LI': 'lí.', 'LO': 'ló.', 'LU': 'lú.',
  'la': 'lá.', 'le': 'lé.', 'li': 'lí.', 'lo': 'ló.', 'lu': 'lú.',
  'La': 'lá.', 'Le': 'lé.', 'Li': 'lí.', 'Lo': 'ló.', 'Lu': 'lú.',

  // M (Fix 'MO' spelling out)
  'MA': 'má.', 'ME': 'mé.', 'MI': 'mí.', 'MO': 'mó.', 'MU': 'mú.',
  'ma': 'má.', 'me': 'mé.', 'mi': 'mí.', 'mo': 'mó.', 'mu': 'mú.',
  'Ma': 'má.', 'Me': 'mé.', 'Mi': 'mí.', 'Mo': 'mó.', 'Mu': 'mú.',

  // N (Fix 'NA' saying 'sodio' [Sodium] and 'NU' spelling out)
  'NA': 'ná.', 'NE': 'né.', 'NI': 'ní.', 'NO': 'nó.', 'NU': 'nú.',
  'na': 'ná.', 'ne': 'né.', 'ni': 'ní.', 'no': 'nó.', 'nu': 'nú.',
  'Na': 'ná.', 'Ne': 'né.', 'Ni': 'ní.', 'No': 'nó.', 'Nu': 'nú.',

  // Ñ (Fix ÑA, ÑE, ÑI, ÑO, ÑU spelling out)
  'ÑA': 'ñá.', 'ÑE': 'ñé.', 'ÑI': 'ñí.', 'ÑO': 'ñó.', 'ÑU': 'ñú.',
  'ña': 'ñá.', 'ñe': 'ñé.', 'ñi': 'ñí.', 'ño': 'ñó.', 'ñu': 'ñú.',
  'Ña': 'ñá.', 'Ñe': 'ñé.', 'Ñi': 'ñí.', 'Ño': 'ñó.', 'Ñu': 'ñú.',

  // P
  'PA': 'pá.', 'PE': 'pé.', 'PI': 'pí.', 'PO': 'pó.', 'PU': 'pú.',
  'pa': 'pá.', 'pe': 'pé.', 'pi': 'pí.', 'po': 'pó.', 'pu': 'pú.',
  'Pa': 'pá.', 'Pe': 'pé.', 'Pi': 'pí.', 'Po': 'pó.', 'Pu': 'pú.',

  // Q (Fix 'QUI' spelling out)
  'QUE': 'qué.', 'QUI': 'quí.',
  'que': 'qué.', 'qui': 'quí.',
  'Que': 'qué.', 'Qui': 'quí.',

  // R (Fix 'RI', 'RO', 'RU' spelling out)
  'RA': 'rá.', 'RE': 'ré.', 'RI': 'rí.', 'RO': 'ró.', 'RU': 'rú.',
  'ra': 'rá.', 're': 'ré.', 'ri': 'rí.', 'ro': 'ró.', 'ru': 'rú.',
  'Ra': 'rá.', 'Re': 'ré.', 'Ri': 'rí.', 'Ro': 'ró.', 'Ru': 'rú.',

  // S (Fix 'SA' spelling out)
  'SA': 'sá.', 'SE': 'sé.', 'SI': 'sí.', 'SO': 'só.', 'SU': 'sú.',
  'sa': 'sá.', 'se': 'sé.', 'si': 'sí.', 'so': 'só.', 'su': 'sú.',
  'Sa': 'sá.', 'Se': 'sé.', 'Si': 'sí.', 'So': 'só.', 'Su': 'sú.',

  // T
  'TA': 'tá.', 'TE': 'té.', 'TI': 'tí.', 'TO': 'tó.', 'TU': 'tú.',
  'ta': 'tá.', 'te': 'té.', 'ti': 'tí.', 'to': 'tó.', 'tu': 'tú.',
  'Ta': 'tá.', 'Te': 'té.', 'Ti': 'tí.', 'To': 'tó.', 'Tu': 'tú.',

  // V (Fix 'VO', 'VU' spelling out)
  'VA': 'vá.', 'VE': 'vé.', 'VI': 'ví.', 'VO': 'vó.', 'VU': 'vú.',
  'va': 'vá.', 've': 'vé.', 'vi': 'ví.', 'vo': 'vó.', 'vu': 'vú.',
  'Va': 'vá.', 'Ve': 'vé.', 'Vi': 'ví.', 'Vo': 'vó.', 'Vu': 'vú.',

  // W (Fix WA, WE, WI, WO, WU spelling out)
  'WA': 'guá.', 'WE': 'gué.', 'WI': 'guí.', 'WO': 'guó.', 'WU': 'gú.',
  'wa': 'guá.', 'we': 'gué.', 'wi': 'guí.', 'wo': 'guó.', 'wu': 'gú.',
  'Wa': 'guá.', 'We': 'gué.', 'Wi': 'guí.', 'Wo': 'guó.', 'Wu': 'gú.',

  // X (Fix 'XI' saying 'once' [Roman 11] and X spelling out)
  'XA': 'sá.', 'XE': 'sé.', 'XI': 'sí.', 'XO': 'só.', 'XU': 'sú.',
  'xa': 'sá.', 'xe': 'sé.', 'xi': 'sí.', 'xo': 'só.', 'xu': 'sú.',
  'Xa': 'sá.', 'Xe': 'sé.', 'Xi': 'sí.', 'Xo': 'só.', 'Xu': 'sú.',

  // Y (Fix 'YU' spelling out)
  'YA': 'yá.', 'YE': 'yé.', 'YI': 'yí.', 'YO': 'yó.', 'YU': 'yú.',
  'ya': 'yá.', 'ye': 'yé.', 'yi': 'yí.', 'yo': 'yó.', 'yu': 'yú.',
  'Ya': 'yá.', 'Ye': 'yé.', 'Yi': 'yí.', 'Yo': 'yó.', 'Yu': 'yú.',

  // Z (Fix ZA, ZE, ZI, ZO, ZU spelling out)
  'ZA': 'sá.', 'ZE': 'sé.', 'ZI': 'sí.', 'ZO': 'só.', 'ZU': 'sú.',
  'za': 'sá.', 'ze': 'sé.', 'zi': 'sí.', 'zo': 'só.', 'zu': 'sú.',
  'Za': 'sá.', 'Ze': 'sé.', 'Zi': 'sí.', 'Zo': 'só.', 'Zu': 'sú.',

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

  if (PHONETIC_MAP[trimmed]) return PHONETIC_MAP[trimmed];
  if (PHONETIC_MAP[uppercase]) return PHONETIC_MAP[uppercase];

  // Dynamic fallback for isolated short syllables (1 to 3 letters)
  if (/^[A-ZÑa-zñ]{1,3}[uU]$/.test(trimmed)) return trimmed.slice(0, -1).toLowerCase() + 'ú.';
  if (/^[A-ZÑa-zñ]{1,3}[oO]$/.test(trimmed)) return trimmed.slice(0, -1).toLowerCase() + 'ó.';
  if (/^[A-ZÑa-zñ]{1,3}[iI]$/.test(trimmed)) return trimmed.slice(0, -1).toLowerCase() + 'í.';
  if (/^[A-ZÑa-zñ]{1,3}[eE]$/.test(trimmed)) return trimmed.slice(0, -1).toLowerCase() + 'é.';
  if (/^[A-ZÑa-zñ]{1,3}[aA]$/.test(trimmed)) return trimmed.slice(0, -1).toLowerCase() + 'á.';

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
