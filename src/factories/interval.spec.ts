import { interval } from './interval';

describe('interval factory', () => {
  test('should create an observable emiting values on intervals', async () => {
    const values: number[] = [];

    const subscription = interval(100).subscribe({
      next: (value) => {
        values.push(value);
      },
    });

    await new Promise((r) => setTimeout(r, 350));
    subscription.unsubscribe();
    expect(values).toEqual([0, 1, 2]);
  });
});
