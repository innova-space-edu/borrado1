// utils/storage.js

import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { app } from "./firebase-config.js";

const storage = getStorage(app);

/**
 * Sube un archivo a Firebase Storage y retorna la URL pública
 * @param {File} archivo - El archivo a subir (usualmente desde input type="file")
 * @param {string} rutaDestino - Ruta donde se guardará (por ejemplo: "imagenes/avatar.png")
 * @returns {Promise<string>} - URL pública del archivo
 */
export async function subirArchivo(archivo, rutaDestino) {
  const referencia = ref(storage, rutaDestino);
  await uploadBytes(referencia, archivo);
  return await getDownloadURL(referencia);
}

/**
 * Obtiene la URL de un archivo ya almacenado en Firebase Storage
 * @param {string} ruta - Ruta del archivo en Firebase Storage
 * @returns {Promise<string>}
 */
export async function obtenerURL(ruta) {
  const referencia = ref(storage, ruta);
  return await getDownloadURL(referencia);
}
