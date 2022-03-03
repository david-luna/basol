import {
  Observer,
  OperatorFunction,
  PartialObserver,
  SubscribeFunction,
  Subscription,
  TeardownFunction,
} from './types';
import { Subscriber } from './subscriber';
import { pipeFromArray } from './utils/pipe';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pipe(...fns: OperatorFunction<any, any>[]): Observable<any> {
    return pipeFromArray(fns)(this);
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
