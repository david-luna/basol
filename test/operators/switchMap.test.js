import assert from 'node:assert';
import { beforeEach, test } from 'node:test';

import { createMockObservable, createMockObserver } from '../__tools__/index.js';

import { switchMap } from '../../lib/operators/switchMap.js';
import { of } from '../../lib/factories/of.js';

/** @typedef {import('../__tools__/index.js').MockFunction} MockFunction */
/** @typedef {import('../__tools__/index.js').ObservableMock<number>} ObservableMockNum */

const FLUSH_TIMEOUT = 1;
const flushPromises = (timeout = FLUSH_TIMEOUT) => new Promise((r) => setTimeout(r, timeout));

/** @type {ObservableMockNum} */
let sourceNumbers;
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
  observerMock = createMockObserver();
  nextMock = observerMock.next.mock;
  errorMock = observerMock.error.mock;
  completeMock = observerMock.complete.mock;
  tearDownMock = sourceNumbers.mocks.tearDown.mock;
});

test('switchMap - should emit mapped values with a single function', () => {
  /** @type {(x:number) => Array<number>} */
  const createArray = (x) => new Array(x).fill(x);
  const toArray = switchMap(createArray);
  const arrayObservable = toArray(sourceNumbers.observable);

  subscription = arrayObservable.subscribe(observerMock);
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.next(4);
  subscription.unsubscribe();

  // the merged observable should emit values in the same order
  assert.strictEqual(nextMock.callCount(), 9);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[2].arguments, [3]);
  assert.deepStrictEqual(nextMock.calls[3].arguments, [3]);
  assert.deepStrictEqual(nextMock.calls[4].arguments, [3]);
  assert.deepStrictEqual(nextMock.calls[5].arguments, [4]);
  assert.deepStrictEqual(nextMock.calls[6].arguments, [4]);
  assert.deepStrictEqual(nextMock.calls[7].arguments, [4]);
  assert.deepStrictEqual(nextMock.calls[8].arguments, [4]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('switchMap - should emit the mapped values with an observer projection', () => {
  /** @type {(x:number) => import('../../lib/types').Observable<number>} */
  const createObservable = (x) => of(x, x ** 2, x ** 3);
  const toObservable = switchMap(createObservable);
  const observableObservable = toObservable(sourceNumbers.observable);

  subscription = observableObservable.subscribe(observerMock);
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.next(4);
  subscription.unsubscribe();

  // the merged observable should emit values in the same order
  assert.strictEqual(nextMock.callCount(), 9);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [2]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [4]);
  assert.deepStrictEqual(nextMock.calls[2].arguments, [8]);
  assert.deepStrictEqual(nextMock.calls[3].arguments, [3]);
  assert.deepStrictEqual(nextMock.calls[4].arguments, [9]);
  assert.deepStrictEqual(nextMock.calls[5].arguments, [27]);
  assert.deepStrictEqual(nextMock.calls[6].arguments, [4]);
  assert.deepStrictEqual(nextMock.calls[7].arguments, [16]);
  assert.deepStrictEqual(nextMock.calls[8].arguments, [64]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('switchMap - should emit the mapped values with an promise projection', async () => {
  /** @type {(x:number) => Promise<number>} */
  const createPromise = (x) => Promise.resolve(x * x);
  const toPromise = switchMap(createPromise);
  const promiseObservable = toPromise(sourceNumbers.observable);

  subscription = promiseObservable.subscribe(observerMock);
  sourceNumbers.triggers.next(2);
  await flushPromises();
  sourceNumbers.triggers.next(3);
  await flushPromises();
  sourceNumbers.triggers.next(4);
  await flushPromises();
  subscription.unsubscribe();

  // the merged observable should emit values in the same order
  assert.strictEqual(nextMock.callCount(), 3);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [4]);
  assert.deepStrictEqual(nextMock.calls[1].arguments, [9]);
  assert.deepStrictEqual(nextMock.calls[2].arguments, [16]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});

test('switchMap - should cancel the async value if source emits before', async () => {
  /** @type {(x:number) => Promise<number>} */
  const createPromise = (x) => Promise.resolve(x * x);
  const toPromise = switchMap(createPromise);
  const promiseObservable = toPromise(sourceNumbers.observable);

  subscription = promiseObservable.subscribe(observerMock);
  sourceNumbers.triggers.next(2);
  sourceNumbers.triggers.next(3);
  sourceNumbers.triggers.next(4);
  await flushPromises();
  subscription.unsubscribe();

  // the merged observable should emit values in the same order
  assert.strictEqual(nextMock.callCount(), 1);
  assert.deepStrictEqual(nextMock.calls[0].arguments, [16]);
  assert.strictEqual(errorMock.callCount(), 0);
  assert.strictEqual(completeMock.callCount(), 0);
  assert.strictEqual(tearDownMock.callCount(), 1);
});
