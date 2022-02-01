import { Observable } from '../observable';
import { ObservableInput, OperatorFunction, ObservedValueOf, Subscription } from '../types';
import { from } from '../factories/from';

/**
 * Returns a function which transforms a source observable to a new one which emits values resulting
 * from the projection param
 *
 * @param project the projection function
 * @returns function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function switchMap<T, R extends ObservableInput<any>>(
  project: (value: T, index: number) => R,
): OperatorFunction<T, ObservedValueOf<R>> {
  return (source: Observable<T>): Observable<ObservedValueOf<R>> => {
    return new Observable<ObservedValueOf<R>>((observer) => {
      let count = 0;
      let innerSubscription: Subscription;

      const sourceSubscription = source.subscribe({
        next: (value) => {
          const { complete, ...partial } = observer;
          if (innerSubscription) {
            innerSubscription.unsubscribe();
          }
          innerSubscription = from(project(value, count++)).subscribe(partial);
        },
        error: (err) => {
          observer.error(err);
        },
        complete: () => {
          observer.complete();
        },
      });

      return () => {
        if (innerSubscription) {
          innerSubscription.unsubscribe();
        }
        return sourceSubscription.unsubscribe();
      };
    });
  };
}
