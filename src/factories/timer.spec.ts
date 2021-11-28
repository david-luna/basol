import { timer } from "./timer";

describe("timer factory", () => {
  test("should create an observable emiting after the given time", async () => {
    const nextSpy = jest.fn();
    const errorSpy = jest.fn();
    const completeSpy = jest.fn();

    const subscription = timer(100).subscribe({
      next: nextSpy,
      error: errorSpy,
      complete: completeSpy,
    });

    // just after it shuold not emit
    expect(nextSpy).not.toHaveBeenCalled();

    // we wait
    await (new Promise(r => setTimeout(r,150)))
    subscription.unsubscribe();

    // and now we should check
    expect(nextSpy).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  test("should create an observable emiting at the given date", async () => {
    const nextSpy = jest.fn();
    const errorSpy = jest.fn();
    const completeSpy = jest.fn();
    const emitAt = new Date(Date.now() + 1000);

    const subscription = timer(emitAt).subscribe({
      next: nextSpy,
      error: errorSpy,
      complete: completeSpy,
    });

    await (new Promise(r => setTimeout(r,150)));
    expect(nextSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(completeSpy).not.toHaveBeenCalled();

    await (new Promise(r => setTimeout(r,900)));
    expect(nextSpy).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});
