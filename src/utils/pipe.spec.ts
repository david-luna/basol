import { pipe } from './pipe';

describe('pipe operator', () => {
  test('should return identity function if no operators passed', () => {
    const input = { value: 2 };
    const piped = pipe();

    expect(piped).toEqual(expect.any(Function));
    expect(piped(input)).toBe(input);
  });

  test('should return the function passed if there is only one', () => {
    const input = { value: 2 };
    const getValue = (x: { value: number }) => x.value;
    const piped = pipe(getValue);

    expect(piped).toBe(getValue);
    expect(piped(input)).toEqual(2);
  });

  test('should return combine the functions passed in the right order', () => {
    const input = 2;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const timesTen = (x: number) => x * 10;
    const plusTwo = (x: number) => x + 2;
    const timesPlusPipe = pipe(timesTen, plusTwo);
    const plusTimesPipe = pipe(plusTwo, timesTen);

    expect(timesPlusPipe).toEqual(expect.any(Function));
    expect(plusTimesPipe).toEqual(expect.any(Function));
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    expect(timesPlusPipe(input)).toEqual(22);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    expect(plusTimesPipe(input)).toEqual(40);
  });
});
