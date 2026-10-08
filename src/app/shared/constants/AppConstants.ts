
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
  AUTH_EXPIRES: 'expires',
  USER_ROL: 'rol',
  AUTH_TOKEN: 'token',
  USER_NAME: 'username',
  USER_LANG: 'lang',
} as const;

// Roles de Usuario
export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER'
} as const;

// Configuración de Mensajes y Notificaciones
export const MESSAGE_CONFIG = {
  DEFAULT_DURATION: 5000, // 5 segundos por defecto
  SUCCESS_DURATION: 5000,
  WARNING_DURATION: 6000,
  INFO_DURATION: 7000,
  ERROR_DURATION: 7000,   // Los errores se dejan un poco más de tiempo para lectura
} as const;

export const DEFAULT_ERROR = 'SHARED.DEFAULT_ERROR'
