import { Observable } from '../observable.js';

export function filter(check) {
  return (source) => {
    return new Observable((observer) => {
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
