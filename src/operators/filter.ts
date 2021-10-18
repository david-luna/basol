import { Observable } from "../observable";
import { OperatorFunction } from "../types";

/**
 * Returns a function which transforms a source observable to a new one which emits values only if
 * they pass the check function
 *
 * @param check the check function
 * @returns function
 */
export function filter<T>(check: (value: T) => boolean): OperatorFunction<T, T> {
    return (source: Observable<T>): Observable<T> => {
        return new Observable<T>(observer => {
            const sourceSubscription = source.subscribe({
                next: (value) => {
                    if (check(value)) {
                        observer.next(value);
                    }
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
