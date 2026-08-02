// Speech Synthesis Utility with Male and Female voice support

let cachedVoices = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function speakText(text, gender = 'male', slow = false) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'es-ES';

  // Configured speed rate: 0.55 for slow turtle mode, 0.8 for normal mode
  utt.rate = slow ? 0.55 : 0.8;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const spanishVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('es'));

  let matchedVoice = null;

  if (gender === 'female') {
    utt.pitch = 1.35; // Higher female/child timbre pitch
    matchedVoice = spanishVoices.find(v =>
      /monica|sabina|paulina|lucia|helena|laura|victoria|female|marta|hilda|paloma|rosa|sofia/i.test(v.name)
    );
  } else {
    utt.pitch = 0.85; // Lower male timbre pitch
    matchedVoice = spanishVoices.find(v =>
      /jorge|pablo|raul|carlos|manuel|enrique|male|diego|gonzalo|miguel|javier/i.test(v.name)
    );
  }

  // If no gender-specific voice matched by name, fallback to any Spanish voice
  if (!matchedVoice && spanishVoices.length > 0) {
    matchedVoice = spanishVoices[0];
  }

  if (matchedVoice) {
    utt.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utt);
}
