import { Subscriber } from "./subscriber";

describe("Subscriber", () => {
  let subscription: Subscriber<number>;
  const spyObserver = {
    next: jest.fn(),
    error: jest.fn(),
    complete: jest.fn()
  };
  const tearDownSpy = jest.fn();

  beforeEach(() => {
    subscription = new Subscriber<number>(spyObserver, tearDownSpy);
  });

  describe("upon call to next", () => {
    test("should emit the value to the inner observer", () => {
      subscription.next(1);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });

    test("should allow to emit more than one value", () => {
      subscription.next(1);
      subscription.next(2);
      subscription.next(3);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });


  describe("upon call to error", () => {
    test("should not emit a value or complete", () => {
      subscription.next(1);
      subscription.next(2);
      subscription.next(3);
      subscription.error(new Error("observer error"));
      subscription.next(4);
      subscription.complete();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserver.next).toHaveBeenCalledTimes(3);
      expect(spyObserver.error).toHaveBeenCalledWith(expect.objectContaining({
        message: "observer error"
      }));
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });

  describe("upon call to complete", () => {
    test("should complete when the complete method is called on the observer", () => {
      subscription.next(1);
      subscription.next(2);
      subscription.next(3);
      subscription.complete();
      subscription.next(4);
      subscription.error(new Error("observer error"));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserver.next).toHaveBeenCalledTimes(3);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });

  describe("upon call to unsubscribe", () => {
    test("should call the teardown function and emit nothing", () => {
      subscription.unsubscribe();
      subscription.next(1);
      subscription.next(2);
      subscription.next(3);
      subscription.complete();
      subscription.next(4);
      subscription.error(new Error("observer error"));

      expect(tearDownSpy).toHaveBeenCalled();
      expect(spyObserver.next).not.toHaveBeenCalled();
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
    });
  });
});
