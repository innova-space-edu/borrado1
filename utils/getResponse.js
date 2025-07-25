import { speak } from "./speak.js";
import { renderMessage } from "./render.js";
import { saveMessage } from "./saveMessage.js";

const API_KEY = "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";
const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export async function getResponse(prompt, user, typingIndicator) {
  typingIndicator.textContent = "MIRA está escribiendo...";

  try {
    const messages = [
      {
        role: "system",
        content:
          "Eres MIRA, una IA educativa amable y clara. Habla en español. Usa *asteriscos* para enfatizar palabras. Si ves fórmulas, primero explícalas, luego usa LaTeX y después define sus símbolos.",
      },
      { role: "user", content: prompt },
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "Lo siento, no entendí.";

    renderMessage("assistant", content);
    if (user) await saveMessage(user, "assistant", content);
    speak(content);
  } catch (error) {
    console.error("Error con Groq:", error);
    renderMessage("assistant", "Hubo un error al conectar con la IA.");
  } finally {
    typingIndicator.textContent = "";
  }
}
