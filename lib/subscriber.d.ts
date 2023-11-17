import { Observer } from './types';
declare type TeardownFn<T> = (s: Subscriber<T>) => void;
export declare class Subscriber<T> {
    private readonly teardown;
    private readonly observer;
    private stopped;
    constructor(observer: Partial<Observer<T>>, teardown: TeardownFn<T>);
    next(value: T): void;
    error(error: unknown): void;
    complete(): void;
    unsubscribe(): void;
}
export {};
//# sourceMappingURL=subscriber.d.ts.map