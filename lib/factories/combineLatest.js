import { Observable } from '../observable.js';
export function combineLatest(...observables) {
  return new Observable((observer) => {
    const slots = [];
    let completedSubscriptions = 0;
    const indexedObserver = (index) => ({
      next: (value) => {
        slots[index].value = value;
        if (slots.every((s) => s.hasOwnProperty('value'))) {
          observer.next(slots.map((s) => s.value));
        }
      },
      error: (err) => {
        observer.error(err);
      },
      complete: () => {
        completedSubscriptions++;
        if (completedSubscriptions === slots.length) {
          observer.complete();
        }
      },
    });
    observables.forEach((observable, index) => {
      slots.push({ subscription: observable.subscribe(indexedObserver(index)) });
    });
    return () => {
      slots.forEach((slot) => {
        slot.subscription.unsubscribe();
      });
    };
  });
}
//# sourceMappingURL=combineLatest.js.map
