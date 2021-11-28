import { from } from './from';
import { Observable } from '../observable';

describe('from factory', () => {
  test('should throw an error if the input is not accepted', () => {
    // eslint-disable-next-line arrow-body-style
    expect(() => from({} as any)).toThrowError('cannot create an observable for the given input');
  });

  test('should create an observable from an array', () => {
    let expected = 1;
    from([1, 2, 3, 4, 5, 6]).subscribe({
      next: (value) => {
        expect(value).toEqual(expected++);
      },
      complete: () => {
        expect.assertions(6);
      },
    });
  });

  test('should create an observable from a resolved', (done) => {
    const promise = Promise.resolve(true);

    from(promise).subscribe({
      next: (value) => {
        expect(value).toEqual(true);
      },
      complete: () => {
        expect.assertions(1);
        done();
      },
    });
  });

  test('should create an observable from a promise that resolves after a time', async () => {
    const nextSpy = jest.fn();
    const completeSpy = jest.fn();
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(true));
    });

    from(promise).subscribe({
      next: nextSpy,
      complete: completeSpy,
    });

    await promise;
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });

  test('should create an observable from a promise that rejects', (done) => {
    const promise = Promise.reject(new Error('promise rejected'));

    from(promise).subscribe({
      error: (details) => {
        expect(details).toEqual(
          expect.objectContaining({
            message: 'promise rejected',
          }),
        );
        done();
      },
    });
  });

  test('should create an observable from a promise that rejects after a time', async () => {
    const nextSpy = jest.fn();
    const errorSpy = jest.fn();
    const completeSpy = jest.fn();
    const promise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('promise rejected')));
    });

    from(promise).subscribe({
      next: nextSpy,
      error: errorSpy,
      complete: completeSpy,
    });

    try {
      await promise;
    } catch (e) {}

    expect(nextSpy).not.toHaveBeenCalled();
    expect(completeSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'promise rejected',
      }),
    );
  });

  test("should return the input if it's an observable", () => {
    const observableInput = new Observable<boolean>((observer) => {
      observer.next(true);
      observer.complete();
    });
    const newObservable = from(observableInput);

    expect(newObservable).toBe(observableInput);
    newObservable.subscribe({
      next: (value) => {
        expect(value).toEqual(true);
      },
      complete: () => {
        expect.assertions(2);
      },
    });
  });
});
