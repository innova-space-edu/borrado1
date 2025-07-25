// utils/speak.js

export function speak(text) {
  // Evitar que lea código o LaTeX directamente
  const cleanText = text
    .replace(/\$\$[^$]*\$\$/g, '')     // elimina bloques LaTeX
    .replace(/\$[^$]*\$/g, '')         // elimina fórmulas en línea
    .replace(/`[^`]*`/g, '')           // elimina bloques de código
    .replace(/\{\{[^}]*\}\}/g, '')     // elimina placeholders tipo {{...}}
    .trim();

  if (!cleanText || typeof speechSynthesis === 'undefined') return;

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Configuración de voz: español, tono natural
  utterance.lang = 'es-ES';
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Elegir voz española si está disponible
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang === 'es-ES' || v.lang.startsWith('es'));
  if (preferredVoice) utterance.voice = preferredVoice;

  window.speechSynthesis.speak(utterance);
}
