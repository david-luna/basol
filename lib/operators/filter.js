import { createObsevable } from '../observable.js';

/**
 * @template T
 * @param {(value: T) => boolean} check
 * @returns {import('../observable').OperatorFunction<T,T>}
 */
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
