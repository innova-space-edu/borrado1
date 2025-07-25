export function speak(text) {
  // Elimina contenido en LaTeX (MathJax)
  const cleaned = text
    .replace(/\$\$.*?\$\$/gs, "")
    .replace(/\$.*?\$/g, "")
    .replace(/{{.*?}}/g, "")
    .replace(/```[\s\S]*?```/g, "")  // elimina bloques de código
    .replace(/<[^>]+>/g, "")         // elimina etiquetas HTML

  const msg = new SpeechSynthesisUtterance(cleaned.trim());
  msg.lang = "es-ES";
  speechSynthesis.cancel();  // detener cualquier voz anterior
  speechSynthesis.speak(msg);
}
