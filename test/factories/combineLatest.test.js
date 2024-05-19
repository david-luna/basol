import assert from 'node:assert';
import { beforeEach, test } from 'node:test';

import { createMockObservable, createMockObserver } from '../__tools__/index.js';

import { combineLatest } from '../../lib/factories/combineLatest.js';

/** @typedef {import('../__tools__/index.js').MockFunction} MockFunction */

/** @type {import('../__tools__/index.js').ObservableMock<number>} */
let sourceNumbers;
/** @type {import('../__tools__/index.js').ObservableMock<string>} */
let sourceStrings;
/** @type {import('../__tools__/index.js').ObservableMock<boolean>} */
let sourceBooleans;
/** @type {import('../../lib/observable').Observable<[number, string, boolean]>} */
let lastFromSources;

/** @type {import('../__tools__/index.js').ObserverMock<number>} */
let observerMock;
/** @type {import('../../lib/observable').Subscription} */
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
  sourceStrings = createMockObservable();
  sourceBooleans = createMockObservable();
  // eslint-disable-next-line prettier/prettier
  lastFromSources = combineLatest(
    sourceNumbers.observable,
    sourceStrings.observable,
    sourceBooleans.observable
  );
  observerMock = createMockObserver();
  subscription = lastFromSources.subscribe(observerMock);
  nextMock = observerMock.next.mock;
  errorMock = observerMock.error.mock;
  completeMock = observerMock.complete.mock;
  tearDownMock = sourceNumbers.mocks.tearDown.mock;
});

test('combineLatest - should emit last value from all source observables', () => {
  sourceNumbers.triggers.next(1);
  sourceStrings.triggers.next('one');
  sourceBooleans.triggers.next(true);
  sourceNumbers.triggers.next(2);
  sourceStrings.triggers.next('two');
  sourceBooleans.triggers.next(false);
  sourceNumbers.triggers.next(3);
  sourceStrings.triggers.next('three');
  sourceBooleans.triggers.next(true);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 7);
  assert.deepStrictEqual(nextMock.calls[0].arguments[0], [1, 'one', true]);
  assert.deepStrictEqual(nextMock.calls[1].arguments[0], [2, 'one', true]);
  assert.deepStrictEqual(nextMock.calls[2].arguments[0], [2, 'two', true]);
  assert.deepStrictEqual(nextMock.calls[3].arguments[0], [2, 'two', false]);
  assert.deepStrictEqual(nextMock.calls[4].arguments[0], [3, 'two', false]);
  assert.deepStrictEqual(nextMock.calls[5].arguments[0], [3, 'three', false]);
  assert.deepStrictEqual(nextMock.calls[6].arguments[0], [3, 'three', true]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
  assert.strictEqual(sourceNumbers.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceStrings.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceBooleans.mocks.tearDown.mock.callCount(), 1);
});

test('combineLatest - should stop emiting if error in any source observable', () => {
  sourceNumbers.triggers.next(1);
  sourceStrings.triggers.next('one');
  sourceBooleans.triggers.next(true);
  sourceNumbers.triggers.next(2);
  sourceStrings.triggers.next('two');
  sourceBooleans.triggers.error(new Error('some error'));
  sourceNumbers.triggers.next(3);
  sourceStrings.triggers.next('three');
  sourceBooleans.triggers.next(true);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 3);
  assert.deepStrictEqual(nextMock.calls[0].arguments[0], [1, 'one', true]);
  assert.deepStrictEqual(nextMock.calls[1].arguments[0], [2, 'one', true]);
  assert.deepStrictEqual(nextMock.calls[2].arguments[0], [2, 'two', true]);
  assert.strictEqual(errorMock.callCount(), 1);
  assert.strictEqual(errorMock.calls[0].arguments[0].message, 'some error');
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
  assert.strictEqual(sourceNumbers.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceStrings.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceBooleans.mocks.tearDown.mock.callCount(), 1);
});

test('combineLatest - should complete when all source observables complete', () => {
  sourceNumbers.triggers.next(1);
  sourceStrings.triggers.next('one');
  sourceBooleans.triggers.next(true);
  sourceNumbers.triggers.next(2);
  sourceStrings.triggers.next('two');
  sourceNumbers.triggers.complete();
  sourceStrings.triggers.complete();
  assert.strictEqual(completeMock.callCount(), 0);
  sourceBooleans.triggers.next(false);
  sourceBooleans.triggers.next(true);
  sourceBooleans.triggers.complete();
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 5);
  assert.deepStrictEqual(nextMock.calls[0].arguments[0], [1, 'one', true]);
  assert.deepStrictEqual(nextMock.calls[1].arguments[0], [2, 'one', true]);
  assert.deepStrictEqual(nextMock.calls[2].arguments[0], [2, 'two', true]);
  assert.deepStrictEqual(nextMock.calls[3].arguments[0], [2, 'two', false]);
  assert.deepStrictEqual(nextMock.calls[4].arguments[0], [2, 'two', true]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
  assert.strictEqual(sourceNumbers.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceStrings.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceBooleans.mocks.tearDown.mock.callCount(), 1);
});
