import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DashboardLayoutConfig } from '../components/dashboard-layout/dashboard-layout.component';

export interface UserLayoutPreferences extends DashboardLayoutConfig {
  responsive: boolean;
  allowUserCustomization: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserLayoutService {
  private preferences$ = new BehaviorSubject<UserLayoutPreferences>({
    columns: 3,
    gap: '20px',
    maxWidth: '1200px',
    padding: '20px',
    responsive: true,
    allowUserCustomization: true
  });

  get preferences(): Observable<UserLayoutPreferences> {
    return this.preferences$.asObservable();
  }

  get currentPreferences(): UserLayoutPreferences {
    return this.preferences$.value;
  }

  updateLayout(updates: Partial<UserLayoutPreferences>): void {
    const current = this.preferences$.value;
    this.preferences$.next({ ...current, ...updates });
    this.saveToStorage();
  }

  private saveToStorage(): void {
    const prefs = this.preferences$.value;
    localStorage.setItem('dashboard-layout-preferences', JSON.stringify(prefs));
  }

  loadFromStorage(): void {
    const stored = localStorage.getItem('dashboard-layout-preferences');
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        this.preferences$.next(prefs);
      } catch (error) {
        console.warn('Failed to load layout preferences from storage');
      }
    }
  }
} 