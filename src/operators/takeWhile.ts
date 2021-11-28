import { Observable } from '../observable';
import { OperatorFunction } from '../types';

/**
 * Returns a function which transforms a source observable to a new one which emits vlues while
 * the predicate returns true.
 *
 * @param predicate function which tells of continue emiting or not
 * @param inclusive if true returns also the value that makes the predicate false
 * @returns function
 */
export function takeWhile<T>(
  predicate: (value: T, index: number) => boolean,
  inclusive = false,
): OperatorFunction<T, T> {
  return (source: Observable<T>): Observable<T> => {
    return new Observable<T>((observer) => {
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
