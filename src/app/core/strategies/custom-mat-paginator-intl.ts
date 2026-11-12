import { Injectable, inject, effect } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '../services/translate/translate.service';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  private translateService = inject(TranslateService);

  constructor() {
    super();

    // Usamos un effect de Angular para reaccionar automáticamente
    // cada vez que cambien las traducciones o el idioma actual en tu Signal.
    effect(() => {
      // Dependemos de la señal para que el effect se ejecute al cambiar de idioma
      this.translateService.translations();
      this.updateLabels();
    });
  }

  private updateLabels(): void {
    this.itemsPerPageLabel = this.translateService.translate('PAGINATOR.ITEMS_PER_PAGE');
    this.nextPageLabel = this.translateService.translate('PAGINATOR.NEXT_PAGE');
    this.previousPageLabel = this.translateService.translate('PAGINATOR.PREVIOUS_PAGE');
    this.firstPageLabel = this.translateService.translate('PAGINATOR.FIRST_PAGE');
    this.lastPageLabel = this.translateService.translate('PAGINATOR.LAST_PAGE');

    // Sobrescribimos el formato de los rangos ("1 - 10 de 50")
    this.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return this.translateService.translate('PAGINATOR.RANGE_EMPTY', { length });
      }
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

      const ofText = this.translateService.translate('PAGINATOR.OF');
      return `${startIndex + 1} – ${endIndex} ${ofText} ${length}`;
    };

    // Notificamos a Angular Material de que los textos han cambiado para que los repinte
    this.changes.next();
  }
}
