import assert from 'node:assert';
import { beforeEach, test } from 'node:test';

import { createMockObservable, createMockObserver } from '../__tools__/index.js';

import { filter } from '../../lib/operators/filter.js';

/** @type {(x:number) => boolean} */
const isEven = (x) => x % 2 === 0;
const toEven = filter(isEven);

/** @type {import('../__tools__').ObservableMock<number>} */
let sourceNumbers;
/** @type {import('../../lib/types').Observable<number>} */
let evenNumbers;

beforeEach(() => {
  sourceNumbers = createMockObservable();
  evenNumbers = toEven(sourceNumbers.observable);
});

test('filter - should emit the filtered values', () => {
  const observerMock = createMockObserver();
  const subscription = evenNumbers.subscribe(observerMock);

  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.next(4);
  subscription.unsubscribe();

  const callsToNext = observerMock.next.mock.calls;
  assert.deepStrictEqual(callsToNext[0].arguments, [2]);
  assert.deepStrictEqual(callsToNext[1].arguments, [4]);
  assert.strictEqual(observerMock.next.mock.callCount(), 2);

  // error & complete not called
  assert.strictEqual(observerMock.error.mock.callCount(), 0);
  assert.strictEqual(observerMock.complete.mock.callCount(), 0);

  // tear down function called
  assert.strictEqual(sourceNumbers.mocks.tearDown.mock.callCount(), 0);
});

test('filter - should error in the filtered observables', () => {
  const observerMock = createMockObserver();
  const subscription = evenNumbers.subscribe(observerMock);

  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.error(new Error('observer error'));
  subscription.unsubscribe();

  const callsToNext = observerMock.next.mock.calls;
  assert.strictEqual(observerMock.next.mock.callCount(), 1);
  assert.deepStrictEqual(callsToNext[0].arguments, [2]);

  const callsToError = observerMock.error.mock.calls;
  assert.strictEqual(observerMock.error.mock.callCount(), 1);
  assert.strictEqual(callsToError[0].arguments[0].message, 'observer error');

  // complete not called
  assert.strictEqual(observerMock.complete.mock.callCount(), 0);

  // tear down function called
  assert.strictEqual(sourceNumbers.mocks.tearDown.mock.callCount(), 0);
});

test('filter - should complete in the filtered observables', () => {
  const observerMock = createMockObserver();
  const subscription = evenNumbers.subscribe(observerMock);

  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.complete();
  subscription.unsubscribe();

  const callsToNext = observerMock.next.mock.calls;
  assert.strictEqual(observerMock.next.mock.callCount(), 1);
  assert.deepStrictEqual(callsToNext[0].arguments, [2]);

  // error not called
  assert.strictEqual(observerMock.error.mock.callCount(), 0);

  // complete called
  assert.strictEqual(observerMock.complete.mock.callCount(), 1);

  // tear down function called
  assert.strictEqual(sourceNumbers.mocks.tearDown.mock.callCount(), 0);
});
