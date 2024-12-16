import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient} from "@angular/common/http";
import { routes } from './app.routes';
import {NavListenerService} from "../core/collection/nav-listener.service";
import {DataBrokerService} from "../core/collection/data-broker.service";
import {SessionService} from "../core/session.service";

export function initApp(sessionService: SessionService) {
  return () => sessionService.initializeSession();
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    NavListenerService,
    DataBrokerService,
    SessionService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SessionService],
      multi: true
    }
  ]
};
