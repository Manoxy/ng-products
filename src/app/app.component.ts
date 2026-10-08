import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoadingService } from './core/services/loading/loading.service';
import { MessagesComponent } from './shared/components/messages/messages.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoadingComponent, MessagesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly loadingService = inject(LoadingService);
  private router = inject(Router);
  // Oculta el header si estamos en la ruta de login
  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }
}
