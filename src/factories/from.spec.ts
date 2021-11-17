import { from } from "./from";
import { Observable } from "../observable";

describe("from factory", () => {
  test("should throw an error if the input is not accepted", () => {
    // eslint-disable-next-line arrow-body-style
    expect(() => from({} as any)).toThrowError("cannot create an observable for the given input");
  });

  test("should create an observable from an array", () => {
    let expected = 1;
    from([1, 2, 3, 4, 5, 6]).subscribe({
      next: (value) => {
        expect(value).toEqual(expected++);
      },
      complete: () => {
        expect.assertions(6);
      }
    });
  });

  test("should create an observable from a promise that resolves", () => {
    const promise = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      });
    });
    from(promise).subscribe({
      next: (value) => {
        expect(value).toEqual(true);
      },
      complete: () => {
        expect.assertions(1);
      }
    });
  });

  test("should create an observable from a promise that rejects", () => {
    const promise = new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("promise rejected"));
      });
    });
    from(promise).subscribe({
      error: (details) => {
        expect(details).toEqual(expect.objectContaining({
          message: "promise rejected"
        }));
      },
      complete: () => {
        expect.assertions(1);
      }
    });
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
      }
    });
  });
});
