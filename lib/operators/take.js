import { Observable } from '../observable.js';

export function take(count) {
  return (source) => {
    return new Observable((observer) => {
      let seen = 0;
      const sourceSubscription = source.subscribe({
        next: (value) => {
          if (++seen <= count) {
            observer.next(value);
          }
          if (count <= seen) {
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
