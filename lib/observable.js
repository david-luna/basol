import { Subscriber } from './subscriber.js';
import { pipeFromArray } from './utils/pipe.js';

/** @type {() => void} */
const noop = () => {
  return void 0;
};

/**
 * @template T
 * @param {import('./types').SubscribeFunction<T>} subscribeFn
 * @returns {import('./types').Observable<T>}
 */
export function createObsevable(subscribeFn) {
  return new Observable(subscribeFn);
}

/**
 * @template T
 */
export class Observable {
  constructor(subscribeFn) {
    /** @type {import('./types').Observer<T>[]} */
    this.subscribers = [];
    /** @type {import('./types').SubscribeFunction<T>} */
    this.subscribeFn = subscribeFn;
  }

  pipe(...fns) {
    return pipeFromArray(fns)(this);
  }

  /**
   * @param {import('./types').Observer<T>} observer
   * @returns {import('./types').Subscription}
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
