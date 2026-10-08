import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { STORAGE_KEYS } from '../../../shared/constants/AppConstants';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../../shared/models/shared-structure.model';
import { handleHttpError } from '../../../shared/functions/error-handler.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly TOKEN_EXPIRES = STORAGE_KEYS.AUTH_EXPIRES;
  private readonly USER_ROL = STORAGE_KEYS.USER_ROL;
  private readonly TOKEN_KEY = STORAGE_KEYS.AUTH_TOKEN;
  private readonly USER_NAME = STORAGE_KEYS.USER_NAME;

  private apiUrl = environment.apiUrl;

  // Signal reactivo para gestionar el estado del token
  private readonly token = signal<string | null>(this.getInitialToken());
  readonly tokenSignal = this.token.asReadonly();

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}auth/login`, loginRequest)
      .pipe(catchError(handleHttpError));
  }

  /**
   * Obtiene el token guardado al iniciar el servicio (solo si estamos en el navegador)
   */
  private getInitialToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Comprueba si el usuario tiene sesión activa
   */
  isLoggedIn(): boolean {
    return !!this.token();
  }

  setLoginData(data: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_EXPIRES, data.expires.toString());
      localStorage.setItem(this.USER_ROL, data.rol);
      localStorage.setItem(this.TOKEN_KEY, data.token);
      localStorage.setItem(this.USER_NAME, data.username);
    }
    // Actualiza el Signal en memoria para que isLoggedIn() y el Guard lo detecten al instante
    this.token.set(data.token);
  }

  /**
   * Guarda el token tras un login exitoso
   */
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    this.token.set(token);
  }

  /**
   * Devuelve el token actual
   */
  getToken(): string | null {
    return this.token();
  }

  /**
   * Cierra sesión eliminando el token
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.token.set(null);
  }

  logoutAndRemoveAll(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.token.set(null);
  }
}
