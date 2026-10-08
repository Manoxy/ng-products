import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '../../core/services/translate/translate.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false, // Importante: para que reevalúe en cambios de estado
})
export class TranslatePipe implements PipeTransform {
  private translateService = inject(TranslateService);

  transform(key: string, params?: Record<string, unknown>): string {
    // Al ejecutar translate(), internamente se lee this.translationsSignal(),
    // lo cual notifica a Angular que vuelva a pintar el texto.
    return this.translateService.translate(key, params);
  }
}
