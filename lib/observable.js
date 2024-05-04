import { Subscriber } from './subscriber.js';
import { pipeFromArray } from './utils/pipe.js';

/**
 * @template T
 * @typedef {Object} Observer<T>
 * @property {(value: T) => void} next
 * @property {(error: unknown) => void} error
 * @property {() => void} complete
 */
/**
 * @template T
 * @typedef {Object} ObserverNext<T>
 * @property {(value: T) => void} next
 * @property {(error: unknown) => void} [error]
 * @property {() => void} [complete]
 */
/**
 * @template T
 * @typedef {Object} ObserverError<T>
 * @property {(value: T) => void} [next]
 * @property {(error: unknown) => void} error
 * @property {() => void} [complete]
 */
/**
 * @template T
 * @typedef {Object} ObserverComplete<T>
 * @property {(value: T) => void} [next]
 * @property {(error: unknown) => void} [error]
 * @property {() => void} complete
 */
/**
 * @template T
 * @typedef {ObserverNext<T> | ObserverError<T> | ObserverComplete<T>} PartialObserver<T>
 */
/**
 * @template T
 * @callback SubscribeFunction<T>
 * @param {Observer<T>} observer
 * @returns {void | (() => void)}
 */
/**
 * @typedef {Object} Subscription
 * @property {() => void} unsubscribe
 */
/**
 * @template T,R
 * @typedef {import('./utils/pipe').UnaryFunction<T,R>} UnaryFunction<T,R>
 */
/**
 * @template T,R
 * @callback OperatorFunction<T,R>
 * @param {Observable<T>} source
 * @returns {Observable<R>}
 */
/**
 * @template T
 * @typedef {Observable<T> | PromiseLike<T> | ArrayLike<T>} ObservableInput<T>
 */
/**
 * @template O
 * @typedef {O extends ObservableInput<infer T> ? T : never} ObservedValueOf<O>
 */

/** @type {() => void} */
const noop = () => {
  return void 0;
};

/**
 * @template T
 * @param {SubscribeFunction<T>} subscribeFn
 * @returns {Observable<T>}
 */
export function createObsevable(subscribeFn) {
  return new Observable(subscribeFn);
}

/**
 * @template T
 */
export class Observable {
  constructor(subscribeFn) {
    /** @type {Observer<T>[]} */
    this.subscribers = [];
    /** @type {SubscribeFunction<T>} */
    this.subscribeFn = subscribeFn;
  }

  /**
   * @overload
   * @returns {Observable<T>}
   */
  /**
   * @template A
   * @overload
   * @param {UnaryFunction<Observable<T>,A>} fn1
   */
  /**
   * @template A,B
   * @overload
   * @param {UnaryFunction<Observable<T>,A>} fn1
   * @param {UnaryFunction<A,B>} fn2
   * @returns {B}
   */
  /**
   * @template A,B,C
   * @overload
   * @param {UnaryFunction<Observable<T>,A>} fn1
   * @param {UnaryFunction<A,B>} fn2
   * @param {UnaryFunction<B,C>} fn3
   * @returns {C}
   */
  /**
   * @template A,B,C,D
   * @overload
   * @param {UnaryFunction<Observable<T>,A>} fn1
   * @param {UnaryFunction<A,B>} fn2
   * @param {UnaryFunction<B,C>} fn3
   * @param {UnaryFunction<C,D>} fn4
   * @returns {D}
   */
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
  pipe(...fns) {
    return pipeFromArray(fns)(this);
  }

  /**
   * @param {PartialObserver<T>} observer
   * @returns {Subscription}
   */
  subscribe(observer) {
    /** @type {Subscriber<T>} */
    const subscription = new Subscriber(observer, (unsubscribed) => {
      const deleteIndex = this.subscribers.indexOf(unsubscribed);

      this.subscribers.splice(deleteIndex, 1);
      if (this.subscribers.length === 0) {
        this.teardownFn();
      }
    });

    this.subscribers.push(subscription);
    if (this.subscribers.length === 1) {
      this.teardownFn =
        this.subscribeFn({
          next: (value) => {
            this.subscribers.forEach((current) => {
              current.next(value);
            });
          },
          error: (err) => {
            this.subscribers.forEach((current) => {
              current.error(err);
            });
          },
          complete: () => {
            this.subscribers.forEach((current) => {
              current.complete();
            });
          },
        }) || noop;
    }
    return {
      unsubscribe: () => {
        subscription.unsubscribe();
      },
    };
  }
}
