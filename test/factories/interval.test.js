import assert from 'node:assert';
import { test } from 'node:test';

import { interval } from '../../lib/factories/interval.js';

test('interval - should be able to get an observable which emits every 100ms', async () => {
  const values = [];
  const observable = interval(100);
  const subscription = observable.subscribe({ next: (val) => values.push(val) });

  // TODO: use times when v20.4.0 gets into maintenance
  // https://nodejs.org/en/about/previous-releases
  // https://nodejs.org/api/test.html#class-mocktimers
  await new Promise((r) => setTimeout(r, 450));
  subscription.unsubscribe();

  assert.deepStrictEqual(values, [0, 1, 2, 3]);
});
