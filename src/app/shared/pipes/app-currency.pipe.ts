import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '../../core/services/translate/translate.service';
import { LanguageCode } from '../constants/AppConstants';

@Pipe({
  name: 'appCurrency',
  standalone: true,
  pure: false, // Permite actualizar la cifra automáticamente al cambiar de idioma
})
export class AppCurrencyPipe implements PipeTransform {
  private translateService = inject(TranslateService);

  transform(
    value: number | string | null | undefined,
    currencyCode: string = 'EUR',
    display: 'symbol' | 'code' | 'name' = 'symbol',
  ): string {
    if (value === null || value === undefined || value === '') return '';

    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return '';

    // Obtenemos el idioma activo ('es', 'en', etc.) desde la señal
    const locale: LanguageCode = this.translateService.currentLang();

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: display,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue);
    } catch (error) {
      console.error(`Error formateando moneda: ${value}`, error);
      return `${numericValue} ${currencyCode}`;
    }
  }
}
