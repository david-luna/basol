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
  (observer: Observer<T>): () => void | void;
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

export { createObsevable } from './observable';

export declare class Observable<T> {
  constructor(subscribeFn: SubscribeFunction<T>);

  pipe(): Observable<T>;
  pipe<A>(op1: OperatorFunction<T, A>): Observable<A>;
  pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): Observable<B>;
  pipe<A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): Observable<C>;
  pipe<A, B, C, D>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
  ): Observable<D>;
  pipe<A, B, C, D, E>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
  ): Observable<E>;
  pipe<A, B, C, D, E, F>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
  ): Observable<F>;
  pipe<A, B, C, D, E, F, G>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
  ): Observable<G>;
  pipe<A, B, C, D, E, F, G, H>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>,
  ): Observable<H>;
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>,
    op9: OperatorFunction<H, I>,
  ): Observable<I>;
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>,
    op9: OperatorFunction<H, I>,
    ...operations: OperatorFunction<unknown, unknown>[]
  ): Observable<unknown>;

  subscribe(observer: PartialObserver<T>): Subscription;
}

// factories
export declare function combineLatest<A, B>(a: Observable<A>, b: Observable<B>): Observable<[A, B]>;
export declare function combineLatest<A, B, C>(a: Observable<A>, b: Observable<B>, c: Observable<C>): Observable<[A, B, C]>;
export declare function combineLatest<A, B, C, D>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>): Observable<[A, B, C, D]>;
export declare function combineLatest<A, B, C, D, E>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>, e: Observable<E>): Observable<[A, B, C, D, E]>;
export declare function combineLatest(...observables: Observable<unknown>[]): Observable<unknown[]>;


export declare function concat<A, B>(a: Observable<A>, b: Observable<B>): Observable<A | B>;
export declare function concat<A, B, C>(a: Observable<A>, b: Observable<B>, c: Observable<C>): Observable<A | B | C>;
export declare function concat<A, B, C, D>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>): Observable<A | B | C | D>;
export declare function concat<A, B, C, D, E>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>, e: Observable<E>): Observable<A | B | C | D | E>;

export type { from } from './factories/from';


// NOTE: to mimic browser's CustomEvent
type NodeOrBrowserEvent = Event | Event & { detail: any };
export interface EventTargetLike<T extends NodeOrBrowserEvent> {
  addEventListener(
    type: string,
    listener: ((e: T) => void) | { handleEvent: (e: T) => void } | null,
    options?: any
  ): void;
  removeEventListener(
    type: string,
    listener: ((e: T) => void) | { handleEvent: (e: T) => void } | null,
    options?: any,
  ): void;
}
type EventParam<T> = T extends EventTargetLike<infer E> ? E : never;

export interface EventEmitterLike<T extends (...args: any[]) => void> {
  addListener(
    type: string,
    listener: T,
    options?: any
  ): void;
  removeListener(
    type: string,
    listener: T,
    options?: any,
  ): void;
}

type EventOrParams<T> = T extends EventEmitterLike<infer F> ? Parameters<F> : EventParam<T>;

export declare function fromEvent<T>(target: T, eventName: string): Observable<EventOrParams<T>>;

export { fromEventPattern } from './factories/fromEventPattern';

export { interval } from './factories/interval';

export declare function merge<A, B>(a: Observable<A>, b: Observable<B>): Observable<A | B>;
export declare function merge<A, B, C>(a: Observable<A>, b: Observable<B>, c: Observable<C>): Observable<A | B | C>;
export declare function merge<A, B, C, D>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>): Observable<A | B | C | D>;
export declare function merge<A, B, C, D, E>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>, e: Observable<E>): Observable<A | B | C | D | E>;

export declare function of(...inputs: unknown[]): Observable<unknown>;

export { sequence } from './factories/sequence';

export { timer } from './factories/timer';

// operators

export { filter } from './operators/filter';

export { map } from './operators/map';

export { mergeMap } from './operators/mergeMap';

// TODO: check to move this one
export declare function switchMap<T, R extends ObservableInput<any>>(project: (value: T, index: number) => R): OperatorFunction<T, ObservedValueOf<R>>;

export { take } from './operators/take';

export { takeWhile } from './operators/takeWhile';

export declare function withLatestFrom<T, A, B>(a: Observable<A>, b: Observable<B>): OperatorFunction<T, [T, A, B]>;
export declare function withLatestFrom<T, A, B, C>(a: Observable<A>, b: Observable<B>, c: Observable<C>): OperatorFunction<T, [T, A, B, C]>;
export declare function withLatestFrom<T, A, B, C, D>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>): OperatorFunction<T, [T, A, B, C, D]>;
export declare function withLatestFrom<T, A, B, C, D, E>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>, e: Observable<E>): OperatorFunction<T, [T, A, B, C, D, E]>;
