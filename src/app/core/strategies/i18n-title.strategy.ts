import { Injectable, inject, effect } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '../services/translate/translate.service';

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translateService = inject(TranslateService);

  private lastSnapshot: RouterStateSnapshot | null = null;

  constructor() {
    super();

    // Rastrear la Signal de traducciones
    effect(() => {
      const currentMap = this.translateService.translations();

      // Cuando la Signal reciba datos HTTP, aplicamos el título formateado
      if (currentMap && Object.keys(currentMap).length > 0 && this.lastSnapshot) {
        this.applyTitle(this.lastSnapshot);
      }
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.lastSnapshot = snapshot;
    this.applyTitle(snapshot);
  }

  private applyTitle(snapshot: RouterStateSnapshot): void {
    const currentMap = this.translateService.translations();
    if (!currentMap || Object.keys(currentMap).length === 0) {
      return;
    }

    const pageTitleKey = this.getLeafTitleKey(snapshot.root);

    const part1 = this.translateService.translate('LOGO.COMPANY_NAME_PART_1');
    const part2 = this.translateService.translate('LOGO.COMPANY_NAME_PART_2');
    const mainTitle = `${part1}${part2}`;
    const slogan = this.translateService.translate('LOGO.SLOGAN');

    if (pageTitleKey) {
      const pageTitle = this.translateService.translate(pageTitleKey);
      this.title.setTitle(`${mainTitle} | ${pageTitle}`);
    } else {
      this.title.setTitle(`${mainTitle} | ${slogan}`);
    }
  }

  private getLeafTitleKey(route: ActivatedRouteSnapshot): string | undefined {
    let current: ActivatedRouteSnapshot | null = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    while (current) {
      if (current.title) {
        return current.title;
      }
      current = current.parent;
    }
    return undefined;
  }
}
