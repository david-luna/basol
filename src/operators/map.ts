import { Observable } from "../observable";
import { OperatorFunction } from "../types";

/**
 * Returns a function which transforms a source observable to a new one which emits values resulting
 * from the projection param
 *
 * @param project the projection function
 * @returns function
 */
export function map<T, R>(project: (value: T) => R): OperatorFunction<T, R> {
  return (source: Observable<T>): Observable<R> => {
    return new Observable<R>(observer => {
      const sourceSubscription = source.subscribe({
        next: (value) => {
          observer.next(project(value));
        },
        error: (err) => {
          observer.error(err);
        },
        complete: () => {
          observer.complete();
        }
      });

      return () => {
        return sourceSubscription.unsubscribe();
      };
    });
  };
}
