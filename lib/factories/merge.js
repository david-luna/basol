import { createObsevable } from '../observable.js';

/**
 * @param  {...import('../types').Observable<any>} observables
 * @returns {import('../types').Observable<any>}
 */
export function merge(...observables) {
  return createObsevable((observer) => {
    /** @type {import('../types').Subscription[]} */
    const innerSubscriptions = [];
    let completedSubscriptions = 0;

    /** @type {import('../types').Observer<any>} */
    const innerObserver = {
      next: (value) => {
        observer.next(value);
      },
      error: (err) => {
        observer.error(err);
      },
      complete: () => {
        completedSubscriptions++;
        if (completedSubscriptions === innerSubscriptions.length) {
          observer.complete();
        }
      },
    };
    observables.forEach((observable) => {
      innerSubscriptions.push(observable.subscribe(innerObserver));
    });
    return () => {
      innerSubscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    };
  });
}
