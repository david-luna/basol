/**
 * @template T
 */
export class Subscriber<T> {
    /**
     * @param {import('./observable').PartialObserver<T>} observer
     * @param {(s: Subscriber<T>) => void} teardown
     */
    constructor(observer: import('./observable').PartialObserver<T>, teardown: (s: Subscriber<T>) => void);
    stopped: boolean;
    teardown: (s: Subscriber<T>) => void;
    observer: {
        next: any;
        error: any;
        complete: any;
    };
    /**
     * @param {T} value
     */
    next(value: T): void;
    /**
     * @param {unknown} error
     */
    error(error: unknown): void;
    complete(): void;
    unsubscribe(): void;
}
