/* eslint-disable @typescript-eslint/no-magic-numbers */
import { map } from './map';
import { newObservableWithSpies, newSpyObserver } from '../__test__';

describe('map operator', () => {
  const sourceNumbers = newObservableWithSpies<number>();

  // eslint-disable-next-line arrow-body-style
  const toSquared = map((x: number) => x * x);
  const squaredNumbers = toSquared(sourceNumbers.observable);

  describe('upon emitted value in the source observable', () => {
    test('should emit the mapped values', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaredNumbers.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.next?.(3);
      sourceNumbers.triggers.next?.(4);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(4);
      expect(spyObserver.next).toHaveBeenCalledWith(9);
      expect(spyObserver.next).toHaveBeenCalledWith(16);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });

  describe('upon error in the source observable', () => {
    test('should error in the mapped observables', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaredNumbers.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.error?.(new Error('observer error'));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(4);
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
      const spyObserver = newSpyObserver();
      const subscription = squaredNumbers.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(2);
      sourceNumbers.triggers.complete?.();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(4);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
    });
  });
});
