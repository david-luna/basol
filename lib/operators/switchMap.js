import { createObsevable } from '../observable.js';
import { from } from '../factories/from.js';

/**
 * @param {(value: any, index: number) => any} project
 * @returns {import('../types').OperatorFunction<any, any>}
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
