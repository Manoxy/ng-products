import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
      {
        path: 'products',
        children: [
          {
            path: '',
            title: 'GENERAL.PAGES.PRODUCTS_LIST',
            loadComponent: () =>
              import('./components/products/products.component').then((m) => m.ProductsComponent),
          },
          {
            path: 'create',
            title: 'GENERAL.PAGES.CREATE_PRODUCT',
            loadComponent: () =>
              import('./components/products/products-detail/products-detail.component').then(
                (m) => m.ProductsDetailComponent,
              ),
          },
          {
            path: ':id',
            title: 'GENERAL.PAGES.EDIT_PRODUCT',
            loadComponent: () =>
              import('./components/products/products-detail/products-detail.component').then(
                (m) => m.ProductsDetailComponent,
              ),
          }
        ]
      },
      {
        path: 'my-account',
        title: 'GENERAL.PAGES.MY_ACCOUNT',
        loadComponent: () =>
          import('./components/my-account/my-account.component').then((m) => m.MyAccountComponent),
      },
      {
        path: 'configuration',
        title: 'GENERAL.PAGES.CONFIGURATION',
        loadComponent: () =>
          import('./components/config/config.component').then((m) => m.ConfigComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
