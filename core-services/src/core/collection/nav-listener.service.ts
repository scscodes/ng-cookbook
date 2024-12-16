import { Injectable } from '@angular/core';
import {GuardsCheckEnd, NavigationEnd, NavigationStart, Router, RouterEvent} from "@angular/router";
import {DataBrokerService} from "./data-broker.service";
import {filter} from "rxjs";
import {SessionService} from "../session.service";

/**
 * Service to track user's navigation between views/routes and monitor the duration of
 * active and idle times spent in each view. Implements automatic integration with the router
 * to record transitions between views, and maintains cumulative time data for each view.
 * Data is logged via a DataBrokerService for external reporting or analysis.
 *
 * This service is designed to track:
 * - Total active time spent in a view
 * - Total idle time spent in a view
 *
 * It listens to Angular's Router events (`NavigationStart` and `NavigationEnd`)
 * to manage view transitions and record relevant time data.
 */
@Injectable({
  providedIn: 'root'
})
export class NavListenerService {
  private currentView: string = 'initial';
  private views: Record<string, { totalActive: number; totalIdle: number }> = {
    initial: { totalActive: 0, totalIdle: 0 }
  };

  // Track baseline times from SessionService when entering a view
  private viewEnterActive = 0;
  private viewEnterIdle = 0;

  constructor(private router: Router, private sessionService: SessionService, private dataBroker: DataBrokerService) {
    this.listenToRouterEvents();
    this.recordViewEntry(this.currentView);
  }

  private listenToRouterEvents() {
    // On navigation start, finalize old view times
    this.router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(() => {
        this.recordViewExit();
      });

    // On navigation end, set new view and record entry baseline
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const newView = event instanceof NavigationEnd ? event.urlAfterRedirects : 'unknown';

        if (!this.views[newView]) {
          this.views[newView] = { totalActive: 0, totalIdle: 0 };
        }

        // Record the old view's final durations to the DataBroker
        const oldViewData = this.views[this.currentView];
        this.logViewDurations(this.currentView, oldViewData.totalActive, oldViewData.totalIdle);

        // Switch currentView and record new baseline
        this.currentView = newView;
        this.recordViewEntry(this.currentView);
      });
  }

  private recordViewEntry(viewName: string) {
    this.viewEnterActive = this.sessionService.getTotalActiveTime();
    this.viewEnterIdle = this.sessionService.getTotalIdleTime();
  }

  private recordViewExit() {
    const totalActiveNow = this.sessionService.getTotalActiveTime();
    const totalIdleNow = this.sessionService.getTotalIdleTime();

    const activeSpent = totalActiveNow - this.viewEnterActive;
    const idleSpent = totalIdleNow - this.viewEnterIdle;

    // Add to current view’s accumulators
    const viewData = this.views[this.currentView];
    viewData.totalActive += activeSpent;
    viewData.totalIdle += idleSpent;
  }

  private logViewDurations(view: string, active: number, idle: number) {
    const logEntry = {
      type: 'view_duration',
      view,
      active,
      idle,
      timestamp: new Date().toISOString()
    };
    this.dataBroker.addLog(logEntry);
  }

  getViewDurations(): Record<string, { totalActive: number; totalIdle: number }> {
    // If needed, finalize current view before returning data
    this.recordViewExit();
    return { ...this.views };
  }

  getCurrentView(): string {
    return this.currentView;
  }
}
