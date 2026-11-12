import { HttpInterceptorFn } from '@angular/common/http';
import {
  X_XSRF_TOKEN_HEADER,
  XSRF_METHODS,
  XSRF_TOKEN_NAME,
} from '../../shared/constants/AppConstants';

export const xsrfInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo aplicamos el token CSRF en métodos que alteran el estado del servidor
  const methodsToProtect: string[] = XSRF_METHODS;

  if (methodsToProtect.includes(req.method.toUpperCase())) {
    const xsrfToken = getCookie(XSRF_TOKEN_NAME);

    if (xsrfToken) {
      // Clonamos la petición añadiendo la cabecera que espera Spring Security
      const clonedReq = req.clone({
        headers: req.headers.set(X_XSRF_TOKEN_HEADER, xsrfToken),
      });
      return next(clonedReq);
    }
  }

  return next(req);
};

// Función auxiliar segura para extraer cookies del navegador en cliente
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
