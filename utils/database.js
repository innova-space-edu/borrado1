// utils/database.js
import { db } from "../firebase-config.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function saveMessage(userId, role, content) {
  if (!userId) return;
  try {
    await addDoc(collection(db, "chats", userId, "mensajes"), {
      role,
      content,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error al guardar mensaje:", error);
  }
}

export async function loadMessages(userId, callback) {
  if (!userId) return;
  try {
    const q = query(
      collection(db, "chats", userId, "mensajes"),
      orderBy("timestamp")
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      const { role, content } = doc.data();
      callback(role, content);
    });
  } catch (error) {
    console.error("Error al cargar mensajes:", error);
  }
}
