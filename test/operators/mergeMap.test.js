import assert from 'node:assert';
import { afterEach, beforeEach, test } from 'node:test';

import { createMockObservable, createMockObserver } from '../__tools__/index.js';

import { mergeMap } from '../../lib/operators/mergeMap.js';

/** @typedef {import('../__tools__/index.js').MockFunction} MockFunction */
/** @typedef {import('../__tools__/index.js').ObservableMock<number>} ObservableMockNum */

/** @type {ObservableMockNum[]} */
const observableMocks = [];
const valuesToEmit = Array.from(Array(20)).map(() => Math.random());

/** @type {(x:number) => import('../../lib/observable').Observable<number>} */
const getMock = (i) => observableMocks[i].observable;
const toMerged = mergeMap(getMock);

/** @type {ObservableMockNum} */
let sourceNumbers;
/** @type {import('../../lib/observable').Observable<number>} */
let mergedNumbers;
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
  mergedNumbers = toMerged(sourceNumbers.observable);
  // eslint-disable-next-line prettier/prettier
  observableMocks.push(
    createMockObservable(),
    createMockObservable(),
    createMockObservable()
  );
  observerMock = createMockObserver();
  subscription = mergedNumbers.subscribe(observerMock);
  nextMock = observerMock.next.mock;
  errorMock = observerMock.error.mock;
  completeMock = observerMock.complete.mock;
  tearDownMock = sourceNumbers.mocks.tearDown.mock;
});

afterEach(() => {
  observableMocks.length = 0;
});

test('mergeMap - should emit from the projected observables', () => {
  sourceNumbers.triggers.next(0);
  sourceNumbers.triggers.next(1);
  sourceNumbers.triggers.next(2);

  // emit values from a different inner observable each time
  valuesToEmit.forEach((value, index) => {
    const observableMock = observableMocks[index % 3];
    observableMock.triggers.next(value);
  });
  subscription.unsubscribe();

  // the merged observable should emit values in the same order
  assert.strictEqual(nextMock.callCount(), valuesToEmit.length);
  valuesToEmit.forEach((value, index) => {
    assert.deepStrictEqual(nextMock.calls[index].arguments, [value]);
  });
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
  observableMocks.forEach((obsMock) => {
    assert.strictEqual(obsMock.mocks.tearDown.mock.callCount(), 1);
  });
});

test('mergeMap - should error from any of the projected observables', () => {
  const errorIndex = Math.max(1, Math.floor(Math.random() * valuesToEmit.length));

  sourceNumbers.triggers.next(0);
  sourceNumbers.triggers.next(1);
  sourceNumbers.triggers.next(2);

  // emit values from a different inner observable each time
  valuesToEmit.forEach((value, index) => {
    const observableMock = observableMocks[index % 3];
    if (index === errorIndex) {
      observableMock.triggers.error(new Error('explosion in projected observable'));
    } else {
      observableMock.triggers.next(value);
    }
  });
  subscription.unsubscribe();

  // the merged observable should emit values in the same order
  assert.strictEqual(nextMock.callCount(), errorIndex);
  for (let index = 0; index < errorIndex; index++) {
    assert.deepStrictEqual(nextMock.calls[index].arguments, [valuesToEmit[index]]);
  }
  assert.strictEqual(errorMock.callCount(), 1);
  assert.strictEqual(errorMock.calls[0].arguments[0].message, 'explosion in projected observable');
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
  observableMocks.forEach((obsMock) => {
    assert.strictEqual(obsMock.mocks.tearDown.mock.callCount(), 1);
  });
});
