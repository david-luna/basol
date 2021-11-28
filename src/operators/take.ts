import { Observable } from '../observable';
import { OperatorFunction } from '../types';

/**
 * Returns a function which transforms a source observable to a new one which emits as much values as the count says
 *
 * @param count the number of values to take
 * @returns function
 */
export function take<T>(count: number): OperatorFunction<T, T> {
  return (source: Observable<T>): Observable<T> => {
    return new Observable<T>((observer) => {
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
