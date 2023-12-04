import assert from 'node:assert';
import { beforeEach, test } from 'node:test';

import { createMockObservable, createMockObserver } from '../__tools__/index.js';

import { withLatestFrom } from '../../lib/operators/withLatestFrom.js';

/** @typedef {import('../__tools__/index.js').MockFunction} MockFunction */

/** @type {import('../../lib/types.js').withLatestFrom} */
let latestValues;
/** @type {import('../__tools__/index.js').ObservableMock<{ val: string }>} */
let sourceRecords;
/** @type {import('../__tools__/index.js').ObservableMock<number>} */
let sourceNumbers;
/** @type {import('../__tools__/index.js').ObservableMock<string>} */
let sourceStrings;
/** @type {import('../__tools__/index.js').ObservableMock<boolean>} */
let sourceBooleans;
/** @type {import('../../lib/types.js').Observable<[{val: string}, number, string, boolean]>} */
let lastFromSources;

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
  sourceRecords = createMockObservable();
  sourceNumbers = createMockObservable();
  sourceStrings = createMockObservable();
  sourceBooleans = createMockObservable();
  // eslint-disable-next-line prettier/prettier
  latestValues = withLatestFrom(
    sourceNumbers.observable,
    sourceStrings.observable,
    sourceBooleans.observable
  );
  lastFromSources = latestValues(sourceRecords.observable);
  observerMock = createMockObserver();
  subscription = lastFromSources.subscribe(observerMock);
  nextMock = observerMock.next.mock;
  errorMock = observerMock.error.mock;
  completeMock = observerMock.complete.mock;
  tearDownMock = sourceNumbers.mocks.tearDown.mock;
});

test('withLatestFrom - should emit nothing if not all sources have emitted', () => {
  sourceNumbers.triggers.next(1);
  sourceStrings.triggers.next('one');
  sourceRecords.triggers.next({ val: 0 });
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 0);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('withLatestFrom - should emit if all sources have emitted', () => {
  sourceNumbers.triggers.next(1);
  sourceStrings.triggers.next('one');
  sourceBooleans.triggers.next(true);
  sourceRecords.triggers.next({ val: 0 });
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 1);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [[{ val: 0 }, 1, 'one', true]]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('withLatestFrom - should emit last value of the completed observables', () => {
  sourceNumbers.triggers.next(1);
  sourceStrings.triggers.next('one');
  sourceBooleans.triggers.next(true);
  sourceBooleans.triggers.complete();
  sourceRecords.triggers.next({ val: 1 });

  assert.strictEqual(nextMock.callCount(), 1);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [[{ val: 1 }, 1, 'one', true]]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 0);

  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.complete();
  sourceRecords.triggers.next({ val: 2 });
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 2);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [[{ val: 2 }, 2, 'one', true]]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('withLatestFrom - should error if the main observable errors', () => {
  sourceNumbers.triggers.next(1);
  sourceStrings.triggers.next('one');
  sourceBooleans.triggers.next(true);
  sourceBooleans.triggers.complete();
  sourceRecords.triggers.error(new Error('source error'));

  assert.strictEqual(nextMock.callCount(), 0);
  assert.strictEqual(errorMock.callCount(), 1);
  assert.strictEqual(errorMock.calls[0].arguments[0].message, 'source error');
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 0);

  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.complete();
  sourceRecords.triggers.next({ val: 2 });
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 0);
  assert.strictEqual(errorMock.callCount(), 1);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('withLatestFrom - should error if any of the other observables error', () => {
  sourceNumbers.triggers.next(1);
  sourceStrings.triggers.next('one');
  sourceStrings.triggers.error(new Error('string error'));
  sourceBooleans.triggers.next(true);
  sourceBooleans.triggers.complete();
  sourceRecords.triggers.next({ val: 1 });

  assert.strictEqual(nextMock.callCount(), 0);
  assert.strictEqual(errorMock.callCount(), 1);
  assert.strictEqual(errorMock.calls[0].arguments[0].message, 'string error');
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 0);

  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.complete();
  sourceRecords.triggers.next({ val: 2 });
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 0);
  assert.strictEqual(errorMock.callCount(), 1);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('withLatestFrom - should complete if the main observable completes', () => {
  sourceNumbers.triggers.next(1);
  sourceStrings.triggers.next('one');
  sourceBooleans.triggers.next(true);
  sourceRecords.triggers.next({ val: 1 });
  sourceRecords.triggers.complete();
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 1);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [[{ val: 1 }, 1, 'one', true]]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('withLatestFrom - should not emit after main observable completes', () => {
  sourceNumbers.triggers.next(1);
  sourceStrings.triggers.next('one');
  sourceBooleans.triggers.next(true);
  sourceRecords.triggers.next({ val: 1 });
  sourceRecords.triggers.complete();
  sourceNumbers.triggers.next(2);
  sourceStrings.triggers.next('two');
  sourceBooleans.triggers.next(false);
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 1);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [[{ val: 1 }, 1, 'one', true]]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('withLatestFrom - should teardown all inne subscriptions', () => {
  sourceNumbers.triggers.next(1);
  sourceStrings.triggers.next('one');
  sourceBooleans.triggers.next(true);
  sourceRecords.triggers.next({ val: 1 });
  sourceRecords.triggers.complete();
  subscription.unsubscribe();

  assert.strictEqual(nextMock.callCount(), 1);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [[{ val: 1 }, 1, 'one', true]]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 1);
  assert.strictEqual(tearDownMock.callCount(), 1);
  assert.strictEqual(sourceNumbers.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceStrings.mocks.tearDown.mock.callCount(), 1);
  assert.strictEqual(sourceBooleans.mocks.tearDown.mock.callCount(), 1);
});
