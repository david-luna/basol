import { createObsevable } from '../observable.js';
import { from } from '../factories/from.js';

/**
 * @template T
 * @template {import('../observable').ObservableInput<any>} R
 * @param {(value: any, index: number) => R} project
 * @returns {import('../observable').OperatorFunction<T, import('../observable').ObservedValueOf<R>>}
 */
export function switchMap(project) {
  return (source) => {
    return createObsevable((observer) => {
      let count = 0;
      let innerSubscription;
      const sourceSubscription = source.subscribe({
        next: (value) => {
          // eslint-disable-next-line no-unused-vars
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
