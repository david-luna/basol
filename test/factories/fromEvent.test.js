import assert from 'node:assert';
import { test } from 'node:test';
import EventEmitter from 'node:events';

import { createMockObserver } from '../__tools__/index.js';

import { fromEvent } from '../../lib/factories/fromEvent.js';

/** @typedef {import('../__tools__/index.js').MockFunction} MockFunction */

test('fromEvent - should be able to get an observable from EventEmitter', () => {
  const emitter = new EventEmitter();
  const observerMock = createMockObserver();
  const observable = fromEvent(emitter, 'custom-event');
  const subscription = observable.subscribe(observerMock);

  emitter.emit('custom-event', 1, true, 'one');
  emitter.emit('custom-event', 2, false, 'two');
  emitter.emit('custom-event', 3, false, 'three');
  subscription.unsubscribe();

  assert.deepStrictEqual(observerMock.next.mock.callCount(), 3);
  assert.deepStrictEqual(observerMock.next.mock.calls[0].arguments[0], [1, true, 'one']);
  assert.deepStrictEqual(observerMock.next.mock.calls[1].arguments[0], [2, false, 'two']);
  assert.deepStrictEqual(observerMock.next.mock.calls[2].arguments[0], [3, false, 'three']);
  assert.deepStrictEqual(observerMock.error.mock.callCount(), 0);
  assert.deepStrictEqual(observerMock.complete.mock.callCount(), 0);
});

test('fromEvent - should be able to get an observable from EventTarget', () => {
  const eventTarget = new EventTarget();
  const observerMock = createMockObserver();
  const observable = fromEvent(eventTarget, 'custom-event');
  const subscription = observable.subscribe(observerMock);

  eventTarget.dispatchEvent(new Event('custom-event', { bubbles: true }));
  eventTarget.dispatchEvent(new Event('custom-event', { bubbles: false }));
  eventTarget.dispatchEvent(new Event('custom-event', { cancelable: true }));
  subscription.unsubscribe();

  assert.deepStrictEqual(observerMock.next.mock.callCount(), 3);
  assert.strictEqual(observerMock.next.mock.calls[0].arguments[0].bubbles, true);
  assert.strictEqual(observerMock.next.mock.calls[1].arguments[0].bubbles, false);
  assert.strictEqual(observerMock.next.mock.calls[2].arguments[0].cancelable, true);
  assert.strictEqual(observerMock.error.mock.callCount(), 0);
  assert.strictEqual(observerMock.complete.mock.callCount(), 0);
});
