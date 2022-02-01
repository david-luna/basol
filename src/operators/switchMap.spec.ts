import { switchMap } from './switchMap';
import { of } from '../factories/of';
import { Observable } from '../observable';
import { Observer } from '../types';

describe('switchMap operator', () => {
  let nextTrigger: (num: number) => void;
  let errorTrigger: (err: unknown) => void;
  let completeTrigger: () => void;
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const flushPromises = () => new Promise((r) => setTimeout(r, 100));
  const tearDownSpy = jest.fn();
  const sourceNumbers = new Observable<number>((observer: Observer<number>) => {
    nextTrigger = (num: number) => {
      return observer.next(num);
    };
    errorTrigger = (err: unknown) => {
      return observer.error(err);
    };
    completeTrigger = () => {
      return observer.complete();
    };

    return tearDownSpy;
  });
  const newSpyObserver = () => {
    return {
      next: jest.fn(),
      error: jest.fn(),
      complete: jest.fn(),
    };
  };

  describe('upon emitted value in the source observable', () => {
    test('should emit mapped values with a single function', () => {
      const toArray = switchMap((x: number) => new Array(x).fill(x));
      const arrayObservable = toArray(sourceNumbers);
      const spyObserver = newSpyObserver();
      const subscription = arrayObservable.subscribe(spyObserver);

      /* eslint-disable @typescript-eslint/no-magic-numbers */
      nextTrigger(2);
      nextTrigger(3);
      nextTrigger(4);
      subscription.unsubscribe();

      // 1st array
      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 2);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 2);
      // 2nd array
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserver.next).toHaveBeenNthCalledWith(4, 3);
      expect(spyObserver.next).toHaveBeenNthCalledWith(5, 3);
      // 3rd array
      expect(spyObserver.next).toHaveBeenNthCalledWith(6, 4);
      expect(spyObserver.next).toHaveBeenNthCalledWith(7, 4);
      expect(spyObserver.next).toHaveBeenNthCalledWith(8, 4);
      expect(spyObserver.next).toHaveBeenNthCalledWith(9, 4);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
      /* eslint-enable @typescript-eslint/no-magic-numbers */
    });
    test('should emit the mapped values with an observer projection', () => {
      // eslint-disable-next-line arrow-body-style
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const toObservable = switchMap((x: number) => of(x, x ** 2, x ** 3));
      const observableObservable = toObservable(sourceNumbers);
      const spyObserver = newSpyObserver();
      const subscription = observableObservable.subscribe(spyObserver);

      /* eslint-disable @typescript-eslint/no-magic-numbers */
      nextTrigger(2);
      nextTrigger(3);
      nextTrigger(4);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 2);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 4);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 8);
      expect(spyObserver.next).toHaveBeenNthCalledWith(4, 3);
      expect(spyObserver.next).toHaveBeenNthCalledWith(5, 9);
      expect(spyObserver.next).toHaveBeenNthCalledWith(6, 27);
      expect(spyObserver.next).toHaveBeenNthCalledWith(7, 4);
      expect(spyObserver.next).toHaveBeenNthCalledWith(8, 16);
      expect(spyObserver.next).toHaveBeenNthCalledWith(9, 64);
      expect(spyObserver.next).toHaveBeenCalledTimes(9);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
      /* eslint-enable @typescript-eslint/no-magic-numbers */
    });

    test('should emit the mapped values with a promise projection', async () => {
      // eslint-disable-next-line arrow-body-style
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const toPromise = switchMap((x: number) => Promise.resolve(x * x));
      const promiseObservable = toPromise(sourceNumbers);
      const spyObserver = newSpyObserver();
      const subscription = promiseObservable.subscribe(spyObserver);

      /* eslint-disable @typescript-eslint/no-magic-numbers */
      nextTrigger(2);
      await flushPromises();
      nextTrigger(3);
      await flushPromises();
      nextTrigger(4);
      await flushPromises();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 4);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 9);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 16);
      expect(spyObserver.next).toHaveBeenCalledTimes(3);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
      /* eslint-enable @typescript-eslint/no-magic-numbers */
    });

    test('should cancel the async value if source emits before', async () => {
      // eslint-disable-next-line arrow-body-style
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const toPromise = switchMap((x: number) => Promise.resolve(x * x));
      const promiseObservable = toPromise(sourceNumbers);
      const spyObserver = newSpyObserver();
      const subscription = promiseObservable.subscribe(spyObserver);

      /* eslint-disable @typescript-eslint/no-magic-numbers */
      nextTrigger(2);
      nextTrigger(3);
      nextTrigger(4);
      await flushPromises();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 16);
      expect(spyObserver.next).toHaveBeenCalledTimes(1);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
      /* eslint-enable @typescript-eslint/no-magic-numbers */
    });
  });

  describe('upon error in the source observable', () => {
    test('should error in the mapped observables', () => {
      // eslint-disable-next-line arrow-body-style
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const toIdentity = switchMap((x: number) => [x]);
      const identityObserver = toIdentity(sourceNumbers);
      const spyObserver = newSpyObserver();
      const subscription = identityObserver.subscribe(spyObserver);

      nextTrigger(2);
      errorTrigger(new Error('observer error'));
      subscription.unsubscribe();

      /* eslint-disable @typescript-eslint/no-magic-numbers */
      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 2);
      /* eslint-enable @typescript-eslint/no-magic-numbers */
      expect(spyObserver.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'observer error',
        }),
      );
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });

  describe('upon complete in the source observable', () => {
    test('should complete in the mapped observables', () => {
      const toIdentity = switchMap((x: number) => [x]);
      const identityObserver = toIdentity(sourceNumbers);
      const spyObserver = newSpyObserver();
      const subscription = identityObserver.subscribe(spyObserver);

      nextTrigger(2);
      completeTrigger();
      subscription.unsubscribe();

      /* eslint-disable @typescript-eslint/no-magic-numbers */
      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 2);
      /* eslint-enable @typescript-eslint/no-magic-numbers */
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });
});
