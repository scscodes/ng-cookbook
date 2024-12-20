import {Injectable, OnDestroy, signal} from '@angular/core';
import {EventListenerService} from "./collection/event-listener.service";
import {DataBrokerService} from "./collection/data-broker.service";
import {filter, fromEvent, interval, Subscription} from "rxjs";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";



@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {
  // global window and visibility tracking
  private sessionStartTime = Date.now();
  private winHidden = signal(document.visibilityState);
  private winIdle = signal(false);

  // conditional values
  private intervalTime = 1000;
  private intervalTime$ = interval(1000);
  private idleThresholdTime = 30_000;

  // view metrics
  public viewMetrics: Array<{
    id: number;
    view: string;
    active: number;
    idle: number;
    hidden: number;
    routing: number;
  }> = [];

  private viewStartTime = Date.now();
  private currentView = signal('/');
  private viewIdleDuration = signal(0);
  private viewHiddenDuration = signal(0);
  private viewActiveDuration = signal(0);

  // route metrics
  private routeStart: number = Date.now();
  private routingDuration = signal(0);
  private routeStop: number = Date.now();
  private idleSubscriptions: Subscription = new Subscription();

  // Public getters using signals
  getSessionStart = this.sessionStartTime;
  getViewStart = this.viewStartTime;
  getCurrentView =this.currentView;
  getViewIdleDuration = this.viewIdleDuration;
  getViewHiddenDuration =this.viewHiddenDuration;
  getViewActiveDuration = this.viewActiveDuration;

  constructor(private router: Router, private domListener: EventListenerService, private dataBroker: DataBrokerService) {
    // Initialize periodic updates
    this.initializeIdleTracking();
    this.initializeRouteListener();
  }

  ngOnDestroy(): void {
    this.idleSubscriptions.unsubscribe();
  }

  // Session initialization mock
  initializeSession(): Promise<void> {
    return Promise.resolve();
  }

  initializeIdleTracking(): void {
    document.onvisibilitychange = () => {
      this.winHidden.set(document.visibilityState);
    };

    // user activity/explicit idle
    let lastActivityTime: number = Date.now();

    const activitySub: Subscription = fromEvent(document, 'mousemove').subscribe(() => (lastActivityTime = Date.now()));
    const keypressSub: Subscription = fromEvent(document, 'keypress').subscribe(() => (lastActivityTime = Date.now()));
    const intervalSub: Subscription = this.intervalTime$.subscribe(() => {
      const isIdle = Date.now() - lastActivityTime > this.idleThresholdTime;
      this.winIdle.set(isIdle);

      const isHidden: boolean = this.winHidden() === 'hidden';

      if (this.winIdle()) {
        this.viewIdleDuration.set(this.viewIdleDuration() + this.intervalTime);
      } else if (isHidden) {
        this.viewHiddenDuration.set(this.viewHiddenDuration() + this.intervalTime);
      } else {
        this.viewActiveDuration.set(this.viewActiveDuration() + this.intervalTime);
      }
    });

    // add subs
    this.idleSubscriptions.add(activitySub);
    this.idleSubscriptions.add(keypressSub);
    this.idleSubscriptions.add(intervalSub);
  }

  initializeRouteListener(): void {
    const routeSub: Subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart || event instanceof NavigationEnd))
      .subscribe((event: NavigationStart | NavigationEnd) => {
        const emitTime: number = Date.now();

        // nav start = inbound event. save existing metrics and reset counters to accommodate
        if (event instanceof NavigationStart) {
          this.saveCurrentViewMetrics(event.id);

          // Baseline for inbound route
          this.routeStart = emitTime;
          this.routingDuration.set(0);
          this.viewIdleDuration.set(0);
          this.viewHiddenDuration.set(0);
          this.viewActiveDuration.set(0);
        } else {
          this.currentView.set(event.urlAfterRedirects || event.url || 'unknown');
          this.routeStop = emitTime;
        }
      });
    this.idleSubscriptions.add(routeSub);
  }

  private saveCurrentViewMetrics(routeId: number): void {
    const routeLog = {
      id: routeId,
      view: this.currentView(),
      active: this.getViewActiveDuration(),
      hidden: this.getViewHiddenDuration(),
      idle: this.getViewIdleDuration(),
      routing: this.routeStop - this.routeStart,
    }
    console.log('+', routeLog)
    this.viewMetrics.push(routeLog);
    this.dataBroker.addLog(routeLog);
  }


}
