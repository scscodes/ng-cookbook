import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { switchMap, filter, catchError, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KeepAliveService implements OnDestroy {
  private readonly endpoint = 'https://example.com/keepalive';
  private readonly pollingIntervalSuccess = 60000; // 1 minute
  private readonly pollingIntervalFailure = 30000; // 30 seconds
  private pollingInterval = this.pollingIntervalSuccess;
  private pollingTrigger$ = new Subject<number>();
  private subscriptions = new Subject<void>();

  /**
   * Action to be performed if multiple keepalive requests fail.
   */
  private followUpAction: () => void = () => console.warn('Follow-up action needed!');

  /**
   * Constructor for the KeepAliveService.
   * @param http - Angular HttpClient to make HTTP requests.
   * @param router - Angular Router to listen for navigation events.
   */
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Initializes the keepalive process:
   * - Sets up a listener for router navigation events to reset polling.
   * - Starts the polling mechanism.
   */
  initializeKeepAlive(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd), // Listen for navigation end events
        takeUntil(this.subscriptions) // Ensure the subscription is cleaned up
      )
      .subscribe(() => this.resetPolling());

    this.startPolling(); // Begin polling when the service is initialized
  }

  /**
   * Sends a single keepalive HTTP request to the configured endpoint.
   * @returns An Observable that emits if the request is successful or propagates an error.
   */
  private sendKeepAliveRequest(): Observable<void> {
    return this.http.get<void>(this.endpoint);
  }

  /**
   * Starts the polling mechanism using dynamic intervals.
   * Adjusts the polling interval based on success or failure of the requests.
   */
  private startPolling(): void {
    this.pollingTrigger$
      .pipe(
        switchMap(interval =>
          timer(0, interval).pipe( // Start with an initial delay of 0
            switchMap(() => this.sendKeepAliveRequest()),
            catchError(error => {
              console.error('Keepalive polling failed!', error);
              this.pollingInterval = this.pollingIntervalFailure; // Use failure interval on error
              this.followUpAction(); // Execute follow-up action
              return []; // Stop further emissions for this cycle
            })
          )
        ),
        takeUntil(this.subscriptions) // Ensure subscription cleanup on destruction
      )
      .subscribe(() => {
        console.log('Polling keepalive - success');
        this.pollingInterval = this.pollingIntervalSuccess; // Revert to the success interval
        this.pollingTrigger$.next(this.pollingInterval); // Restart polling with updated interval
      });

    this.pollingTrigger$.next(this.pollingInterval); // Trigger initial polling
  }

  /**
   * Resets the polling back to the success interval. This is triggered on router navigation change.
   */
  private resetPolling(): void {
    console.log('Resetting polling due to navigation...');
    this.pollingInterval = this.pollingIntervalSuccess; // Reset to success interval
    this.pollingTrigger$.next(this.pollingInterval); // Restart polling
  }

  /**
   * Cleans up all active subscriptions when the service is destroyed.
   */
  ngOnDestroy(): void {
    this.subscriptions.next(); // Signal teardown to all observables
    this.subscriptions.complete(); // Complete the cleanup subscription
  }
}
