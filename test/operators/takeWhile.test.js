import assert from 'node:assert';
import { beforeEach, test } from 'node:test';

import { createMockObservable, createMockObserver } from '../__tools__/index.js';

import { takeWhile } from '../../lib/operators/takeWhile.js';

/** @typedef {import('../__tools__/index.js').MockFunction} MockFunction */

const lowSquares = takeWhile((value) => Math.pow(value, 2) < 100);

/** @type {import('../__tools__/index.js').ObservableMock<number>} */
let sourceNumbers;
/** @type {import('../../lib/types.js').Observable<number>} */
let squaresBelowhundred;
/** @type {import('../__tools__/index.js').ObserverMock<number>} */
let observerMock;
/** @type {import('../../lib/types.js').Subscription} */
let subscription;
/** @type {MockFunction} */
let nextMock;
/** @type {MockFunction} */
let errorMock;
/** @type {MockFunction} */
let completeMock;
/** @type {MockFunction} */
let tearDownMock;

beforeEach(() => {
  sourceNumbers = createMockObservable();
  squaresBelowhundred = lowSquares(sourceNumbers.observable);
  observerMock = createMockObserver();
  subscription = squaresBelowhundred.subscribe(observerMock);
  nextMock = observerMock.next.mock;
  errorMock = observerMock.error.mock;
  completeMock = observerMock.complete.mock;
  tearDownMock = sourceNumbers.mocks.tearDown.mock;
});

test('takeWhile - should emit values if passing the predicate', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.next(4);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 3);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [3]);
  assert.deepStrictEqual(nextMock.calls[2].arguments, [4]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('takeWhile - should emit values until the predicate fails', () => {
  const values = [...new Array(20)].map((v, i) => i + 1);

  values.forEach(sourceNumbers.triggers.next);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 9);
  values
    .filter((v) => v < 10)
    .forEach((v, index) => {
      assert.deepStrictEqual(nextMock.calls[index].arguments, [v]);
    });
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('takeWhile - should emit values including the one failing the predicate', () => {
  const values = [...new Array(20)].map((v, i) => i + 1);
  squaresBelowhundred = takeWhile((v) => v < 100, true);

  values.forEach(sourceNumbers.triggers.next);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 9);
  values
    .filter((v) => v < 10)
    .forEach((v, index) => {
      assert.deepStrictEqual(nextMock.calls[index].arguments, [v]);
    });
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('takeWhile - should error before the predicate fails', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.error(new Error('observer error'));
  sourceNumbers.triggers.next(4);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 2);
  assert.strictEqual(errorMock.callCount(), 1);
  assert.strictEqual(errorMock.calls[0].arguments[0].message, 'observer error');
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('takeWhile - should not error if the predicate already failed', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.next(11);
  sourceNumbers.triggers.error(new Error('observer error'));
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 2);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [3]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('takeWhile - should not emit values if already completed', () => {
  sourceNumbers.triggers.complete();
  sourceNumbers.triggers.next(2);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 0);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
});
