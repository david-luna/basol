import assert from 'node:assert';
import { beforeEach, test } from 'node:test';

import { createMockObservable, createMockObserver } from '../__tools__/index.js';

import { map } from '../../lib/operators/map.js';

/** @typedef {import('../__tools__').MockFunction} MockFunction */

/** @type {(x:number) => number} */
const square = (x) => x * x;
const toSquared = map(square);

/** @type {import('../__tools__').ObservableMock<number>} */
let sourceNumbers;
/** @type {import('../../lib/types').Observable<number>} */
let squaredNumbers;
/** @type {import('../__tools__').ObserverMock<number>} */
let observerMock;
/** @type {import('../../lib/types').Subscription} */
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
  squaredNumbers = toSquared(sourceNumbers.observable);
  observerMock = createMockObserver();
  subscription = squaredNumbers.subscribe(observerMock);
  nextMock = observerMock.next.mock;
  errorMock = observerMock.error.mock;
  completeMock = observerMock.complete.mock;
  tearDownMock = sourceNumbers.mocks.tearDown.mock;
});

test('map - should emit the mapped values', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.next(4);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 3);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [4]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [9]);
  assert.deepStrictEqual(nextMock.calls[2].arguments, [16]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('map - should error in the mapped observables', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.error(new Error('observer error'));
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 1);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [4]);
  assert.strictEqual(errorMock.callCount(), 1);
  assert.strictEqual(errorMock.calls[0].arguments[0].message, 'observer error');
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});
