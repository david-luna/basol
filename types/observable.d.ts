/**
 * @template T
 * @param {SubscribeFunction<T>} subscribeFn
 * @returns {Observable<T>}
 */
export function createObsevable<T>(subscribeFn: SubscribeFunction<T>): Observable<T>;
/**
 * @template T
 */
export class Observable<T> {
    constructor(subscribeFn: any);
    /** @type {Observer<T>[]} */
    subscribers: Observer<T>[];
    /** @type {SubscribeFunction<T>} */
    subscribeFn: SubscribeFunction<T>;
    /**
     * @overload
     * @returns {Observable<T>}
     */
    pipe(): Observable<T>;
    /**
     * @template A
     * @overload
     * @param {UnaryFunction<Observable<T>,A>} fn1
     */
    pipe<A>(fn1: UnaryFunction<Observable<T>, A>): any;
    /**
     * @template A,B
     * @overload
     * @param {UnaryFunction<Observable<T>,A>} fn1
     * @param {UnaryFunction<A,B>} fn2
     * @returns {B}
     */
    pipe<A, B>(fn1: UnaryFunction<Observable<T>, A>, fn2: UnaryFunction<A, B>): B;
    /**
     * @template A,B,C
     * @overload
     * @param {UnaryFunction<Observable<T>,A>} fn1
     * @param {UnaryFunction<A,B>} fn2
     * @param {UnaryFunction<B,C>} fn3
     * @returns {C}
     */
    pipe<A, B, C>(fn1: UnaryFunction<Observable<T>, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>): C;
    /**
     * @template A,B,C,D
     * @overload
     * @param {UnaryFunction<Observable<T>,A>} fn1
     * @param {UnaryFunction<A,B>} fn2
     * @param {UnaryFunction<B,C>} fn3
     * @param {UnaryFunction<C,D>} fn4
     * @returns {D}
     */
    pipe<A, B, C, D>(fn1: UnaryFunction<Observable<T>, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>): D;
    /**
     * @template A,B,C,D,E
     * @overload
     * @param {UnaryFunction<Observable<T>,A>} fn1
     * @param {UnaryFunction<A,B>} fn2
     * @param {UnaryFunction<B,C>} fn3
     * @param {UnaryFunction<C,D>} fn4
     * @param {UnaryFunction<D,E>} fn5
     * @returns {E}
     */
    pipe<A, B, C, D, E>(fn1: UnaryFunction<Observable<T>, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>): E;
    /**
     * @template A,B,C,D,E,F
     * @overload
     * @param {UnaryFunction<Observable<T>,A>} fn1
     * @param {UnaryFunction<A,B>} fn2
     * @param {UnaryFunction<B,C>} fn3
     * @param {UnaryFunction<C,D>} fn4
     * @param {UnaryFunction<D,E>} fn5
     * @param {UnaryFunction<E,F>} fn6
     * @returns {F}
     */
    pipe<A, B, C, D, E, F>(fn1: UnaryFunction<Observable<T>, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>): F;
    /**
     * @template A,B,C,D,E,F,G
     * @overload
     * @param {UnaryFunction<Observable<T>,A>} fn1
     * @param {UnaryFunction<A,B>} fn2
     * @param {UnaryFunction<B,C>} fn3
     * @param {UnaryFunction<C,D>} fn4
     * @param {UnaryFunction<D,E>} fn5
     * @param {UnaryFunction<E,F>} fn6
     * @param {UnaryFunction<F,G>} fn7
     * @returns {G}
     */
    pipe<A, B, C, D, E, F, G>(fn1: UnaryFunction<Observable<T>, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>): G;
    /**
     * @template A,B,C,D,E,F,G,H
     * @overload
     * @param {UnaryFunction<Observable<T>,A>} fn1
     * @param {UnaryFunction<A,B>} fn2
     * @param {UnaryFunction<B,C>} fn3
     * @param {UnaryFunction<C,D>} fn4
     * @param {UnaryFunction<D,E>} fn5
     * @param {UnaryFunction<E,F>} fn6
     * @param {UnaryFunction<F,G>} fn7
     * @param {UnaryFunction<G,H>} fn8
     * @returns {H}
     */
    pipe<A, B, C, D, E, F, G, H>(fn1: UnaryFunction<Observable<T>, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>, fn8: UnaryFunction<G, H>): H;
    /**
     * @template A,B,C,D,E,F,G,H
     * @overload
     * @param {UnaryFunction<Observable<T>,A>} fn1
     * @param {UnaryFunction<A,B>} fn2
     * @param {UnaryFunction<B,C>} fn3
     * @param {UnaryFunction<C,D>} fn4
     * @param {UnaryFunction<D,E>} fn5
     * @param {UnaryFunction<E,F>} fn6
     * @param {UnaryFunction<F,G>} fn7
     * @param {UnaryFunction<G,H>} fn8
     * @param {...((...args: any[])=> any)} fnRest
     * @returns {Observable<unknown>}
     */
    pipe<A, B, C, D, E, F, G, H>(fn1: UnaryFunction<Observable<T>, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>, fn8: UnaryFunction<G, H>, ...fnRest: ((...args: any[]) => any)[]): Observable<unknown>;
    /**
     * @param {PartialObserver<T>} observer
     * @returns {Subscription}
     */
    subscribe(observer: PartialObserver<T>): Subscription;
    teardownFn: () => void;
}
/**
 * <T>
 */
export type Observer<T> = {
    next: (value: T) => void;
    error: (error: unknown) => void;
    complete: () => void;
};
/**
 * <T>
 */
export type ObserverNext<T> = {
    next: (value: T) => void;
    error?: (error: unknown) => void;
    complete?: () => void;
};
/**
 * <T>
 */
export type ObserverError<T> = {
    next?: (value: T) => void;
    error: (error: unknown) => void;
    complete?: () => void;
};
/**
 * <T>
 */
export type ObserverComplete<T> = {
    next?: (value: T) => void;
    error?: (error: unknown) => void;
    complete: () => void;
};
/**
 * <T>
 */
export type PartialObserver<T> = ObserverNext<T> | ObserverError<T> | ObserverComplete<T>;
/**
 * <T>
 */
export type SubscribeFunction<T> = (observer: Observer<T>) => void | (() => void);
export type Subscription = {
    unsubscribe: () => void;
};
/**
 * <T,R>
 */
export type UnaryFunction<T, R> = import('./utils/pipe').UnaryFunction<T, R>;
/**
 * <T,R>
 */
export type OperatorFunction<T, R> = (source: Observable<T>) => Observable<R>;
/**
 * <T>
 */
export type ObservableInput<T> = Observable<T> | PromiseLike<T> | ArrayLike<T>;
/**
 * <O>
 */
export type ObservedValueOf<O> = O extends ObservableInput<infer T> ? T : never;
