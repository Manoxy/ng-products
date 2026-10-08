import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'GENERAL.PAGES.LOGIN',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  // Protege a todos los hijos sin añadir capas vacías
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: 'home',
        title: 'GENERAL.PAGES.HOME',
        loadComponent: () =>
          import('./components/home/home.component').then((m) => m.HomeComponent),
      },
      // ... resto de rutas
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
