import assert from 'node:assert';
import { beforeEach, mock, test } from 'node:test';

import { createMockObservable, createMockObserver } from '../__tools__/index.js';

import { tap } from '../../lib/operators/tap.js';

/** @typedef {import('../__tools__/index.js').MockFunction} MockFunction */

// /** @type {(x:number) => void} */
// const log = (x) => console.log(x); // eslint-disable-line no-console -- used for test purposes
const mockLog = mock.fn();
const toLogged = tap(mockLog);

/** @type {import('../__tools__/index.js').ObservableMock<number>} */
let sourceNumbers;
/** @type {import('../../lib/observable.js').Observable<number>} */
let loggedNumbers;
/** @type {import('../__tools__/index.js').ObserverMock<number>} */
let observerMock;
/** @type {import('../../lib/observable.js').Subscription} */
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
  loggedNumbers = toLogged(sourceNumbers.observable);
  observerMock = createMockObserver();
  subscription = loggedNumbers.subscribe(observerMock);
  nextMock = observerMock.next.mock;
  errorMock = observerMock.error.mock;
  completeMock = observerMock.complete.mock;
  tearDownMock = sourceNumbers.mocks.tearDown.mock;
});

test('tap - should emit the same values', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.next(4);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 3);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [3]);
  assert.deepStrictEqual(nextMock.calls[2].arguments, [4]);
  // side effect funciton is called
  assert.deepStrictEqual(mockLog.mock.calls[0].arguments, [2]);
  assert.deepStrictEqual(mockLog.mock.calls[1].arguments, [3]);
  assert.deepStrictEqual(mockLog.mock.calls[2].arguments, [4]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('tap - should error if source observable errors', () => {
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.error(new Error('observer error'));
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 1);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [2]);
  assert.strictEqual(errorMock.callCount(), 1);
  assert.strictEqual(errorMock.calls[0].arguments[0].message, 'observer error');
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});
