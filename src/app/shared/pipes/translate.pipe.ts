import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '../../core/services/translate/translate.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false, // Importante: 'pure: false' permite reaccionar dinámicamente al cambio de idioma
})
export class TranslatePipe implements PipeTransform {
  private translateService = inject(TranslateService);

  transform(key: string): string {
    if (!key) return '';
    return this.translateService.translate(key);
  }
}
