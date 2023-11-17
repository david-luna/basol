import { Observable } from '../observable.js';

export function map(project) {
  return (source) => {
    return new Observable((observer) => {
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
