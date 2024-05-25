import { createObsevable } from '../observable.js';

/**
 * @template T
 * @param {(value: T) => void} fn
 * @returns {import('../observable').OperatorFunction<T,T>}
 */
export function tap(fn) {
  return (source) => {
    return createObsevable((observer) => {
      const sourceSubscription = source.subscribe({
        next: (value) => {
          fn(value);
          observer.next(value);
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
