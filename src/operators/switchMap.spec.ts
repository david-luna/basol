import { switchMap } from './switchMap';
import { of } from '../factories/of';
import { Observable } from '../observable';
import { Observer } from '../types';

describe('switchMap operator', () => {
  let nextTrigger: (num: number) => void;
  let errorTrigger: (err: unknown) => void;
  let completeTrigger: () => void;
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
  // eslint-disable-next-line arrow-body-style
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const toSquareAndCube = switchMap((x: number) => of(x, x ** 2, x ** 3));
  const squaredAndCubedNumbers = toSquareAndCube(sourceNumbers);

  describe('upon emitted value in the source observable', () => {
    test('should emit the mapped values', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaredAndCubedNumbers.subscribe(spyObserver);

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
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
      /* eslint-enable @typescript-eslint/no-magic-numbers */
    });
  });

  describe('upon error in the source observable', () => {
    test('should error in the mapped observables', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaredAndCubedNumbers.subscribe(spyObserver);

      nextTrigger(2);
      errorTrigger(new Error('observer error'));
      subscription.unsubscribe();

      /* eslint-disable @typescript-eslint/no-magic-numbers */
      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 2);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 4);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 8);
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
      const spyObserver = newSpyObserver();
      const subscription = squaredAndCubedNumbers.subscribe(spyObserver);

      nextTrigger(2);
      completeTrigger();
      subscription.unsubscribe();

      /* eslint-disable @typescript-eslint/no-magic-numbers */
      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 2);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 4);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 8);
      /* eslint-enable @typescript-eslint/no-magic-numbers */
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });
});
