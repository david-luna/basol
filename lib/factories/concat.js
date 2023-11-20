import { createObsevable } from '../observable.js';

/**
 * @param  {...import('../types').Observable<any>} observables
 * @returns {import('../types').Observable<any>}
 */
export function concat(...observables) {
  return createObsevable((observer) => {
    /** @type {import('../types').Observer<any>} */
    const innerObserver = {
      next: (value) => {
        observer.next(value);
      },
      error: (err) => {
        observer.error(err);
      },
      complete: () => {
        activeSubscription.unsubscribe();
        observables.shift();
        if (observables.length === 0) {
          observer.complete();
        } else {
          activeSubscription = observables[0].subscribe(innerObserver);
        }
      },
    };

    let activeSubscription = observables[0].subscribe(innerObserver);

    return () => {
      activeSubscription.unsubscribe();
    };
  });
}
