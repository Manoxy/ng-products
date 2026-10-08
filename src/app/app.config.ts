import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { CustomTitleStrategy } from './core/strategies/i18n-title.strategy';
import { TranslateService } from './core/services/translate/translate.service'; // Ajusta la ruta

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: TitleStrategy, useClass: CustomTitleStrategy },
    // Carga síncrona del idioma antes de procesar el routing
    provideAppInitializer(() => {
      const translateService = inject(TranslateService);
      return translateService.setLanguage(translateService.currentLang());
    }),
  ],
};
