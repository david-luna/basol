import assert from 'node:assert';
import { test } from 'node:test';

import { from } from '../../lib/factories/from.js';
import { createObsevable } from '../../lib/observable.js';

/** @typedef {import('../__tools__/index.js').MockFunction} MockFunction */

test('from - should not accept bad input values', () => {
  try {
    // @ts-expect-error
    from({});
    assert.ifError('this hsould never happen');
  } catch (err) {
    assert.strictEqual(err.message, 'cannot create an observable for the given input');
  }
});

test('should create an observable from an array', (t, done) => {
  let expected = 1;
  from([1, 2, 3, 4, 5, 6]).subscribe({
    next: (val) => {
      assert.strictEqual(val, expected++);
    },
    complete: () => {
      done();
    },
  });
});

test('from - should accept a resolved promise as input', (t, done) => {
  from(Promise.resolve(true)).subscribe({
    next: (val) => {
      assert.strictEqual(val, true);
    },
    complete: () => {
      done();
    },
  });
});

test('from - should accept a rejected promise as input', (t, done) => {
  from(Promise.reject(new Error('promise rejected'))).subscribe({
    error: (err) => {
      // @ts-expect-error
      assert.strictEqual(err.message, 'promise rejected');
      done();
    },
  });
});

test('from - should accept a promise which resolves after a time', (t, done) => {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(true));
  });

  from(promise).subscribe({
    next: (val) => {
      assert.strictEqual(val, true);
    },
    complete: () => {
      done();
    },
  });
});

test('from - should accept a promise which rejects after a time', (t, done) => {
  const promise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('promise rejected')));
  });

  from(promise).subscribe({
    error: (err) => {
      // @ts-expect-error
      assert.strictEqual(err.message, 'promise rejected');
      done();
    },
  });
});

test('from - should accept an observable as input', (t, done) => {
  const observableInput = createObsevable((observer) => {
    observer.next(true);
    observer.complete();

    // TODO: remove this and check what's happening with the types
    return () => void 0;
  });

  const fromObservable = from(observableInput);

  assert.strictEqual(observableInput, fromObservable);
  from(fromObservable).subscribe({
    next: (val) => {
      assert.strictEqual(val, true);
    },
    complete: () => {
      done();
    },
  });
});
