import { Observable } from '../observable';
import { Observer } from '../types';
import { newSpyObserver } from '../__test__';
import { take } from './take';

describe('take operator', () => {
  let nextTrigger: (num: number) => void;
  let errorTrigger: (err: any) => void;
  let completeTrigger: () => void;
  const tearDownSpy = jest.fn();
  const sourceNumbers = new Observable<number>((observer: Observer<number>) => {
    nextTrigger = (num: number) => {
      return observer.next(num);
    };
    errorTrigger = (err: any) => {
      return observer.error(err);
    };
    completeTrigger = () => {
      return observer.complete();
    };

    return tearDownSpy;
  });

  // eslint-disable-next-line arrow-body-style
  const takeTwo = take<number>(2);
  const firstAndSecond = takeTwo(sourceNumbers);

  describe('upon emitted value in the source observable', () => {
    test('should emit as many values as specified', () => {
      const spyObserver = newSpyObserver();
      const subscription = firstAndSecond.subscribe(spyObserver);

      nextTrigger(1);
      nextTrigger(2);
      nextTrigger(3);
      nextTrigger(4);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledWith(2);
      expect(spyObserver.next).toHaveBeenCalledTimes(2);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });

  describe('upon error in the source observable', () => {
    test('should error if occurs before picking all the values', () => {
      const spyObserver = newSpyObserver();
      const subscription = firstAndSecond.subscribe(spyObserver);

      nextTrigger(1);
      errorTrigger(new Error('observer error'));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledTimes(1);
      expect(spyObserver.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'observer error',
        }),
      );
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });

    test('should complete if occurs after picking all the values', () => {
      const spyObserver = newSpyObserver();
      const subscription = firstAndSecond.subscribe(spyObserver);

      nextTrigger(1);
      nextTrigger(2);
      nextTrigger(3);
      errorTrigger(new Error('observer error'));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledWith(2);
      expect(spyObserver.next).toHaveBeenCalledTimes(2);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });

  describe('upon complete in the source observable', () => {
    test('should complete before emitting all values', () => {
      const spyObserver = newSpyObserver();
      const subscription = firstAndSecond.subscribe(spyObserver);

      nextTrigger(1);
      completeTrigger();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledTimes(1);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });
});
