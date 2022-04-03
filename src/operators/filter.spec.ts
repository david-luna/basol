/* eslint-disable @typescript-eslint/no-magic-numbers */
import { filter } from './filter';
import { newObservableWithSpies, newSpyObserver } from '../__test__';

describe('filter operator', () => {
  const sourceNumbers = newObservableWithSpies<number>();

  // eslint-disable-next-line arrow-body-style
  const toEven = filter((x: number) => x % 2 === 0);
  const evenNumbers = toEven(sourceNumbers.observable);

  describe('upon emitted value in the source observable', () => {
    test('should emit the filtered values', () => {
      const spyObserver = newSpyObserver();
      const subscription = evenNumbers.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.next?.(3);
      sourceNumbers.triggers.next?.(4);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(2);
      expect(spyObserver.next).toHaveBeenCalledWith(4);
      expect(spyObserver.next).toHaveBeenCalledTimes(2);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });

  describe('upon error in the source observable', () => {
    test('should error in the filtered observables', () => {
      const spyObserver = newSpyObserver();
      const subscription = evenNumbers.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.error?.(new Error('observer error'));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(2);
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
    test('should complete in the filtered observables', () => {
      const spyObserver = newSpyObserver();
      const subscription = evenNumbers.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.complete?.();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(2);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });
});
