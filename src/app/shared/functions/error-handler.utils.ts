import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface AppBackendError {
  status: string;
  code: string;
  number: number;
}

export interface CustomAppError {
  translationKey: string;
  error: AppBackendError;
}

/**
 * Procesa el HttpErrorResponse y simplifica la estructura.
 */
export function handleHttpError(httpError: HttpErrorResponse): Observable<never> {
  const backendError = httpError.error as AppBackendError;
  const code = backendError?.code || '';

  const customError: CustomAppError = {
    translationKey: `ERRORS.${code}`,
    error: {
      status: backendError?.status || 'KO',
      code: code,
      number: backendError?.number || httpError.status || 500,
    },
  };

  return throwError(() => customError);
}
