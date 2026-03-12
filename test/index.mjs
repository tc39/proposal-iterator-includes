import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../lib/index.js';

test('basic', async t => {
  let arr = [3, 6, 9];
  assert.equal(arr.values().includes(0), false);
  assert.equal(arr.values().includes(1), false);
  assert.equal(arr.values().includes(2), false);
  assert.equal(arr.values().includes(3), true);
  assert.equal(arr.values().includes(4), false);
  assert.equal(arr.values().includes(5), false);
  assert.equal(arr.values().includes(6), true);
  assert.equal(arr.values().includes(7), false);
  assert.equal(arr.values().includes(8), false);
  assert.equal(arr.values().includes(9), true);
  assert.equal(arr.values().includes(10), false);
});

test('infinite', async t => {
  let gen = function* () {
    for(let i = 0; ; ++i) yield i;
  };
  assert.equal(gen().includes(1000), true);
});

test('objects', async t => {
  let o = {};
  let arr = [o];
  assert.equal(arr.values().includes({}), false);
  assert.equal(arr.values().includes(o), true);
  assert.equal([].values().includes(o), false);
});

test('symbols', async t => {
  let s = Symbol('test');
  let arr = [s];
  assert.equal(arr.values().includes(Symbol('test')), false);
  assert.equal(arr.values().includes(s), true);
  assert.equal([].values().includes(s), false);
});

test('NaNs', async t => {
  let arr = [Number.NaN];
  assert.equal(arr.values().includes(0), false);
  assert.equal(arr.values().includes(Number.NaN), true);
  assert.equal([].values().includes(Number.NaN), false);
});

test('zeroes', async t => {
  let positive = [+0];
  let negative = [-0];
  assert.equal(positive.values().includes(+0), true);
  assert.equal(positive.values().includes(-0), true);
  assert.equal(negative.values().includes(+0), true);
  assert.equal(negative.values().includes(-0), true);
});

test('closes iterator after succeeding', async t => {
  let closed = false;
  let i = 0;
  let iter = {
    __proto__: Iterator.prototype,
    next() {
      ++i;
      return { value: i, done: false };
    },
    return() {
      closed = true;
      return { value: undefined, done: true };
    },
  };

  assert.equal(iter.includes(5), true);
  assert.equal(closed, true);
});

test('closes iterator after invalid second parameter', async t => {
  {
    let closed = false;
    let i = 0;
    let iter = {
      __proto__: Iterator.prototype,
      next() {
        ++i;
        return { value: i, done: false };
      },
      return() {
        closed = true;
        return { value: undefined, done: true };
      },
    };

    assert.throws(() => {
      iter.includes(null, -2);
    }, RangeError);
    assert.equal(closed, true);
  }

  {
    let closed = false;
    let i = 0;
    let iter = {
      __proto__: Iterator.prototype,
      next() {
        ++i;
        return { value: i, done: false };
      },
      return() {
        closed = true;
        return { value: undefined, done: true };
      },
    };

    assert.throws(() => {
      iter.includes(null, 'a string');
    }, TypeError);
    assert.equal(closed, true);
  }
});

test('skipped elements', async t => {
  await test('negative integral', async t => {
    assert.throws(() => {
      [].values().includes(0, -1);
    }, RangeError);
  });

  await test('negative non-integral', async t => {
    assert.throws(() => {
      [].values().includes(0, -0.1);
    }, TypeError);
  });

  await test('negative infinity', async t => {
    assert.throws(() => {
      [].values().includes(0, -2e308);
    }, RangeError);
  });

  await test('zero', async t => {
    assert.equal([4, 5, 6, 7].values().includes(8, 0), false);
    assert.equal([4, 5, 6, 7].values().includes(7, 0), true);
    assert.equal([4, 5, 6, 7].values().includes(6, 0), true);
    assert.equal([4, 5, 6, 7].values().includes(5, 0), true);
    assert.equal([4, 5, 6, 7].values().includes(4, 0), true);
    assert.equal([4, 5, 6, 7].values().includes(3, 0), false);

    assert.equal([4, 5, 6, 7].values().includes(8, -0), false);
    assert.equal([4, 5, 6, 7].values().includes(7, -0), true);
    assert.equal([4, 5, 6, 7].values().includes(6, -0), true);
    assert.equal([4, 5, 6, 7].values().includes(5, -0), true);
    assert.equal([4, 5, 6, 7].values().includes(4, -0), true);
    assert.equal([4, 5, 6, 7].values().includes(3, -0), false);
  });

  await test('positive integral', async t => {
    assert.equal([4, 5, 6, 7].values().includes(4, 1), false);
    assert.equal([4, 5, 6, 7].values().includes(4, 2), false);
    assert.equal([4, 5, 6, 7].values().includes(4, 3), false);
    assert.equal([4, 5, 6, 7].values().includes(4, 4), false);
    assert.equal([4, 5, 6, 7].values().includes(4, 5), false);

    assert.equal([4, 5, 6, 7].values().includes(5, 1), true);
    assert.equal([4, 5, 6, 7].values().includes(5, 2), false);
    assert.equal([4, 5, 6, 7].values().includes(5, 3), false);
    assert.equal([4, 5, 6, 7].values().includes(5, 4), false);
    assert.equal([4, 5, 6, 7].values().includes(5, 5), false);

    assert.equal([4, 5, 6, 7].values().includes(6, 1), true);
    assert.equal([4, 5, 6, 7].values().includes(6, 2), true);
    assert.equal([4, 5, 6, 7].values().includes(6, 3), false);
    assert.equal([4, 5, 6, 7].values().includes(6, 4), false);
    assert.equal([4, 5, 6, 7].values().includes(6, 5), false);

    assert.equal([4, 5, 6, 7].values().includes(7, 1), true);
    assert.equal([4, 5, 6, 7].values().includes(7, 2), true);
    assert.equal([4, 5, 6, 7].values().includes(7, 3), true);
    assert.equal([4, 5, 6, 7].values().includes(7, 4), false);
    assert.equal([4, 5, 6, 7].values().includes(7, 5), false);
  });

  await test('positive non-integral', async t => {
    assert.throws(() => {
      [].values().includes(0, 0.1);
    }, TypeError);
  });

  await test('positive infinity', async t => {
    let closed = false;
    let i = 0;
    let iter = {
      __proto__: Iterator.prototype,
      next() {
        ++i;
        if (i < 1000) {
          return { value: i, done: false };
        } else {
          closed = true;
          return { value: undefined, done: true };
        }
      },
      return() {
        closed = true;
        return { value: undefined, done: true };
      },
    };

    assert.equal(iter.includes(1, Infinity), false);
    assert.equal(closed, true);
  });

  await test('non-numeric', async t => {
    assert.throws(() => {
      [].values().includes(0, { valueOf() { return 0; } });
    }, TypeError);
  });
});

test('name', async t => {
  assert.equal(Iterator.prototype.includes.name, 'includes');
});

test('length', async t => {
  assert.equal(Iterator.prototype.includes.length, 1);
});

test('non-constructible', async t => {
  assert.throws(() => {
    new Iterator.prototype.includes(0);
  }, TypeError);
});

