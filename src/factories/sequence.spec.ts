import { sequence } from "./sequence";

describe("sequence factory", () => {
  test("should create an observable emiting sequence numbers", async () => {
    const values: number[] = [];

    const subscription = sequence(100).subscribe({
      next: (value) => {
        values.push(value);
      }
    });

    await (new Promise(r => setTimeout(r,350)))
    subscription.unsubscribe();
    expect(values).toEqual([0,1,2])
  });

  test("should create an observable emiting values given sequence function", async () => {
    const values: number[] = [];
    const double = (idx: number): number => idx * 2;

    const subscription = sequence(100, double).subscribe({
      next: (value) => {
        values.push(value);
      }
    });

    await (new Promise(r => setTimeout(r,550)))
    subscription.unsubscribe();
    expect(values).toEqual([0,2,4,6,8])
  });

  test("should create an observable emiting values with no so simple factories", async () => {
    const values: number[] = [];
    const fibonacci = (index: number): number => {
      return index < 2 ? index : fibonacci(index -1) + fibonacci(index -2);
    };

    const subscription = sequence(100, fibonacci).subscribe({
      next: (value) => {
        values.push(value);
      }
    });

    await (new Promise(r => setTimeout(r,650)))
    subscription.unsubscribe();
    expect(values).toEqual([0,1,1,2,3,5])
  });
});
