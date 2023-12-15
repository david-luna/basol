import assert from 'node:assert';
import { test } from 'node:test';

import { of } from '../../lib/factories/of.js';

test('of - should create an observable from 1 param', (t, done) => {
  of([1, 2, 3, 4, 5, 6]).subscribe({
    next: (value) => {
      assert.deepStrictEqual(value, [1, 2, 3, 4, 5, 6]);
    },
    complete: () => {
      done();
    },
  });
});

test('of - should create an observable from 1 param', (t, done) => {
  let expected = 1;
  of(1, 2, 3, 4, 5, 6).subscribe({
    next: (value) => {
      assert.strictEqual(value, expected++);
    },
    complete: () => {
      done();
    },
  });
});
