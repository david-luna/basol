import { Observable } from '../observable';
import { OperatorFunction, Subscription } from '../types';

/**
 * For each value emited by the source observable `mergeMap` will call the projection
 * function to get another observable and merge it to the final stream
 *
 * @param project the projection function
 * @returns function
 */
export function mergeMap<T, P>(project: (value: T, index: number) => Observable<P>): OperatorFunction<T, P> {
  return (source: Observable<T>): Observable<P> => {
    return new Observable<P>((observer) => {
      const innerSubscriptions: Subscription[] = [];
      let completedSubscriptions = 0;
      let index = 0;

      const sourceSubscription = source.subscribe({
        next: (value) => {
          const projectedObserver = project(value, index++);

          const innerSubscription = projectedObserver.subscribe({
            next: (val) => observer.next(val),
            error: (err) => observer.error(err),
            complete: () => {
              completedSubscriptions++;
              if (completedSubscriptions === innerSubscriptions.length) {
                observer.complete();
              }
            },
          });

          innerSubscriptions.push(innerSubscription);
        },
        error: (err) => {
          observer.error(err);
        },
      });

      return () => {
        sourceSubscription.unsubscribe();
        innerSubscriptions.forEach((subscription) => {
          subscription.unsubscribe();
        });
      };
    });
  };
}
