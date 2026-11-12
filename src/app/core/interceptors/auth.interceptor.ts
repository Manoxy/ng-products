import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const token = localStorage.getItem('token');

  let authReq = req.clone({
    withCredentials: true,
    ...(token && {
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Obtener la instancia del Router solo cuando salte un 401/403
        const router = injector.get(Router);
        const authService = injector.get(AuthService);

        authService.logoutAndRemoveAll();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
