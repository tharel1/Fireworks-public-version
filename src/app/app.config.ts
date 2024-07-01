import {ApplicationConfig, ErrorHandler} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {AppErrorHandler} from "./app.error-handler";
import {MAT_CARD_CONFIG} from "@angular/material/card";
import {environment} from "../environments/environment";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    {provide: ErrorHandler, useClass: AppErrorHandler},
    {provide: MAT_CARD_CONFIG, useValue: {appearance: 'outlined'}},
    {provide: FIREBASE_OPTIONS, useValue: environment.firebase}
  ]
};
