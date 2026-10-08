import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { SHARED_IMPORTS } from '../../imports/shared-imports';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../core/services/translate/translate.service';
import { LANGUAGES, LanguageCode } from '../../constants/AppConstants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SHARED_IMPORTS, RouterLinkActive, RouterLink, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private subscriptions = new Subscription();

  // Exponer la constante de idiomas para usarla en el HTML de forma fuertemente tipada
  readonly languages = LANGUAGES;

  readonly isLoggedIn = computed(() => this.authService.isLoggedIn());

  isUserMenuOpen = signal(false);
  isLangMenuOpen = signal(false);
  public currentLang = this.translateService.currentLang;

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
    this.isLangMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((prev) => !prev);
    if (!this.isUserMenuOpen()) {
      this.isLangMenuOpen.set(false);
    }
  }

  toggleLangMenu(event: Event): void {
    event.stopPropagation();
    this.isLangMenuOpen.update((prev) => !prev);
  }

  async selectLang(lang: LanguageCode, event: Event): Promise<void> {
    event.stopPropagation();
    await this.translateService.setLanguage(lang); // ✅ Carga el JSON /i18n/{lang}.json y actualiza el Signal
    this.isLangMenuOpen.set(false);
  }

  onLogout(): void {
    this.closeUserMenu();
    this.authService.logoutAndRemoveAll();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
