import { Observer, PartialObserver, SubscribeFunction, Subscription, TeardownFunction } from './types';
import { Subscriber } from './subscriber';

const noop = (): void => {
  return void 0;
};

export class Observable<T> {
  private readonly subscribers: Observer<T>[] = [];
  private readonly subscribeFn: SubscribeFunction<T>;
  private teardownFn!: TeardownFunction;

  constructor(subscribeFn: SubscribeFunction<T>) {
    this.subscribeFn = subscribeFn;
  }

  subscribe(observer: PartialObserver<T>): Subscription {
    const subscription = new Subscriber(observer, (unsubscribed) => {
      const deleteIndex = this.subscribers.indexOf(unsubscribed);

      this.subscribers.splice(deleteIndex, 1);

      if (this.subscribers.length === 0) {
        this.teardownFn();
      }
    });

    this.subscribers.push(subscription);

    // do the subscription
    if (this.subscribers.length === 1) {
      this.teardownFn =
        this.subscribeFn({
          next: (value: T) => {
            this.subscribers.forEach((current) => {
              current.next(value);
            });
          },
          error: (err: any) => {
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
