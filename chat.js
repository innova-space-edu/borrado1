// chat.js
import { getResponse } from './getResponse.js';
import { renderMessage } from './render.js';
import { speak } from './speak.js';
import { guardarMensaje, obtenerMensajesUsuario } from './database.js';
import { auth } from './firebase-config.js';

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const messagesContainer = document.getElementById('messages');
const writingIndicator = document.getElementById('writing-indicator');
const fileInput = document.getElementById('image-input');

let currentUserId = null;

// Mostrar historial al iniciar sesión
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUserId = user.uid;
    const historial = await obtenerMensajesUsuario(currentUserId);
    historial.forEach(msg => {
      renderMessage(msg.content, msg.role);
    });
  }
});

// Envío del mensaje
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = input.value.trim();

  if (!message && !fileInput.files[0]) return;

  renderMessage(message, 'user');
  speak(message, 'user');
  input.value = '';

  if (currentUserId) await guardarMensaje(currentUserId, 'user', message);

  writingIndicator.style.display = 'block';

  // OCR si hay imagen
  let imageText = '';
  if (fileInput.files[0]) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      imageText = await analizarImagen(base64);
      continuarConversacion(message + ' ' + imageText);
    };
    reader.readAsDataURL(file);
  } else {
    continuarConversacion(message);
  }
});

async function continuarConversacion(textoFinal) {
  const response = await getResponse(textoFinal);
  writingIndicator.style.display = 'none';

  renderMessage(response, 'assistant');
  speak(response, 'assistant');

  if (currentUserId) await guardarMensaje(currentUserId, 'assistant', response);
}

// Analiza imagen usando OCR API gratuita (puedes cambiar por otra o local)
async function analizarImagen(base64) {
  try {
    const res = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': 'helloworld', // reemplázala con tu API real si deseas
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        base64Image: `data:image/png;base64,${base64}`,
        language: 'spa',
      }),
    });
    const data = await res.json();
    return data.ParsedResults?.[0]?.ParsedText || '';
  } catch (err) {
    console.error("Error OCR:", err);
    return '';
  }
}
