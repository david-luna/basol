import assert from 'node:assert';
import { test } from 'node:test';

import { createMockObserver } from '../__tools__/index.js';

import { timer } from '../../lib/factories/timer.js';

test('timer - should create an observable emiting after the given time', async () => {
  const observerMock = createMockObserver();
  const observable = timer(50);
  const subscription = observable.subscribe(observerMock);

  // TODO: use timers when v20.4.0 gets into maintenance
  // https://nodejs.org/en/about/previous-releases
  // https://nodejs.org/api/test.html#class-mocktimers
  await new Promise((r) => setTimeout(r, 100));
  subscription.unsubscribe();

  assert.deepStrictEqual(observerMock.next.mock.callCount(), 1);
  assert.deepStrictEqual(observerMock.error.mock.callCount(), 0);
  assert.deepStrictEqual(observerMock.complete.mock.callCount(), 1);
});

test('timer - should create an observable emiting after the given Date', async () => {
  const emitAt = new Date(Date.now() + 500);
  const observerMock = createMockObserver();
  const observable = timer(emitAt);
  const subscription = observable.subscribe(observerMock);

  // TODO: use timers when v20.4.0 gets into maintenance
  // https://nodejs.org/en/about/previous-releases
  // https://nodejs.org/api/test.html#class-mocktimers
  await new Promise((r) => setTimeout(r, 100));

  assert.deepStrictEqual(observerMock.next.mock.callCount(), 0);
  assert.deepStrictEqual(observerMock.error.mock.callCount(), 0);
  assert.deepStrictEqual(observerMock.complete.mock.callCount(), 0);

  await new Promise((r) => setTimeout(r, 450));

  assert.deepStrictEqual(observerMock.next.mock.callCount(), 1);
  assert.deepStrictEqual(observerMock.error.mock.callCount(), 0);
  assert.deepStrictEqual(observerMock.complete.mock.callCount(), 1);
  subscription.unsubscribe();
});

test('timer - should emit at next macrotask directly if time/date is negative', async () => {
  const emitAt = new Date(Date.now() - 500);
  const observerMock = createMockObserver();
  const observable = timer(emitAt);
  const subscription = observable.subscribe(observerMock);

  // TODO: use timers when v20.4.0 gets into maintenance
  // https://nodejs.org/en/about/previous-releases
  // https://nodejs.org/api/test.html#class-mocktimers
  await new Promise((r) => setTimeout(r, 0));

  assert.deepStrictEqual(observerMock.next.mock.callCount(), 1);
  assert.deepStrictEqual(observerMock.error.mock.callCount(), 0);
  assert.deepStrictEqual(observerMock.complete.mock.callCount(), 1);
  subscription.unsubscribe();
});
