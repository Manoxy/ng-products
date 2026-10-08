import {
  DEFAULT_LANGUAGE,
  LanguageCode,
  LANGUAGES,
  STORAGE_KEYS,
} from '../../../shared/constants/AppConstants';
import { firstValueFrom } from 'rxjs';
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private http = inject(HttpClient);

  currentLang = signal<LanguageCode>(DEFAULT_LANGUAGE);
  private translationsSignal = signal<Record<string, any>>({});
  public readonly translations = this.translationsSignal.asReadonly();

  constructor() {
    const savedLang = localStorage.getItem(STORAGE_KEYS.USER_LANG) as LanguageCode;
    const initialLang =
      savedLang === LANGUAGES.SPANISH || savedLang === LANGUAGES.ENGLISH
        ? savedLang
        : DEFAULT_LANGUAGE;

    // Cargar las traducciones iniciales
    this.setLanguage(initialLang);
  }

  async setLanguage(lang: LanguageCode): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Record<string, any>>(`/i18n/${lang}.json`));
      this.translationsSignal.set(data);
      this.currentLang.set(lang);
      localStorage.setItem(STORAGE_KEYS.USER_LANG, lang);
    } catch (error) {
      console.error(`Error al cargar el idioma: ${lang}`, error);
    }
  }

  translate(key: string, params?: Record<string, unknown>): string {
    if (!key) return '';

    const keys = key.split('.');
    let result: any = this.translationsSignal();

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key;
      }
    }

    if (typeof result !== 'string') {
      return key;
    }

    if (params) {
      Object.keys(params).forEach((paramKey) => {
        const value = params[paramKey];
        result = result.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(value ?? ''));
      });
    }

    return result;
  }
}
