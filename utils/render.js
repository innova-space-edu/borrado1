// utils/render.js
import { speak } from './speak.js';

// Contenedor del chat
const chatContainer = document.getElementById('chat-container');
const avatar = document.getElementById('avatar-mira');

// Crear burbuja de mensaje
function createMessageElement(content, isUser = false) {
  const message = document.createElement('div');
  message.className = `message ${isUser ? 'user' : 'ai'}`;
  message.innerHTML = marked.parse(content);
  return message;
}

// Mostrar mensaje en el chat
export function renderMessage(content, isUser = false) {
  // Eliminar texto “MIRA está escribiendo…” si existe
  const writingIndicator = document.getElementById('typing-indicator');
  if (writingIndicator) writingIndicator.remove();

  const msg = createMessageElement(content, isUser);
  chatContainer.appendChild(msg);
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });

  // Renderiza LaTeX si hay fórmulas
  if (window.MathJax) MathJax.typeset();

  // Reproducir voz si es IA
  if (!isUser) {
    const plainText = msg.innerText.replace(/\$\$[^$]*\$\$|\$[^$]*\$/g, '').trim();
    speak(plainText);
  }
}

// Mostrar indicador "MIRA está escribiendo..."
export function showTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'typing-indicator';
  indicator.className = 'message ai typing';
  indicator.innerText = 'MIRA está escribiendo...';
  chatContainer.appendChild(indicator);
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });

  // Animar avatar
  if (avatar) {
    avatar.classList.add('speaking');
    setTimeout(() => avatar.classList.remove('speaking'), 2000);
  }
}
