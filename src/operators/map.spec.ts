import { map } from './map';
import { Observable } from '../observable';
import { Observer } from '../types';

describe('map operator', () => {
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
  const toSquared = map((x: number) => x * x);
  const squaredNumbers = toSquared(sourceNumbers);

  describe('upon emitted value in the source observable', () => {
    test('should emit the mapped values', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaredNumbers.subscribe(spyObserver);

      /* eslint-disable @typescript-eslint/no-magic-numbers */
      nextTrigger(2);
      nextTrigger(3);
      nextTrigger(4);
      /* eslint-enable @typescript-eslint/no-magic-numbers */
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(4);
      expect(spyObserver.next).toHaveBeenCalledWith(9);
      expect(spyObserver.next).toHaveBeenCalledWith(16);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });

  describe('upon error in the source observable', () => {
    test('should error in the mapped observables', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaredNumbers.subscribe(spyObserver);

      nextTrigger(2);
      errorTrigger(new Error('observer error'));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(4);
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
      const subscription = squaredNumbers.subscribe(spyObserver);

      nextTrigger(2);
      completeTrigger();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(4);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });
});
