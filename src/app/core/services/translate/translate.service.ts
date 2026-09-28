import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  LANGUAGES,
  LanguageCode,
  DEFAULT_LANGUAGE,
  STORAGE_KEYS,
} from '../../../shared/constants/AppConstants';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private http = inject(HttpClient);

  // Idioma activo con tipo seguro
  currentLang = signal<LanguageCode>(DEFAULT_LANGUAGE);

  private translations = signal<Record<string, any>>({});

  constructor() {
    // Recuperar preferencia guardada o usar el idioma por defecto
    const savedLang = localStorage.getItem(STORAGE_KEYS.USER_LANG) as LanguageCode;
    const initialLang =
      savedLang === LANGUAGES.SPANISH || savedLang === LANGUAGES.ENGLISH
        ? savedLang
        : DEFAULT_LANGUAGE;

    this.setLanguage(initialLang);
  }

  async setLanguage(lang: LanguageCode): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Record<string, any>>(`/i18n/${lang}.json`));
      this.translations.set(data);
      this.currentLang.set(lang);
      localStorage.setItem(STORAGE_KEYS.USER_LANG, lang);
    } catch (error) {
      console.error(`Error al cargar el idioma: ${lang}`, error);
    }
  }

  translate(key: string): string {
    const keys = key.split('.');
    let result: any = this.translations();

    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        return key;
      }
    }

    return typeof result === 'string' ? result : key;
  }
}
