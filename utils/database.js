// database.js
import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/**
 * Guarda un mensaje en Firestore
 * @param {string} userId - ID del usuario autenticado
 * @param {string} role - 'user' o 'assistant'
 * @param {string} content - Contenido del mensaje
 */
export async function guardarMensaje(userId, role, content) {
  try {
    await addDoc(collection(db, 'mensajes'), {
      userId,
      role,
      content,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error al guardar el mensaje:", error);
  }
}

/**
 * Obtiene todos los mensajes de un usuario, ordenados por tiempo
 * @param {string} userId - ID del usuario autenticado
 * @returns {Array} - Lista de mensajes del usuario
 */
export async function obtenerMensajesUsuario(userId) {
  try {
    const mensajesRef = collection(db, 'mensajes');
    const q = query(mensajesRef, where("userId", "==", userId), orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    return [];
  }
}
