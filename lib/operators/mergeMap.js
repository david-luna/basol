import { createObsevable } from '../observable.js';

/**
 * @template T,R
 * @param {(value: T, index: number) => import('../observable').Observable<R>} project
 * @returns {import('../observable').OperatorFunction<T,R>}
 */
export function mergeMap(project) {
  return (source) => {
    return createObsevable((observer) => {
      const innerSubscriptions = [];
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
