/* eslint-disable @typescript-eslint/no-magic-numbers */
import { newObservableWithSpies, newSpyObserver } from '../__test__';
import { take } from './take';

describe('take operator', () => {
  const sourceNumbers = newObservableWithSpies<number>();

  // eslint-disable-next-line arrow-body-style
  const takeTwo = take<number>(2);
  const firstAndSecond = takeTwo(sourceNumbers.observable);

  describe('upon emitted value in the source observable', () => {
    test('should emit as many values as specified', () => {
      const spyObserver = newSpyObserver();
      const subscription = firstAndSecond.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.next?.(3);
      sourceNumbers.triggers.next?.(4);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledWith(2);
      expect(spyObserver.next).toHaveBeenCalledTimes(2);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });

  describe('upon error in the source observable', () => {
    test('should error if occurs before picking all the values', () => {
      const spyObserver = newSpyObserver();
      const subscription = firstAndSecond.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.error?.(new Error('observer error'));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledTimes(1);
      expect(spyObserver.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'observer error',
        }),
      );
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });

    test('should complete if occurs after picking all the values', () => {
      const spyObserver = newSpyObserver();
      const subscription = firstAndSecond.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.next?.(3);
      sourceNumbers.triggers.error?.(new Error('observer error'));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledWith(2);
      expect(spyObserver.next).toHaveBeenCalledTimes(2);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });

  describe('upon complete in the source observable', () => {
    test('should complete before emitting all values', () => {
      const spyObserver = newSpyObserver();
      const subscription = firstAndSecond.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.complete?.();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledTimes(1);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });
});
