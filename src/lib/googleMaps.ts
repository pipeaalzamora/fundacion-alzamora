// Configuración central de Google Maps Platform.
// La API key se lee de la variable de entorno VITE_GOOGLE_MAPS_API_KEY.
// Si no está definida, la app degrada de forma elegante:
//  - el mapa muestra la versión estilizada (SVG) en lugar del mapa de Google
//  - el campo de dirección funciona como un input de texto normal (sin autocompletar)

export const GOOGLE_MAPS_API_KEY: string =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

// Indica si hay una API key configurada (habilita mapa real + autocompletado).
export const hasGoogleMaps: boolean = Boolean(GOOGLE_MAPS_API_KEY);

// Centro aproximado de la bahía de Valparaíso / Viña del Mar (Quinta Región).
export const VALPARAISO_CENTER = { lat: -33.033, lng: -71.585 };

// Límites geográficos aproximados de la Quinta Región costera para sesgar
// (bias) los resultados del autocompletado hacia Valparaíso y Viña del Mar.
export const VALPARAISO_BOUNDS = {
  north: -32.95,
  south: -33.13,
  east: -71.45,
  west: -71.70,
};
