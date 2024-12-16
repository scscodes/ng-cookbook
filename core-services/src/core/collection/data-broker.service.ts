import { Injectable } from '@angular/core';

/**
 * Service to handle buffering, batching, and transmitting log data to a remote server.
 * Utilizes a combination of size, count, and time thresholds to determine when to flush logs.
 * Implements strategies such as `navigator.sendBeacon` and `fetch` for transmitting data, ensuring reliability
 * even during events like page unload.
 */
@Injectable({
  providedIn: 'root'
})
export class DataBrokerService {
  private logs: any[] = [];
  private readonly maxLogs = 50;     // Flush threshold by count
  private readonly flushInterval = 60000; // 60 seconds
  private readonly maxSizeBytes = 10000 // ~10KB
  private readonly apiEndpoint = '/api/logs';

  constructor() {
    // Periodic flush by interval
    setInterval(() => this.flush(), this.flushInterval);
  }

  /**
   * Add a log entry to the buffer.
   * If the buffer exceeds the max size, automatically trigger a flush.
   */
  // todo: flag or indicator that can be called, to have broker bounce the sessionService.recordInteraction
  addLog(entry: any): void {
    this.logs.push(entry);
    if (this.logs.length >= this.maxLogs) {
      this.flush();
    }
  }

  /**
   * Flush the current buffer to the remote API.
   * Attempts to use sendBeacon, falling back to fetch if unavailable or if synchronous sending is needed.
   */
  flush(): void {
    if (this.logs.length === 0) return;

    const payload = JSON.stringify(this.logs);
    this.logs = []; // Clear immediately to avoid duplicates

    // Prefer sendBeacon for non-blocking "fire-and-forget"
    if (navigator && 'sendBeacon' in navigator) {
      const success = navigator.sendBeacon(this.apiEndpoint, new Blob([payload], { type: 'application/json' }));
      if (!success) {
        // If sendBeacon fails, fallback to fetch
        this.fallbackFetch(payload);
      }
    } else {
      // No sendBeacon support, fallback
      this.fallbackFetch(payload);
    }
  }

  /**
   * Fallback using fetch if sendBeacon isn't supported or fails.
   */
  private fallbackFetch(payload: string): void {
    fetch(this.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true // Attempts to allow request to complete even during unload
    }).catch(err => console.error('[LogBrokerService] Flush error:', err));
  }

  private requestIdleFlush() {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => this.flush());
    } else {
      // Fallback if no requestIdleCallback
      setTimeout(() => this.flush(), 100);
    }
  }

  private shouldFlush(): boolean {
    if (this.logs.length >= this.maxLogs) return true;
    const size = new Blob([JSON.stringify(this.logs)]).size;
    return size > this.maxSizeBytes;
  }
}
