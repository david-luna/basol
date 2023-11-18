import { createObsevable } from '../observable.js';

export function takeWhile(predicate, inclusive = false) {
  return (source) => {
    return createObsevable((observer) => {
      let index = 0;
      const sourceSubscription = source.subscribe({
        next: (value) => {
          const condition = predicate(value, index++);
          if (condition || inclusive) {
            observer.next(value);
          }
          if (!condition) {
            observer.complete();
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
