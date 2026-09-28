// Idiomas soportados en la aplicación
export const LANGUAGES = {
  SPANISH: 'es-es',
  ENGLISH: 'en-en',
} as const;

// Tipo extraído automáticamente de los valores de LANGUAGES ('es-es' | 'en-en')
export type LanguageCode = (typeof LANGUAGES)[keyof typeof LANGUAGES];

// Idioma por defecto
export const DEFAULT_LANGUAGE: LanguageCode = LANGUAGES.SPANISH;

// Idioma inglés
export const ENGLISH_LANGUAGE: LanguageCode = LANGUAGES.ENGLISH;


// Constantes de Almacenamiento Local (LocalStorage / SessionStorage)
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'user',
  USER_LANG: 'lang'
} as const;

// Roles de Usuario
export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER'
} as const;
