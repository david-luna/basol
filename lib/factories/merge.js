import { Observable } from '../observable.js';
export function merge(...observables) {
  return new Observable((observer) => {
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
//# sourceMappingURL=merge.js.map
