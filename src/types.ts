import { Observable } from "./observable";

export type TeardownFunction = () => void;

export interface Observer<T> {
    next: (value: T) => void;
    error: (error: any) => void;
    complete: () => void;
}

export interface ObserverNext<T> {
    next: (value: T) => void;
    error?: (error: any) => void;
    complete?: () => void;
}

export interface ObserverError<T> {
    next?: (value: T) => void;
    error: (error: any) => void;
    complete?: () => void;
}

export interface ObserverComplete<T> {
    next?: (value: T) => void;
    error?: (error: any) => void;
    complete: () => void;
}

export type PartialObserver<T> = ObserverNext<T> | ObserverError<T> | ObserverComplete<T>;


export interface SubscribeFunction<T> {
    (observer: Observer<T>): TeardownFunction | void;
}

export interface Subscription {
    unsubscribe(): void;
}

export interface UnaryFunction<T, R> {
    (source: T): R;
}

export type OperatorFunction<T, R> = UnaryFunction<Observable<T>, Observable<R>>;


/**
 * Valid types that can be converted to observables.
 * TODO: add more input types like Iterable<T> | AsyncIterable<T>
 */

export type ObservableInput<T> = Observable<T> | PromiseLike<T> | ArrayLike<T>;
