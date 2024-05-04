import assert from 'node:assert';
import { beforeEach, test } from 'node:test';

import { createMockObservable, createMockObserver } from '../__tools__/index.js';

import { concat } from '../../lib/factories/concat.js';

/** @typedef {import('../__tools__/index.js').MockFunction} MockFunction */

/** @type {import('../__tools__/index.js').ObservableMock<number>} */
let sourceNumbers;
/** @type {import('../__tools__/index.js').ObservableMock<string>} */
let sourceStrings;
/** @type {import('../__tools__/index.js').ObservableMock<boolean>} */
let sourceBooleans;
/** @type {import('../../lib/observable').Observable<number | string | boolean>} */
let concatFromSources;

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
  concatFromSources = concat(
    sourceNumbers.observable,
    sourceStrings.observable,
    sourceBooleans.observable
  );
  observerMock = createMockObserver();
  subscription = concatFromSources.subscribe(observerMock);
  nextMock = observerMock.next.mock;
  errorMock = observerMock.error.mock;
  completeMock = observerMock.complete.mock;
  tearDownMock = sourceNumbers.mocks.tearDown.mock;
});

test('concat - should emit last value from all source observables', () => {
  sourceNumbers.triggers.next(1);
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.complete();
  sourceStrings.triggers.next('one');
  sourceStrings.triggers.next('two');
  sourceStrings.triggers.next('three');
  sourceStrings.triggers.complete();
  sourceBooleans.triggers.next(true);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 7);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [1]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[2].arguments, [3]);
  assert.deepStrictEqual(nextMock.calls[3].arguments, ['one']);
  assert.deepStrictEqual(nextMock.calls[4].arguments, ['two']);
  assert.deepStrictEqual(nextMock.calls[5].arguments, ['three']);
  assert.deepStrictEqual(nextMock.calls[6].arguments, [true]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
  assert.strictEqual(sourceNumbers.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceStrings.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceBooleans.mocks.tearDown.mock.callCount(), 1);
});

test('concat - should not emit if there is an error in a source observable', () => {
  sourceNumbers.triggers.next(1);
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.complete();
  sourceStrings.triggers.next('one');
  sourceStrings.triggers.next('two');
  sourceStrings.triggers.error(new Error('some error'));
  sourceStrings.triggers.next('three');
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 5);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [1]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[2].arguments, [3]);
  assert.deepStrictEqual(nextMock.calls[3].arguments, ['one']);
  assert.deepStrictEqual(nextMock.calls[4].arguments, ['two']);
  assert.strictEqual(errorMock.callCount(), 1);
  assert.strictEqual(errorMock.calls[0].arguments[0].message, 'some error');
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
  assert.strictEqual(sourceNumbers.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceStrings.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceBooleans.mocks.tearDown.mock.callCount(), 0);
});

test('concat - should complete after all observables complete', () => {
  sourceNumbers.triggers.next(1);
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.complete();
  sourceStrings.triggers.next('one');
  sourceStrings.triggers.next('two');
  sourceStrings.triggers.next('three');
  sourceStrings.triggers.complete();
  sourceBooleans.triggers.next(true);
  sourceBooleans.triggers.next(false);
  sourceBooleans.triggers.complete();
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 8);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [1]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[2].arguments, [3]);
  assert.deepStrictEqual(nextMock.calls[3].arguments, ['one']);
  assert.deepStrictEqual(nextMock.calls[4].arguments, ['two']);
  assert.deepStrictEqual(nextMock.calls[5].arguments, ['three']);
  assert.deepStrictEqual(nextMock.calls[6].arguments, [true]);
  assert.deepStrictEqual(nextMock.calls[7].arguments, [false]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
  assert.strictEqual(sourceNumbers.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceStrings.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceBooleans.mocks.tearDown.mock.callCount(), 1);
});
