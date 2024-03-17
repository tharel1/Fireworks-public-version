import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'games', loadChildren: () => import('./features/games/games.routes').then(m => m.routes)}
];
