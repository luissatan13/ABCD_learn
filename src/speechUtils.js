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

  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'es-MX'; // prefer Mexican Spanish for Latin American users

  // Rate: slow mode = 0.5, otherwise based on speedMult slider
  const rates = [0.5, 0.75, 1.0, 1.2];
  utt.rate = slow ? 0.5 : (rates[speedMult] ?? 0.8);

  // Pitch by voice type
  switch (voiceType) {
    case 'female': utt.pitch = 1.2;  break;
    case 'child':  utt.pitch = 1.5;  break;
    default:       utt.pitch = 0.9;  break; // male
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
