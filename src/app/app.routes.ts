import {Routes} from '@angular/router';
import {authGuard} from "./core/guards/auth.guard";
import {notAuthGuard} from "./core/guards/not-auth.guard";
import {PageNotFoundComponent} from "./core/components/page-not-found/page-not-found.component";

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [notAuthGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
  }, {
    path: 'games',
    canActivate: [authGuard],
    loadChildren: () => import('./features/games/games.routes').then(m => m.routes)
  }, {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./features/home/home.routes').then(m => m.routes)
  }, {
    path: 'roadmap',
    loadChildren: () => import('./features/roadmap/roadmap.routes').then(m => m.routes)
  },



  { path: '**', pathMatch: 'full', loadComponent: () => PageNotFoundComponent },
];
