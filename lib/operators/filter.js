import { createObsevable } from '../observable.js';

/** @type {import('../types').filter<T>}  */
export function filter(check) {
  return (source) => {
    return createObsevable((observer) => {
      const sourceSubscription = source.subscribe({
        next: (value) => {
          if (check(value)) {
            observer.next(value);
          }
        },
        error: (err) => {
          observer.error(err);
        },
        complete: () => {
          observer.complete();
        },
      });
      return () => {
        return sourceSubscription.unsubscribe();
      };
    });
  };
}
