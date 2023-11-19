import { createObsevable } from '../observable.js';

/** @type {import('../types').map<T,R>}  */
export function map(project) {
  return (source) => {
    return createObsevable((observer) => {
      const sourceSubscription = source.subscribe({
        next: (value) => {
          observer.next(project(value));
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
