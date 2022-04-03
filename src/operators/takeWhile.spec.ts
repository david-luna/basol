/* eslint-disable @typescript-eslint/no-magic-numbers */
import { takeWhile } from './takeWhile';
import { newObservableWithSpies, newSpyObserver } from '../__test__';

describe('takeWhile operator', () => {
  const sourceNumbers = newObservableWithSpies<number>();

  // eslint-disable-next-line arrow-body-style
  const lowSquares = takeWhile<number>((value) => Math.pow(value, 2) < 100);
  const squaresBelowhundred = lowSquares(sourceNumbers.observable);

  describe('upon emitted value in the source observable', () => {
    test('should emit values if they pass the predicate', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundred.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.next?.(3);
      sourceNumbers.triggers.next?.(4);
      sourceNumbers.triggers.complete?.();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledWith(2);
      expect(spyObserver.next).toHaveBeenCalledTimes(4);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });

    test('should emit values until the predicate fails', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundred.subscribe(spyObserver);
      const values = [...new Array(10)].map((v, i) => i + 1);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      values.forEach(sourceNumbers.triggers.next!);
      subscription.unsubscribe();

      values
        .filter((v) => v !== 10)
        .forEach((v) => {
          expect(spyObserver.next).toHaveBeenCalledWith(v);
        });
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });

    test('should emit values until the predicate fails including the last one', () => {
      const lowSquaresIncluding = takeWhile<number>((value, index) => Math.pow(value, 2) < 100, true);
      const squaresBelowhundredIncluding = lowSquaresIncluding(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundredIncluding.subscribe(spyObserver);
      const values = [...new Array(10)].map((v, i) => i + 1);

      values.forEach(sourceNumbers.triggers.next!);
      subscription.unsubscribe();

      values.forEach((v) => {
        expect(spyObserver.next).toHaveBeenCalledWith(v);
      });
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });

  describe('upon error in the source observable', () => {
    test('should error if occurs before picking all the values', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundred.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.error?.(new Error('observer error'));
      sourceNumbers.triggers.next?.(2);
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
      const subscription = squaresBelowhundred.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.next?.(3);
      sourceNumbers.triggers.error?.(new Error('observer error'));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledWith(2);
      expect(spyObserver.next).toHaveBeenCalledWith(3);
      expect(spyObserver.next).toHaveBeenCalledTimes(3);
      expect(spyObserver.error).toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });

  describe('upon complete in the source observable', () => {
    test('should complete before emitting any value', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundred.subscribe(spyObserver);

      sourceNumbers.triggers.complete?.();
      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.next?.(2);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledTimes(0);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });

    test('should complete if the source observable completes', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundred.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.complete?.();
      sourceNumbers.triggers.next?.(3);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledTimes(2);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });
});
