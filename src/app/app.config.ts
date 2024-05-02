import {ApplicationConfig, ErrorHandler} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {AppErrorHandler} from "./app.error-handler";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    {provide: ErrorHandler, useClass: AppErrorHandler}
  ]
};
