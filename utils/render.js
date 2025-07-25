import { speak } from './speak.js';

export function renderMessage(role, content) {
  const chatContainer = document.getElementById("chat-container");
  const avatar = document.getElementById("avatar");
  const msg = document.createElement("div");

  msg.className = `message ${role === "user" ? "user" : "bot"}`;
  msg.innerHTML = marked.parse(content);

  chatContainer.appendChild(msg);
  MathJax.typesetPromise();

  msg.scrollIntoView({ behavior: "smooth", block: "start" });

  if (role === "assistant") {
    speak(content);
    if (avatar) {
      avatar.classList.add("talking");
      setTimeout(() => avatar.classList.remove("talking"), 1200);
    }
  }
}
