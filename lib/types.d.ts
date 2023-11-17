import { Observable } from './observable';
export declare type TeardownFunction = () => void;
export interface Observer<T> {
    next: (value: T) => void;
    error: (error: unknown) => void;
    complete: () => void;
}
export interface ObserverNext<T> {
    next: (value: T) => void;
    error?: (error: unknown) => void;
    complete?: () => void;
}
export interface ObserverError<T> {
    next?: (value: T) => void;
    error: (error: unknown) => void;
    complete?: () => void;
}
export interface ObserverComplete<T> {
    next?: (value: T) => void;
    error?: (error: unknown) => void;
    complete: () => void;
}
export declare type PartialObserver<T> = ObserverNext<T> | ObserverError<T> | ObserverComplete<T>;
export interface SubscribeFunction<T> {
    (observer: Observer<T>): TeardownFunction | void;
}
export interface Subscription {
    unsubscribe(): void;
}
export interface UnaryFunction<T, R> {
    (source: T): R;
}
export declare type OperatorFunction<T, R> = UnaryFunction<Observable<T>, Observable<R>>;
export declare type ObservableInput<T> = Observable<T> | PromiseLike<T> | ArrayLike<T>;
export declare type ObservedValueOf<O> = O extends ObservableInput<infer T> ? T : never;
//# sourceMappingURL=types.d.ts.map