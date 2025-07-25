// utils/getResponse.js

import { renderMessage } from './render.js';
import { speak } from './speak.js';
import { saveChat } from './storage.js';

const API_KEY = "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";
const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

const SYSTEM_PROMPT = `
Eres MIRA, una asistente educativa amable y clara. 
Responde siempre en español y sigue esta estructura SI HAY una fórmula, ecuación o función:
1. Explica el concepto con palabras sencillas.
2. Luego muestra la fórmula en LaTeX entre signos de dólar: \`$$...$$\`.
3. Después explica cada variable en texto normal, en lista.
4. Finalmente, da un ejemplo si corresponde.
Nunca leas en voz alta el contenido LaTeX ni bloques de código.
`;

export async function getResponse(userMessage, chatHistory) {
  const typingIndicator = document.getElementById("typing-indicator");
  typingIndicator.textContent = "MIRA está escribiendo...";

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...chatHistory.slice(-10),
          { role: "user", content: userMessage }
        ],
        temperature: 0.7
      })
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "Lo siento, no entendí.";
    renderMessage("assistant", content);
    speak(content);
    saveChat("assistant", content);
  } catch (error) {
    renderMessage("assistant", "⚠️ Error al conectar con la IA.");
  } finally {
    typingIndicator.textContent = "";
  }
}
