import assert from 'node:assert';
import { test } from 'node:test';
import EventEmitter from 'node:events';

import { createMockObserver } from '../__tools__/index.js';

import { fromEventPattern } from '../../lib/factories/fromEventPattern.js';

/** @typedef {import('../__tools__/index.js').MockFunction} MockFunction */

test('fromEventPattern - should be able to get an observable without projection function', () => {
  const emitter = new EventEmitter();
  const observerMock = createMockObserver();
  const addHandler = (handler) => emitter.on('custom-event', handler);
  const removeHandler = (handler) => emitter.off('custom-event', handler);
  const observable = fromEventPattern(addHandler, removeHandler);
  const subscription = observable.subscribe(observerMock);

  emitter.emit('custom-event', 1, true, 'one');
  emitter.emit('custom-event', 2, false, 'two');
  emitter.emit('custom-event', 3, false, 'three');
  subscription.unsubscribe();

  assert.deepStrictEqual(observerMock.next.mock.callCount(), 3);
  assert.deepStrictEqual(observerMock.next.mock.calls[0].arguments[0], 1);
  assert.deepStrictEqual(observerMock.next.mock.calls[1].arguments[0], 2);
  assert.deepStrictEqual(observerMock.next.mock.calls[2].arguments[0], 3);
  assert.deepStrictEqual(observerMock.error.mock.callCount(), 0);
  assert.deepStrictEqual(observerMock.complete.mock.callCount(), 0);
});

test('fromEventPattern - should be able to get an observable with projection function', () => {
  const emitter = new EventEmitter();
  const observerMock = createMockObserver();
  const addHandler = (handler) => emitter.on('custom-event', handler);
  const removeHandler = (handler) => emitter.off('custom-event', handler);
  const observable = fromEventPattern(addHandler, removeHandler, (...args) => args.join(','));
  const subscription = observable.subscribe(observerMock);

  emitter.emit('custom-event', 1, true, 'one');
  emitter.emit('custom-event', 2, false, 'two');
  emitter.emit('custom-event', 3, false, 'three');
  subscription.unsubscribe();

  assert.deepStrictEqual(observerMock.next.mock.callCount(), 3);
  assert.deepStrictEqual(observerMock.next.mock.calls[0].arguments[0], '1,true,one');
  assert.deepStrictEqual(observerMock.next.mock.calls[1].arguments[0], '2,false,two');
  assert.deepStrictEqual(observerMock.next.mock.calls[2].arguments[0], '3,false,three');
  assert.deepStrictEqual(observerMock.error.mock.callCount(), 0);
  assert.deepStrictEqual(observerMock.complete.mock.callCount(), 0);
});
