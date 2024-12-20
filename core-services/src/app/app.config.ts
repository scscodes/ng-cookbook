import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient} from "@angular/common/http";
import { routes } from './app.routes';
import {SessionService} from "../core/session.service";

export function initApp(sessionService: SessionService) {
  return () => sessionService.initializeSession();
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SessionService],
      multi: true
    }
  ]
};
