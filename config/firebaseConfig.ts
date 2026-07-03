// Importar las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCw_0VnnGMU8PuDQOGvUcsU9ShF0YWCc1M",
  authDomain: "intercam-816b1.firebaseapp.com",
  projectId: "intercam-816b1",
  storageBucket: "intercam-816b1.appspot.com",
  messagingSenderId: "518666539826",
  appId: "1:518666539826:web:836fb97950c0b5bd9ebd2b",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Función para cerrar sesión
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada correctamente");
  } catch (error) {
    console.error("Error al cerrar sesión", error);
  }
};

export default app;
