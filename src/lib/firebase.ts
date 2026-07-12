// Inicialización de Firebase Authentication para el login con Google del panel
// de administración. Firebase solo se inicializa si las variables VITE_FIREBASE_*
// están presentes; de lo contrario `hasFirebase` es false y el panel admin usa
// el fallback de token manual (ver AdminPanel.tsx).

import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
  type UserCredential,
} from 'firebase/auth';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

/**
 * Email autorizado a entrar al panel admin (en minúsculas). Se toma de
 * VITE_ADMIN_EMAIL y, si no está definido, cae en pipeaalzamora@gmail.com.
 */
export const ADMIN_EMAIL: string = (
  import.meta.env.VITE_ADMIN_EMAIL || 'pipeaalzamora@gmail.com'
).toLowerCase();

/**
 * Indica si Firebase Auth está configurado. Solo es true cuando todas las
 * variables VITE_FIREBASE_* necesarias están presentes.
 */
export const hasFirebase: boolean = Boolean(apiKey && authDomain && projectId && appId);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let provider: GoogleAuthProvider | null = null;

if (hasFirebase) {
  app = initializeApp({
    apiKey,
    authDomain,
    projectId,
    appId,
  });
  authInstance = getAuth(app);
  provider = new GoogleAuthProvider();
  // Forzamos la selección de cuenta para evitar iniciar sesión en silencio con
  // una sesión de Google previa que no sea la del administrador.
  provider.setCustomParameters({ prompt: 'select_account' });
}

/** Instancia de Auth de Firebase, o null si Firebase no está configurado. */
export const auth: Auth | null = authInstance;

/** Provider de Google, o null si Firebase no está configurado. */
export const googleProvider: GoogleAuthProvider | null = provider;

/**
 * Abre el popup de inicio de sesión con Google. Lanza un error si Firebase no
 * está configurado.
 */
export function signInWithGoogle(): Promise<UserCredential> {
  if (!authInstance || !provider) {
    throw new Error('Firebase Authentication no está configurado.');
  }
  return signInWithPopup(authInstance, provider);
}

/** Cierra la sesión del administrador. No hace nada si Firebase no está configurado. */
export async function signOutAdmin(): Promise<void> {
  if (!authInstance) return;
  await signOut(authInstance);
}

/**
 * Obtiene el ID token actual del usuario. Firebase renueva automáticamente el
 * token si está por expirar; usa `forceRefresh` para forzar una renovación
 * (por ejemplo, tras un 401).
 */
export function getIdToken(user: User, forceRefresh = false): Promise<string> {
  return user.getIdToken(forceRefresh);
}
