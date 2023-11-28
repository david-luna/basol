import assert from 'node:assert';
import { beforeEach, test } from 'node:test';

import { createMockObservable, createMockObserver } from '../__tools__/index.js';

import { take } from '../../lib/operators/take.js';

/** @typedef {import('../__tools__/index.js').MockFunction} MockFunction */

const takeTwo = take(2);

/** @type {import('../__tools__/index.js').ObservableMock<number>} */
let sourceNumbers;
/** @type {import('../../lib/types.js').Observable<number>} */
let firstAndSecond;
/** @type {import('../__tools__/index.js').ObserverMock<number>} */
let observerMock;
/** @type {import('../../lib/types.js').Subscription} */
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
  firstAndSecond = takeTwo(sourceNumbers.observable);
  observerMock = createMockObserver();
  subscription = firstAndSecond.subscribe(observerMock);
  nextMock = observerMock.next.mock;
  errorMock = observerMock.error.mock;
  completeMock = observerMock.complete.mock;
  tearDownMock = sourceNumbers.mocks.tearDown.mock;
});

test('take - should emit only the values taken', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.next(4);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 2);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [3]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('take - should error before taking all the values', () => {
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

test('take - should complete if error happens after taking all values', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.next(4);
  sourceNumbers.triggers.error(new Error('observer error'));
  sourceNumbers.triggers.complete();
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 2);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [3]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
});
