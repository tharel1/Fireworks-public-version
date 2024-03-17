import {Routes} from "@angular/router";

export const routes: Routes = [
  { path: 'hanabi', title: `Hanabi`, loadChildren: () => import('./hanabi/hanabi.routes').then(m => m.routes)}
];
