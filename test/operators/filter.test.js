import assert from 'node:assert';
import { beforeEach, test } from 'node:test';

import { createMockObservable, createMockObserver } from '../__tools__/index.js';

import { filter } from '../../lib/operators/filter.js';

/** @typedef {import('../__tools__').MockFunction} MockFunction */

/** @type {(x:number) => boolean} */
const isEven = (x) => x % 2 === 0;
const toEven = filter(isEven);

/** @type {import('../__tools__').ObservableMock<number>} */
let sourceNumbers;
/** @type {import('../../lib/types').Observable<number>} */
let evenNumbers;
/** @type {import('../__tools__').ObserverMock<number>} */
let observerMock;
/** @type {import('../../lib/types').Subscription} */
let subscription;
/** @type {MockFunction} */
let nextMock
/** @type {MockFunction} */
let errorMock;
/** @type {MockFunction} */
let completeMock;
/** @type {MockFunction} */
let tearDownMock;

beforeEach(() => {
  sourceNumbers = createMockObservable();
  evenNumbers = toEven(sourceNumbers.observable);
  observerMock = createMockObserver();
  subscription = evenNumbers.subscribe(observerMock);
  nextMock = observerMock.next.mock;
  errorMock = observerMock.error.mock;
  completeMock = observerMock.complete.mock;
  tearDownMock = sourceNumbers.mocks.tearDown.mock;
});

test('filter - should emit the filtered values', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.next(4);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 2);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [4]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('filter - should error in the filtered observables', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.error(new Error('observer error'));
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 1);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [2]);
  assert.strictEqual(errorMock.callCount(), 1);
  assert.deepStrictEqual(errorMock.calls[0].arguments[0].message, 'observer error');
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('filter - should complete in the filtered observables', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.complete();
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 1);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [2]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
});
