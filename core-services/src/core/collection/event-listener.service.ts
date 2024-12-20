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
  private eventStream = new Subject<{ [key: string]: string | boolean | number }>();
  private emitIntervalMs = 3000;
  private elementsInScope: string[] = ['BUTTON', 'INPUT'];

  /**
   * events$ emits arrays of events every few seconds (1000ms = 1s)
   */
  events$ = this.eventStream.asObservable().pipe(bufferTime(this.emitIntervalMs));

  constructor(private ngZone: NgZone, private dataBroker: DataBrokerService) {
    this.setupEventListeners();
    this.subscribeToBatchedEvents();
  }

  /**
   * Set up global event listeners outside Angular's zone and re-enter the zone only when emitting
   */
  private setupEventListeners(): void {
    this.ngZone.runOutsideAngular(() => {
      // Click events
      document.addEventListener('click', (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        if (!this.elementsInScope.includes(target.tagName)) return;
        const eventPayload: any = this.createEventPayload(event, target);
        this.zoneRun(eventPayload);
      });

      // Mouseover/hover events
      document.addEventListener('mouseover', (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        if (!this.elementsInScope.includes(target.tagName)) return;
        const eventPayload: any = this.createEventPayload(event, target);
        this.zoneRun(eventPayload);
      });

      // Visibility <visible | hidden> events
      document.addEventListener('visibilitychange', (): void => {
        this.zoneRun({
          type: 'visibility',
          action: document.visibilityState,
        });
      });

      // Beforeunload (session exit) events - can prompt! if control/event/target have value! event.preventDefault()
      window.addEventListener('beforeunload', (): void => {
        this.zoneRun({
          type: 'unload',
          action: document.visibilityState,
        });
      });
    });
  }

  /**
   * Facilitate ngZone.run() for any standing event listeners to use at-will
   */
  private zoneRun(payload: { [key: string]: string | boolean | number }): void {
    this.ngZone.run(() => {
      this.eventStream.next(payload);
    });
  }

  /**
   * Subscribe to the batched events and forward them to the DataBrokerService.
   */
  private subscribeToBatchedEvents(): void {
    this.events$.subscribe((events: { [key: string]: string | number | boolean }[]) => {
      if (events.length > 0) {
        for (const evt of events) {
          this.dataBroker.addLog(evt);
        }
      }
    });
  }

  /**
   * For compliant events, reconcile Text value to use
   */
  private extractTextContent(target: HTMLElement): string {
    let textContent: string = target.textContent || target.innerText;
    if (!textContent && target instanceof HTMLInputElement) {
      textContent = target.value || target.id;
    }
    return textContent || '';
  }

  /**
   * Return structured object that is compatible with the DataBrokerService.
   */
  private createEventPayload(event: MouseEvent, target: HTMLElement): any {
    // If needed, event getAttributeNames/getAttributes can facilitate dynamic key:value obj
    const tagName: string = target.tagName;
    return {
      action: event.type,
      el: tagName,
      type: target.getAttribute('type') || tagName,
      text: tagName === 'HTML' ? '' : this.extractTextContent(target),
      x: event.clientX,
      y: event.clientY
    };
  }

}
