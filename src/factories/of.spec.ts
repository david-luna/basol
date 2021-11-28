import { of } from './of';

describe('of factory', () => {
  test('should create an observable from 1 param', () => {
    of([1, 2, 3, 4, 5, 6]).subscribe({
      next: (value) => {
        expect(value).toEqual([1, 2, 3, 4, 5, 6]);
      },
      complete: () => {
        expect.assertions(1);
      },
    });
  });

  test('should create an observable from several params', () => {
    let expected = 1;
    of(1, 2, 3, 4, 5, 6).subscribe({
      next: (value) => {
        expect(value).toEqual(expected++);
      },
      complete: () => {
        expect.assertions(6);
      },
    });
  });
});
