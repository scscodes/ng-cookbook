import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';

// Helper function for Service Worker configuration
function provideCustomServiceWorker() {
  return provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(), // Only enable in production mode
    registrationStrategy: 'registerImmediately', // Delay for app stability
  });
}

// App Configuration
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // Provides HTTP client services
    provideZoneChangeDetection({
      eventCoalescing: true // Optimizes event handling
    }),
    provideRouter(routes), // Provides app's routing configuration
    provideCustomServiceWorker() // Service Worker, with cleaner abstraction
  ]
};
