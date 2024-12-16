import { Routes } from '@angular/router';

export const projectARoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'feature',
    loadComponent: () =>
      import('./components/feature/feature.component').then(c => c.FeatureComponent),
  },
];
