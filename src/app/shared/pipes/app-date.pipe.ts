import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '../../core/services/translate/translate.service';

@Pipe({
  name: 'appDate',
  standalone: true,
  pure: false, // Para reaccionar dinámicamente cuando cambies el idioma en el TranslateService
})
export class AppDatePipe implements PipeTransform {
  private translateService = inject(TranslateService);

  transform(
    value: Date | string | number | null | undefined,
    format: 'short' | 'medium' | 'long' | 'relative' = 'medium',
  ): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    // Obtenemos el idioma activo desde la señal de tu TranslateService ('es', 'en', etc.)
    const locale = this.translateService.currentLang();

    if (format === 'relative') {
      return this.formatRelativeTime(date, locale);
    }

    // Opciones de Int.DateTimeFormat nativo
    const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
      short: { day: '2-digit', month: '2-digit', year: 'numeric' },
      medium: { day: 'numeric', month: 'short', year: 'numeric' },
      long: { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    };

    return new Intl.DateTimeFormat(locale, optionsMap[format]).format(date);
  }

  // Ejemplo de tiempo relativo ("hace 5 minutos") usando Intl.RelativeTimeFormat nativo
  private formatRelativeTime(date: Date, locale: string): string {
    const diffInSeconds = Math.floor((date.getTime() - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (Math.abs(diffInSeconds) < 60) return rtf.format(Math.round(diffInSeconds), 'second');
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) return rtf.format(Math.round(diffInMinutes), 'minute');
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) return rtf.format(Math.round(diffInHours), 'hour');
    const diffInDays = Math.floor(diffInHours / 24);
    return rtf.format(Math.round(diffInDays), 'day');
  }
}
