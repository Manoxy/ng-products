import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { CustomTitleStrategy } from './core/strategies/i18n-title.strategy';
import { TranslateService } from './core/services/translate/translate.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { xsrfInterceptor } from './core/interceptors/xsrf.interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './core/strategies/custom-mat-paginator-intl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      // Registramos ambos interceptores en orden (primero auth, luego xsrf, o viceversa)
      withInterceptors([authInterceptor, xsrfInterceptor]),
    ),
    provideRouter(routes),
    { provide: TitleStrategy, useClass: CustomTitleStrategy },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    provideAppInitializer(() => {
      const translateService = inject(TranslateService);
      return translateService.setLanguage(translateService.currentLang());
    }),
  ],
};
