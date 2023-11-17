import { Observable } from '../observable.js';
export function withLatestFrom(...inputs) {
    return (source) => {
        const slots = inputs.map((input, index) => {
            const subscription = input.subscribe({
                next: (value) => (slots[index].value = value),
                error: (error) => (slots[index].error = error),
            });
            return { subscription };
        });
        return new Observable((observer) => {
            const subscription = source.subscribe({
                next: (value) => {
                    const slotWithError = slots.find((s) => s.hasOwnProperty('error'));
                    if (slotWithError) {
                        observer.error(slotWithError.error);
                    }
                    if (slots.every((s) => s.hasOwnProperty('value'))) {
                        observer.next([value, ...slots.map((s) => s.value)]);
                    }
                },
                error: (error) => observer.error(error),
                complete: () => observer.complete(),
            });
            return () => {
                slots.forEach((slot) => slot.subscription.unsubscribe());
                subscription.unsubscribe();
            };
        });
    };
}
//# sourceMappingURL=withLatestFrom.js.map