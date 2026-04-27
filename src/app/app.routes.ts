// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing/landing';
import { authGuard } from './core/guards/auth.guard';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },

  // Login — SEM guard (precisa ser acessível para logar)
  {
    path: `${environment.adminPath}/login`,
    loadComponent: () =>
      import('./features/landing/sections/admin/login/login').then((m) => m.Login),
  },

  // Dashboard — COM guard (só entra após login)
  {
    path: environment.adminPath,
    canActivate: [authGuard],
    loadComponent: () => import('./features/landing/sections/admin/admin').then((m) => m.Admin),
  },

  // Bloqueia tentativas diretas em /admin
  {
    path: 'admin',
    redirectTo: '/404',
  },

  // Página 404
  {
    path: '404',
    loadComponent: () =>
      import('./features/landing/sections/not-found/not-found').then((m) => m.NotFound),
  },

  // Qualquer rota desconhecida → 404
  {
    path: '**',
    redirectTo: '/404',
  },
];
