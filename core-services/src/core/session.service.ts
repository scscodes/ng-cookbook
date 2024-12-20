import {computed, Injectable, signal} from '@angular/core';
import {EventListenerService} from "./collection/event-listener.service";
import {DataBrokerService} from "./collection/data-broker.service";

/**
 * This service manages session-related information, including tracking user activity,
 * calculating total active/idle time, and determining whether the user is currently idle.
 * It provides utilities for recording interactions and updating session state periodically.
 * Designed to be injected as a singleton.
 */

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionStartTime = Date.now();
  private lastInteractionTime = Date.now();
  private idleThreshold = 30_000; // 30s inactivity => idle

  // Signals for tracking
  private totalIdleTime = signal(0);
  private totalActiveTime = signal(0);
  private isIdle = computed(() => {
    // Compute if idle based on lastInteractionTime
    const now = Date.now();
    return now - this.lastInteractionTime > this.idleThreshold;
  });

  constructor(private els: EventListenerService, private dbs: DataBrokerService) {
    // Periodically update durations
    setInterval(() => this.updateDurations(), 1000);
  }

  // Session initialization mock
  initializeSession(): Promise<void> {
    return new Promise(resolve => {
      console.log('[SessionService] Initializing session...');
      setTimeout(() => {
        console.log('[SessionService] Session ready (mocked)');
        resolve();
      }, 500); // mock async operation
    });
  }

  /**
   * Record a user interaction. This resets idle logic and updates times.
   */
  recordInteraction(): void {
    this.lastInteractionTime = Date.now();
    // Calling updateDurations to ensure counters catch up to the last second
    this.updateDurations();
  }

  /**
   * Updates the total active/idle times.
   * Called periodically (every 1s) or on-demand after interactions.
   */
  private updateDurations() {
    const now = Date.now();
    const elapsed = 1000; // This method runs every 1s via setInterval

    if (this.isIdle()) {
      this.totalIdleTime.update(idle => idle + elapsed);
    } else {
      this.totalActiveTime.update(active => active + elapsed);
    }
  }

  // Public getters using signals
  getSessionDuration = computed(() => Date.now() - this.sessionStartTime);
  getIsIdle = this.isIdle;
  getTotalIdleTime = this.totalIdleTime;
  getTotalActiveTime = this.totalActiveTime;
}

