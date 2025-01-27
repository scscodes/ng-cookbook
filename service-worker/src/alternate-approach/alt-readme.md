# Service Worker with Backend Connectivity Monitoring for Angular and Flask

This README describes how to configure a service worker to:
- Cache static assets and API responses for offline support.
- Monitor connectivity to a Flask backend and notify the Angular app of connectivity status.
- Handle offline scenarios with graceful fallbacks.

---

## Features
1. **Static Asset and API Caching**: Ensures app functionality during offline scenarios.
2. **Backend Connectivity Monitoring**: Periodically checks backend availability.
3. **Angular App Integration**: Provides connectivity status updates and triggers UI updates.
4. **Flask Health Check Endpoint**: Allows the service worker to check backend connectivity.

---

### Create `src/service-worker.js`

### Modify index.html; register service worker in Angular

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('[Service Worker] Registered:', registration);

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'connectivity') {
          console.log(`[Connectivity] Status: ${event.data.status}`);
          // Notify the app about the connectivity status
          window.dispatchEvent(new CustomEvent('backendConnectivity', { detail: event.data.status }));
        }
      });
    });
  }
</script>

```
### Create service to monitor events
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectivityService {
  private connectivityStatus = new BehaviorSubject<'online' | 'offline'>('online');
  public status$ = this.connectivityStatus.asObservable();

  constructor() {
    window.addEventListener('backendConnectivity', (event: any) => {
      const status = event.detail;
      this.connectivityStatus.next(status);
    });
  }
}

```
### Component integration
```typescript
import { Component, OnInit } from '@angular/core';
import { ConnectivityService } from './connectivity.service';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="connectivity === 'offline'" class="alert alert-warning">
      You are offline. Some features may not be available.
    </div>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  connectivity: 'online' | 'offline' = 'online';

  constructor(private connectivityService: ConnectivityService) {}

  ngOnInit(): void {
    this.connectivityService.status$.subscribe((status) => {
      this.connectivity = status;
      if (status === 'offline') {
        console.warn('Backend is offline. Switching to offline mode.');
      }
    });
  }
}

```
