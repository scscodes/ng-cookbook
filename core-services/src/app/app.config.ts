import {ApplicationConfig, inject, provideAppInitializer} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import { routes } from './app.routes';
import {SessionService} from "../core/session.service";
import {rootHttpInterceptor} from "../core/root-http.interceptor";


export function initApp(sessionService: SessionService): Promise<void> {
  return sessionService.initializeSession().catch(err => {
    console.error('Session initialization failed:', err);
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([rootHttpInterceptor])),
    provideRouter(routes),
    provideAppInitializer(async () => {
      const sessionService = inject(SessionService);
      try {
        return await sessionService.initializeSession();
      } catch (err) {
        console.error('Session initialization failed:', err);
      }
    })
  ]
};
