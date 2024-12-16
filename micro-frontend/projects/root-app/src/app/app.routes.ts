import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadComponent: () => import('./landing/landing.component').then(c => c.LandingComponent),
  },
  {
    path: 'project-a',
    loadChildren: () => import('../../../project-a/src/app/routes').then(m => m.projectARoutes),
  },
  {
    path: 'project-b',
    loadChildren: () => import('../../../project-b/src/app/routes').then(m => m.projectBRoutes),
  },
];
