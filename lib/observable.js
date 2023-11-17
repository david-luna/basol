import { Subscriber } from './subscriber.js';
import { pipeFromArray } from './utils/pipe.js';

const noop = () => {
  return void 0;
};

export class Observable {
  constructor(subscribeFn) {
    this.subscribers = [];
    this.subscribeFn = subscribeFn;
  }
  pipe(...fns) {
    return pipeFromArray(fns)(this);
  }
  subscribe(observer) {
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
