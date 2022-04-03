/* eslint-disable @typescript-eslint/no-magic-numbers */
import { switchMap } from './switchMap';
import { of } from '../factories/of';
import { Observable } from '../observable';
import { newObservableWithSpies, newSpyObserver } from '../__test__';

describe('switchMap operator', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const flushPromises = () => new Promise((r) => setTimeout(r, 100));
  const sourceNumbers = newObservableWithSpies<number>();

  describe('upon emitted value in the source observable', () => {
    test('should emit mapped values with a single function', () => {
      const toArray = switchMap((x: number) => new Array(x).fill(x));
      const arrayObservable = toArray(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      const subscription = arrayObservable.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.next?.(3);
      sourceNumbers.triggers.next?.(4);
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
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
    test('should emit the mapped values with an observer projection', () => {
      // eslint-disable-next-line arrow-body-style
      const toObservable = switchMap((x: number) => of(x, x ** 2, x ** 3));
      const observableObservable = toObservable(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      const subscription = observableObservable.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.next?.(3);
      sourceNumbers.triggers.next?.(4);
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
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });

    test('should emit the mapped values with a promise projection', async () => {
      // eslint-disable-next-line arrow-body-style
      const toPromise = switchMap((x: number) => Promise.resolve(x * x));
      const promiseObservable = toPromise(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      const subscription = promiseObservable.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      await flushPromises();
      sourceNumbers.triggers.next?.(3);
      await flushPromises();
      sourceNumbers.triggers.next?.(4);
      await flushPromises();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 4);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 9);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 16);
      expect(spyObserver.next).toHaveBeenCalledTimes(3);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });

    test('should cancel the async value if source emits before', async () => {
      // eslint-disable-next-line arrow-body-style
      const toPromise = switchMap((x: number) => Promise.resolve(x * x));
      const promiseObservable = toPromise(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      const subscription = promiseObservable.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.next?.(3);
      sourceNumbers.triggers.next?.(4);
      await flushPromises();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 16);
      expect(spyObserver.next).toHaveBeenCalledTimes(1);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });

    test('should unsubscribe inner observable and crate a new one when source emits', () => {
      jest.useFakeTimers();
      const setIntervalSpy = jest.spyOn(global, 'setInterval');
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      // eslint-disable-next-line arrow-body-style
      const toInterval = switchMap(
        (x: number) =>
          new Observable((observer) => {
            const signal = setInterval(() => observer.next(x * 1000), 10);
            return () => clearInterval(signal);
          }),
      );
      const intervalObservable = toInterval(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      const subscription = intervalObservable.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      jest.advanceTimersByTime(20);
      expect(setIntervalSpy).toHaveBeenCalledTimes(1);
      expect(clearIntervalSpy).not.toHaveBeenCalled();
      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 2000);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 2000);
      expect(spyObserver.next).toHaveBeenCalledTimes(2);
      // Emit new value should cancel theprevious interval
      sourceNumbers.triggers.next?.(3);
      jest.advanceTimersByTime(20);
      expect(setIntervalSpy).toHaveBeenCalledTimes(2);
      expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 3000);
      expect(spyObserver.next).toHaveBeenNthCalledWith(4, 3000);
      expect(spyObserver.next).toHaveBeenCalledTimes(4);
      // Emit again and check
      sourceNumbers.triggers.next?.(4);
      jest.advanceTimersByTime(20);
      expect(setIntervalSpy).toHaveBeenCalledTimes(3);
      expect(clearIntervalSpy).toHaveBeenCalledTimes(2);
      expect(spyObserver.next).toHaveBeenNthCalledWith(5, 4000);
      expect(spyObserver.next).toHaveBeenNthCalledWith(6, 4000);
      expect(spyObserver.next).toHaveBeenCalledTimes(6);
      subscription.unsubscribe();

      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(clearIntervalSpy).toHaveBeenCalledTimes(3);
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });

  describe('upon error in the source observable', () => {
    test('should error in the mapped observables', () => {
      // eslint-disable-next-line arrow-body-style
      const toIdentity = switchMap((x: number) => [x]);
      const identityObserver = toIdentity(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      const subscription = identityObserver.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.error?.(new Error('observer error'));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 2);
      expect(spyObserver.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'observer error',
        }),
      );
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });

  describe('upon complete in the source observable', () => {
    test('should complete in the mapped observables', () => {
      const toIdentity = switchMap((x: number) => [x]);
      const identityObserver = toIdentity(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      const subscription = identityObserver.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.complete?.();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 2);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });
});
