import { createObsevable } from '../observable.js';

// TODO: figure out how to type this function accepting a variable
// num of type parameters
export function merge(...observables) {
  return createObsevable((observer) => {
    const innerSubscriptions = [];
    let completedSubscriptions = 0;
    const innerObserver = {
      next: (value) => {
        observer.next(value);
      },
      error: (err) => {
        observer.error(err);
      },
      complete: () => {
        completedSubscriptions++;
        if (completedSubscriptions === innerSubscriptions.length) {
          observer.complete();
        }
      },
    };
    observables.forEach((observable) => {
      innerSubscriptions.push(observable.subscribe(innerObserver));
    });
    return () => {
      innerSubscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    };
  });
}
