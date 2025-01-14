import {Injectable, OnDestroy, signal} from '@angular/core';
import {EventListenerService} from "./collection/event-listener.service";
import {DataBrokerService} from "./collection/data-broker.service";
import {filter, fromEvent, interval, Subscription} from "rxjs";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {
  // Constants for system-wide thresholds and intervals
  private static readonly INTERVAL_MS = 1000; // 1 second interval
  private static readonly IDLE_THRESHOLD_MS = 30_000; // 30 seconds threshold for idle state

  // Global window session tracking
  private sessionStartTime = Date.now();
  private windowVisibilityState = signal(document.visibilityState); // Tracks visibility state of the window
  private isWindowIdle = signal(false); // Tracks whether the browser window is idle

  // RxJS interval signal
  private intervalTime$ = interval(SessionService.INTERVAL_MS);

  // Stores metrics for views
  public viewMetrics: Array<{
    id: number; // Tracking ID of the route
    view: string; // View name or URL
    active: number; // Time spent actively on the view
    idle: number; // Time spent idle on the view
    hidden: number; // Time spent in a hidden state
    routing: number; // Time spent navigating to this route
  }> = [];

  // Current view tracking
  private viewStartTime = Date.now(); // Session view start time
  private currentView = signal('/'); // Current active route or view
  private viewIdleDuration = signal(0); // Total idle duration in the current view
  private viewHiddenDuration = signal(0); // Total duration hidden in the current view
  private viewActiveDuration = signal(0); // Total active duration in the current view

  // Metrics for routing
  private routeStart = Date.now(); // Start time for navigation
  private routingDuration = signal(0); // Duration spent routing
  private routeStop = Date.now(); // Stop time for navigation
  private idleSubscriptions: Subscription = new Subscription(); // Manages observables subscriptions

  // Publicly accessible signals for external usage
  public readonly viewStateSignals = {
    currentView: this.currentView,
    idleDuration: this.viewIdleDuration,
    hiddenDuration: this.viewHiddenDuration,
    activeDuration: this.viewActiveDuration,
  };

  /**
   * Constructor to initialize services for routing, DOM events, and logging.
   * @param router Router instance for handling navigation events.
   * @param domListener Service to manage DOM-level event listeners.
   * @param dataBroker Service to handle logging and flushing events.
   */
  constructor(private router: Router, private domListener: EventListenerService, private dataBroker: DataBrokerService) {
    this.initializeIdleTracking();
    this.initializeRouteListener();
  }

  /**
   * Lifecycle hook to clean up subscriptions and event listeners upon destruction of the instance.
   */
  ngOnDestroy(): void {
    this.idleSubscriptions.unsubscribe();
    document.onvisibilitychange = null;
  }

  /**
   * Initialize session. Can be extended for further initialization logic.
   * @returns A promise indicating when initialization is complete.
   */
  initializeSession(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Sets up tracking for idle time and visibility state of the browser window.
   * Tracks mouse movements, key presses, and determines idle and active states.
   */
  private initializeIdleTracking(): void {
    document.onvisibilitychange = () => {
      this.windowVisibilityState.set(document.visibilityState);
    };

    let lastActivityTime = Date.now();
    const activitySub = fromEvent(document, 'mousemove').subscribe(() => (lastActivityTime = Date.now()));
    const keypressSub = fromEvent(document, 'keypress').subscribe(() => (lastActivityTime = Date.now()));
    const intervalSub = this.intervalTime$.subscribe(() => {
      const isIdle = Date.now() - lastActivityTime > SessionService.IDLE_THRESHOLD_MS;
      this.isWindowIdle.set(isIdle);
      const currentState = isIdle
        ? "idle"
        : this.windowVisibilityState() === "hidden"
          ? "hidden"
          : "active";
      this.updateViewDurations(currentState);
    });

    this.idleSubscriptions.add(activitySub);
    this.idleSubscriptions.add(keypressSub);
    this.idleSubscriptions.add(intervalSub);
  }

  /**
   * Updates the durations for the current view based on its state (active, hidden, idle).
   * @param state Current state of the view: "idle", "hidden", or "active".
   */
  private updateViewDurations(state: string): void {
    switch (state) {
      case "idle":
        this.viewIdleDuration.set(this.viewIdleDuration() + SessionService.INTERVAL_MS);
        break;
      case "hidden":
        this.viewHiddenDuration.set(this.viewHiddenDuration() + SessionService.INTERVAL_MS);
        break;
      case "active":
        this.viewActiveDuration.set(this.viewActiveDuration() + SessionService.INTERVAL_MS);
        break;
    }
  }

  /**
   * Tracks navigation events and updates necessary metrics and states for each route.
   */
  private initializeRouteListener(): void {
    const routeSub: Subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart || event instanceof NavigationEnd))
      .subscribe((event: NavigationStart | NavigationEnd) => {
        const emitTime: number = Date.now();
        if (event instanceof NavigationStart) {
          this.saveCurrentViewMetrics(event.id);
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

  /**
   * Tracks and logs metrics for a completed view upon route navigation.
   * @param routeId Unique identifier for the route.
   */
  private saveCurrentViewMetrics(routeId: number): void {
    const routeLog = {
      id: routeId,
      view: this.currentView(),
      active: this.viewActiveDuration(),
      hidden: this.viewHiddenDuration(),
      idle: this.viewIdleDuration(),
      routing: this.routeStop - this.routeStart,
    };
    console.log('+', routeLog);
    this.viewMetrics.push(routeLog);
    this.dataBroker.addLog(routeLog);
  }
}
