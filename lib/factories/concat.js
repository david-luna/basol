import { Observable } from '../observable.js';
export function concat(...observables) {
    return new Observable((observer) => {
        const innerObserver = {
            next: (value) => {
                observer.next(value);
            },
            error: (err) => {
                observer.error(err);
            },
            complete: () => {
                activeSubscription.unsubscribe();
                observables.shift();
                if (observables.length === 0) {
                    observer.complete();
                }
                else {
                    activeSubscription = observables[0].subscribe(innerObserver);
                }
            },
        };
        let activeSubscription = observables[0].subscribe(innerObserver);
        return () => {
            activeSubscription.unsubscribe();
        };
    });
}
//# sourceMappingURL=concat.js.map