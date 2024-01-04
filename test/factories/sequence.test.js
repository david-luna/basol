import assert from 'node:assert';
import { test } from 'node:test';

import { sequence } from '../../lib/factories/sequence.js';

test('sequence - should be able to get an observable which emits every 100ms', async () => {
  const values = [];
  const observable = sequence(100);
  const subscription = observable.subscribe({ next: (val) => values.push(val) });

  // TODO: use timers when v20.4.0 gets into maintenance
  // https://nodejs.org/en/about/previous-releases
  // https://nodejs.org/api/test.html#class-mocktimers
  await new Promise((r) => setTimeout(r, 450));
  subscription.unsubscribe();

  assert.deepStrictEqual(values, [0, 1, 2, 3]);
});

test('sequence - should create an observable emiting values given sequence function', async () => {
  const values = [];
  const double = (idx) => idx * 2;
  const observable = sequence(100, double);
  const subscription = observable.subscribe({ next: (val) => values.push(val) });

  // TODO: use timers when v20.4.0 gets into maintenance
  await new Promise((r) => setTimeout(r, 450));
  subscription.unsubscribe();

  assert.deepStrictEqual(values, [0, 2, 4, 6]);
});

test('sequence - should create an observable emiting values with no so simple factories', async () => {
  const values = [];
  const fibonacci = (index) => {
    return index < 2 ? index : fibonacci(index - 1) + fibonacci(index - 2);
  };
  const observable = sequence(100, fibonacci);
  const subscription = observable.subscribe({ next: (val) => values.push(val) });

  // TODO: use timers when v20.4.0 gets into maintenance
  await new Promise((r) => setTimeout(r, 650));
  subscription.unsubscribe();

  assert.deepStrictEqual(values, [0, 1, 1, 2, 3, 5]);
});
