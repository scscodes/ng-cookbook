import {Injectable, NgZone} from "@angular/core";
import {bufferTime, Subject} from "rxjs";
import {DataBrokerService} from "./data-broker.service";

/**
 * EventListenerService:
 * - Captures `click`, `mouseover`, and `beforeunload` events outside Angular's zone.
 * - Runs inside the Angular zone only when emitting events via the observable stream.
 * - Batches events every 1 second to reduce emission frequency.
 * - Now integrates with a DataBrokerService to forward logged events.
 */
@Injectable({
  providedIn: 'root'
})
export class EventListenerService {
  private eventStream = new Subject<{type: string; payload: any}>();

  /**
   * event$ emits arrays of events every 1 second.
   * For example, if 5 click events occur in one second, event$ will emit once
   * with an array of those 5 events.
   */
  event$ = this.eventStream.asObservable().pipe(bufferTime(1000));

  constructor(private ngZone: NgZone, private dataBroker: DataBrokerService) {
    this.setupEventListeners();
    this.subscribeToBatchedEvents();
  }

  /**
   * Set up global event listeners outside Angular's zone
   * and re-enter the zone only when emitting events.
   */
  private setupEventListeners(): void {
    this.ngZone.runOutsideAngular(() => {
      // Click events
      document.addEventListener('click', (event: MouseEvent) => {
        this.ngZone.run(() => {
          this.eventStream.next({ type: 'click', payload: { x: event.clientX, y: event.clientY } });
        });
      });

      // Mouseover events
      document.addEventListener('mouseover', (event: MouseEvent) => {
        this.ngZone.run(() => {
          this.eventStream.next({ type: 'hover', payload: { x: event.clientX, y: event.clientY } });
        });
      });

      // Beforeunload (session exit)
      window.addEventListener('beforeunload', () => {
        this.ngZone.run(() => {
          this.eventStream.next({ type: 'session_exit', payload: {} });
        });
      });
    });
  }

  /**
   * Subscribe to the batched events and forward them to the DataBrokerService.
   */
  private subscribeToBatchedEvents(): void {
    this.event$.subscribe(events => {
      // Each emission is an array of events batched over the last second
      for (const evt of events) {
        this.dataBroker.addLog(evt);
      }
    });
  }
}
