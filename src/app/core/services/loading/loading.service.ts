import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private activeRequests = signal<number>(0);

  // Expone de forma pública y reactiva si el spinner debe verse o no
  public readonly isLoading = computed(() => this.activeRequests() > 0);

  /**
   * Activa o desactiva el indicador de carga.
   * @param active boolean - true para mostrar, false para ocultar
   */
  public toggleIndicator(active: boolean): void {
    if (active) {
      this.activeRequests.update((count) => count + 1);
    } else {
      this.activeRequests.update((count) => Math.max(0, count - 1));
    }
  }

  /**
   * Fuerza el cierre total del spinner reseteando el contador.
   */
  public forceHide(): void {
    this.activeRequests.set(0);
  }
}
